import { timingSafeEqual } from "node:crypto";
import { cleanupIncompleteSubmissions } from "@/lib/submissions/repository";
import { deliverSubmissionNotifications } from "@/lib/submissions/notifications";

export const runtime = "nodejs";
export const maxDuration = 120;

// Call from a trusted scheduler. No public submission-reading endpoint is exposed.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret || ""}`);
  if (!secret || secret.length < 32 || provided.length !== expected.length || !timingSafeEqual(provided, expected)) return new Response("Unauthorized", { status: 401 });
  try {
    const result = await deliverSubmissionNotifications();
    await cleanupIncompleteSubmissions();
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Submission maintenance job failed.");
    return Response.json({ error: "Job failed; inspect service configuration and retry." }, { status: 503 });
  }
}
