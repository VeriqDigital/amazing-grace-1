import "server-only";
import { getSubmissionClient, PHOTO_BUCKET } from "./client";

export type ItemSubmission = {
  name: string; email: string; phone: string; category: string;
  description: string; approximate_age: string; asking_price_cents: number | null;
  additional_details: string; preferred_contact: "email" | "call" | "text";
};
export type StoredSubmission = ItemSubmission & {
  id: string; created_at: string; photo_paths: string[];
  notification_attempts: number; notification_lease: string;
};

export async function storeSubmission(item: ItemSubmission, photos: Buffer[]) {
  const db = getSubmissionClient();
  const id = crypto.randomUUID();
  const paths = photos.map((_, index) => `${id}/${index + 1}.webp`);
  // A staging row records every possible object path before any upload begins.
  const { error: insertError } = await db.from("antique_submissions").insert({ id, ...item, photo_paths: paths });
  if (insertError) throw new Error("Could not save the item.");
  try {
    for (let index = 0; index < photos.length; index++) {
      const { error } = await db.storage.from(PHOTO_BUCKET).upload(paths[index], photos[index], { contentType: "image/webp", upsert: false });
      if (error) throw new Error("Could not save an item photo.");
    }
    const { error } = await db.from("antique_submissions").update({ status: "received" }).eq("id", id);
    if (error) throw new Error("Could not finish saving the item.");
    return id;
  } catch {
    // A timed-out final update may have committed. Never delete a completed submission.
    const { data, error } = await db.from("antique_submissions").select("status").eq("id", id).single();
    if (!error && data?.status === "received") return id;
    // Staging rows/objects are retained for the scheduled cleanup, including uncertain writes.
    throw new Error("Could not finish saving the item.");
  }
}

export async function cleanupIncompleteSubmissions() {
  const db = getSubmissionClient();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await db.from("antique_submissions").select("id, photo_paths").eq("status", "uploading").lt("created_at", cutoff).limit(50);
  if (error) throw new Error("Could not read incomplete submissions.");
  for (const row of data || []) {
    if (row.photo_paths.length) {
      const { error } = await db.storage.from(PHOTO_BUCKET).remove(row.photo_paths);
      if (error) throw new Error("Could not clean up item photos.");
    }
    const { error } = await db.from("antique_submissions").delete().eq("id", row.id).eq("status", "uploading");
    if (error) throw new Error("Could not clean up an incomplete submission.");
  }
  const { error: rateError } = await db.from("form_rate_limits").delete().lt("expires_at", cutoff);
  if (rateError) throw new Error("Could not clean up expired rate limits.");
  // Exhausted crashed leases need visible manual attention rather than silently remaining 'sending'.
  const { error: queueError } = await db.from("antique_submissions").update({ notification_status: "failed" }).eq("notification_status", "sending").gte("notification_attempts", 8).lt("notification_next_attempt", new Date().toISOString());
  if (queueError) throw new Error("Could not update exhausted notifications.");
}
