import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

test("migration enforces private access, atomic rate limits, and exclusive notification claims", async () => {
  const db = new PGlite();
  try {
    // Model the roles and bucket catalog supplied by Supabase; run the actual app migration.
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema storage;
      create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);`);
    await db.exec(await readFile(new URL("../supabase/migrations/202609280001_submissions.sql", import.meta.url), "utf8"));
    const bucket = await db.query<{ public: boolean }>("select public from storage.buckets where id = 'antique-submissions'");
    assert.equal(bucket.rows[0].public, false);
    await db.exec("set role anon");
    await assert.rejects(db.query("select * from public.antique_submissions"), /permission denied/);
    await assert.rejects(db.query("select public.claim_submission_notifications()"), /permission denied/);
    await assert.rejects(db.query("select public.consume_form_rate_limit(array['a','b'], array[2,2], array[900,3600])"), /permission denied/);
    await db.exec("reset role; set role authenticated");
    await assert.rejects(db.query("select * from public.antique_submissions"), /permission denied/);
    await db.exec("reset role; set role service_role");
    const consume = () => db.query<{ allowed: boolean }>("select public.consume_form_rate_limit(array['a','b'], array[2,2], array[900,3600]) as allowed");
    const calls = await Promise.all([consume(), consume(), consume()]);
    assert.deepEqual(calls.map((call) => call.rows[0].allowed), [true, true, false]);
    await db.exec("update public.form_rate_limits set expires_at = now() - interval '1 second'");
    assert.equal((await consume()).rows[0].allowed, true);
    await db.exec(`insert into public.antique_submissions (id, name, email, description, preferred_contact, status)
      values ('00000000-0000-4000-8000-000000000001','Test','test@example.com','Item details','email','received'),
             ('00000000-0000-4000-8000-000000000002','Test','test@example.com','Item details','email','uploading');`);
    const first = await db.query<{ id: string; notification_attempts: number; notification_lease: string }>("select * from public.claim_submission_notifications()");
    assert.equal(first.rows.length, 1); assert.equal(first.rows[0].notification_attempts, 1);
    assert.ok(first.rows[0].notification_lease);
    assert.equal((await db.query("select * from public.claim_submission_notifications()")).rows.length, 0);
    await db.exec("update public.antique_submissions set notification_next_attempt = now() - interval '1 second' where status = 'received'");
    const retry = await db.query<{ notification_attempts: number; notification_lease: string }>("select * from public.claim_submission_notifications()");
    assert.equal(retry.rows[0].notification_attempts, 2);
    assert.notEqual(retry.rows[0].notification_lease, first.rows[0].notification_lease);
  } finally { await db.close(); }
});
