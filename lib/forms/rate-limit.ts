import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { getSubmissionClient } from "@/lib/submissions/client";

export async function checkRateLimit(form: "contact" | "antique", email: string): Promise<"allowed" | "limited" | "unavailable"> {
  try {
    const secret = process.env.FORM_RATE_LIMIT_SECRET;
    if (!secret || secret.length < 32) return "unavailable";
    const requestHeaders = await headers();
    // Trust only a header overwritten by the deployment's reverse proxy.
    const header = process.env.VERCEL ? "x-vercel-forwarded-for" : process.env.TRUSTED_IP_HEADER;
    const ip = header ? requestHeaders.get(header)?.split(",")[0]?.trim() : process.env.NODE_ENV === "development" ? "local-development" : null;
    if (!ip || ip.length > 128) return "unavailable";
    const hash = (value: string) => createHmac("sha256", secret).update(value).digest("hex");
    const { data, error } = await getSubmissionClient().rpc("consume_form_rate_limit", {
      p_keys: [hash(`ip:${ip}`), hash(`${form}:email:${email.toLowerCase()}`)],
      p_limits: [12, 4], p_windows: [900, 3600],
    });
    if (error) throw error;
    return data === true ? "allowed" : "limited";
  } catch { console.error("Form rate limiter unavailable."); return "unavailable"; }
}
