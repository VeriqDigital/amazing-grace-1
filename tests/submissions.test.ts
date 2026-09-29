import { test } from "node:test";
import assert from "node:assert/strict";
import { storeSubmission, type ItemSubmission } from "../lib/submissions/repository";
import { deliverSubmissionNotifications } from "../lib/submissions/notifications";
import { GET } from "../app/api/jobs/submissions/route";

const item: ItemSubmission = { name: "Test Visitor", email: "test@example.com", phone: "", category: "", description: "A vintage chair with carved details", approximate_age: "", asking_price_cents: null, additional_details: "", preferred_contact: "email" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const configure = () => { process.env.SUPABASE_URL = "https://storage.example.test"; process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key"; process.env.RESEND_API_KEY = "test-email-key"; process.env.CONTACT_FROM_EMAIL = "test@example.com"; process.env.CONTACT_TO_EMAIL = "owner@example.com"; };

test("submission records object paths before upload and becomes received only after upload", async (t) => {
  configure();
  const steps: string[] = [];
  let record: Record<string, unknown> = {};
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    if (url.includes("/rest/v1/antique_submissions")) {
      if (init.method === "POST") { steps.push("insert"); record = JSON.parse(String(init.body)); }
      if (init.method === "PATCH") { steps.push("ready"); assert.deepEqual(JSON.parse(String(init.body)), { status: "received" }); }
      return json(null, 201);
    }
    assert.ok(url.includes("/storage/v1/object/antique-submissions/"));
    assert.equal(init.method, "POST"); steps.push("upload"); return json({ Key: "photo" });
  });
  const id = await storeSubmission(item, [Buffer.from("sanitized-image")]);
  assert.deepEqual(steps, ["insert", "upload", "ready"]);
  assert.deepEqual(record.photo_paths, [`${id}/1.webp`]);
});
test("failed photo uploads leave a traceable staging record and never notify", async (t) => {
  configure();
  const methods: string[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    methods.push(init.method || "GET");
    if (url.includes("/storage/")) return json({ message: "Unavailable" }, 503);
    if (init.method === "GET") return json({ status: "uploading" });
    return json(null, 201);
  });
  await assert.rejects(() => storeSubmission(item, [Buffer.from("image")]));
  assert.equal(methods.includes("PATCH"), false);
  assert.equal(methods.includes("DELETE"), false);
});
test("an ambiguous final write is checked before reporting failure", async (t) => {
  configure();
  t.mock.method(globalThis, "fetch", async (_url: string, init: RequestInit) => {
    if (init.method === "PATCH") return json({ message: "Timeout" }, 504);
    if (init.method === "GET") return json({ status: "received" });
    return json(null, 201);
  });
  assert.match(await storeSubmission(item, []), /^[\da-f-]{36}$/);
});
test("notification failure is queued and retry uses a stable idempotency key and private attachments", async (t) => {
  configure();
  let attempt = 0;
  const keys: string[] = [];
  const states: string[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    if (url.includes("/rpc/")) return json([{ ...item, id: "test-id", created_at: "2026-09-28T12:00:00Z", photo_paths: ["test-id/1.webp"], notification_attempts: ++attempt, notification_lease: "lease" }]);
    if (url.includes("/storage/")) return new Response(new Uint8Array([1, 2, 3]), { headers: { "Content-Type": "image/webp" } });
    if (url.includes("api.resend.com")) {
      keys.push(new Headers(init.headers).get("Idempotency-Key")!);
      const email = JSON.parse(String(init.body));
      assert.equal(email.reply_to, item.email); assert.equal(email.to[0], "owner@example.com");
      assert.equal(email.attachments[0].content, "AQID");
      return json({ id: "email-id" }, attempt === 1 ? 503 : 200);
    }
    states.push(JSON.parse(String(init.body)).notification_status);
    return json(null);
  });
  assert.deepEqual(await deliverSubmissionNotifications(), { attempted: 1, sent: 0 });
  assert.deepEqual(await deliverSubmissionNotifications(), { attempted: 1, sent: 1 });
  assert.deepEqual(keys, ["antique-submission-test-id", "antique-submission-test-id"]);
  assert.deepEqual(states, ["pending", "sent"]);
});
test("maintenance endpoint rejects missing and incorrect credentials before touching services", async () => {
  delete process.env.CRON_SECRET;
  assert.equal((await GET(new Request("http://localhost/api/jobs/submissions"))).status, 401);
  process.env.CRON_SECRET = "a".repeat(32);
  assert.equal((await GET(new Request("http://localhost/api/jobs/submissions", { headers: { authorization: `Bearer ${"b".repeat(32)}` } }))).status, 401);
});
