import "server-only";
import { getSubmissionClient, PHOTO_BUCKET } from "./client";
import type { StoredSubmission } from "./repository";
import { sendWebsiteEmail } from "@/lib/email";

export async function deliverSubmissionNotifications(id?: string) {
  const db = getSubmissionClient();
  const { data, error } = await db.rpc("claim_submission_notifications", { p_id: id || null });
  if (error) throw new Error("Could not claim notifications.");
  let sent = 0;
  for (const row of (data || []) as StoredSubmission[]) {
    let delivered = false;
    try {
      const attachments = [];
      for (let index = 0; index < row.photo_paths.length; index++) {
        const { data, error } = await db.storage.from(PHOTO_BUCKET).download(row.photo_paths[index]);
        if (error || !data) throw new Error("Could not read an item photo.");
        attachments.push({ filename: `item-photo-${index + 1}.webp`, content: Buffer.from(await data.arrayBuffer()).toString("base64") });
      }
      const delivery = await sendWebsiteEmail({
        formName: "antique", replyTo: row.email,
        idempotencyKey: `antique-submission-${row.id}`,
        subject: `[Amazing Grace Antiques] Item submission — ${row.name}`,
        text: ["New antique submission", `Reference: ${row.id}`, `Submitted: ${row.created_at}`, "", `Name: ${row.name}`, `Email: ${row.email}`, `Phone: ${row.phone || "Not provided"}`, `Preferred contact: ${row.preferred_contact}`, `Category: ${row.category || "Not provided"}`, `Approximate age: ${row.approximate_age || "Not provided"}`, `Asking price: ${row.asking_price_cents === null ? "Not provided" : `$${(row.asking_price_cents / 100).toFixed(2)} USD`}`, "", row.description, "", row.additional_details || "", "", `${row.photo_paths.length} photo(s) attached.`, "This inquiry does not imply a purchase or appraisal."].join("\n"),
        attachments,
      });
      delivered = delivery.ok;
    } catch { console.error("Item notification attempt failed."); }
    const { error: updateError } = await db.from("antique_submissions").update({
      notification_status: delivered ? "sent" : row.notification_attempts >= 8 ? "failed" : "pending",
      notification_sent_at: delivered ? new Date().toISOString() : null,
      notification_next_attempt: new Date(Date.now() + Math.min(3600, 60 * 2 ** row.notification_attempts) * 1000).toISOString(),
    }).eq("id", row.id).eq("notification_lease", row.notification_lease);
    if (updateError) throw new Error("Could not record notification delivery.");
    if (delivered) sent++;
  }
  return { attempted: data?.length || 0, sent };
}
