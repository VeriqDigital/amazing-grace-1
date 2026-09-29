import "server-only";
import { createClient } from "@supabase/supabase-js";

export const PHOTO_BUCKET = "antique-submissions";
export function getSubmissionClient() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Submission storage is not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: {
    fetch: (input, init) => fetch(input, { ...init, signal: init?.signal || AbortSignal.timeout(15000), cache: "no-store" }),
  } });
}
