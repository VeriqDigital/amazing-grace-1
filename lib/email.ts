import "server-only";

type WebsiteEmail = {
  formName: "contact" | "antique";
  replyTo: string;
  subject: string;
  text: string;
  idempotencyKey?: string;
  attachments?: { filename: string; content: string }[];
};

export type EmailDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "configuration" | "delivery" };

export async function sendWebsiteEmail({
  formName,
  replyTo,
  subject,
  text,
  idempotencyKey,
  attachments,
}: WebsiteEmail): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Website email delivery is missing required environment configuration.");
    return { ok: false, reason: "configuration" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey || `amazing-grace-${formName}-${crypto.randomUUID()}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: replyTo,
        subject,
        text,
        ...(attachments?.length ? { attachments } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`Website email delivery failed with status ${response.status}.`);
      return { ok: false, reason: "delivery" };
    }
  } catch {
    console.error("Website email delivery failed.");
    return { ok: false, reason: "delivery" };
  }

  return { ok: true };
}
