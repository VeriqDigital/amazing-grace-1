"use server";

import type { ContactFormState } from "./contact-form-state";
import { businessConfig } from "@/config/business";
import { sendWebsiteEmail } from "@/lib/email";
import { getFormString } from "@/lib/forms/validation";
import { parseContact } from "@/lib/forms/parse";
import { checkRateLimit } from "@/lib/forms/rate-limit";

export async function submitContactForm(_previousState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  if (getFormString(formData, "company")) return { status: "success", message: "Thank you. Your note has been received.", submittedAt: Date.now() };
  const { values, errors, subject } = parseContact(formData);
  if (Object.keys(errors).length) return { status: "error", message: "Please correct the highlighted fields and try again.", fieldErrors: errors, values };
  const rate = await checkRateLimit("contact", values.email);
  if (rate !== "allowed") return { status: "error", values, message: rate === "limited" ? "You’ve sent several messages recently. Please wait an hour before trying again, or call the shop." : `We’re unable to accept online messages right now. Please call ${businessConfig.contact.phone}.` };
  const delivery = await sendWebsiteEmail({
    formName: "contact", replyTo: values.email,
    subject: `[Amazing Grace Antiques] ${subject!.label} — ${values.name}`,
    text: ["New Amazing Grace Antiques website inquiry", "", `Name: ${values.name}`, `Email: ${values.email}`, `Phone: ${values.phone || "Not provided"}`, `Inquiry type: ${subject!.label}`, "", values.message, "", `Submitted: ${new Date().toISOString()}`].join("\n"),
  });
  if (!delivery.ok) return { status: "error", values, message: `We could not send your message right now. Please try again or call ${businessConfig.contact.phone}.` };
  return { status: "success", message: "Thank you. Your message has been sent to Amazing Grace Antiques.", submittedAt: Date.now() };
}
