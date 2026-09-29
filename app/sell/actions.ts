"use server";

import type { AntiqueFormState } from "./form-state";
import { businessConfig } from "@/config/business";
import { getFormString } from "@/lib/forms/validation";
import { parseAntique } from "@/lib/forms/parse";
import { validatePhotoFiles } from "@/lib/forms/photo-limits";
import { preparePhotos } from "@/lib/forms/photos";
import { checkRateLimit } from "@/lib/forms/rate-limit";
import { storeSubmission } from "@/lib/submissions/repository";
import { deliverSubmissionNotifications } from "@/lib/submissions/notifications";

export async function submitAntiqueForm(_previousState: AntiqueFormState, formData: FormData): Promise<AntiqueFormState> {
  if (getFormString(formData, "company")) return { status: "success", message: "Thank you. Your item details have been received.", submittedAt: Date.now() };
  const { values, errors, preferredContact, askingPriceCents } = parseAntique(formData);
  const photoValues = formData.getAll("photos");
  const files = photoValues.filter((value): value is File => value instanceof File && value.size > 0);
  if (photoValues.some((value) => typeof value === "string")) errors.photos = "Choose photos using the photo upload field.";
  else {
    const problem = validatePhotoFiles(files);
    if (problem) errors.photos = problem;
  }
  if (Object.keys(errors).length) return { status: "error", message: "Please correct the highlighted fields and try again.", fieldErrors: errors, values };
  const unavailable = `We’re unable to accept online item submissions right now. Please call ${businessConfig.contact.phone}.`;
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM_EMAIL || !process.env.CONTACT_TO_EMAIL) return { status: "error", values, message: unavailable };
  const rate = await checkRateLimit("antique", values.email);
  if (rate !== "allowed") return { status: "error", values, message: rate === "limited" ? "You’ve sent several inquiries recently. Please wait an hour before trying again, or call the shop." : unavailable };
  let photos: Buffer[];
  try { photos = await preparePhotos(files); }
  catch { return { status: "error", values, message: "One of the photos could not be read. Please choose another photo and try again.", fieldErrors: { photos: "Use still JPG, PNG, or WebP photos, up to 40 megapixels and 3 MB total after resizing." } }; }
  let id: string;
  try {
    id = await storeSubmission({
      name: values.name, email: values.email, phone: values.phone, category: values.category,
      description: values.itemDescription, approximate_age: values.approximateAge,
      asking_price_cents: askingPriceCents, additional_details: values.additionalDetails,
      preferred_contact: preferredContact!.value,
    }, photos);
  } catch {
    console.error("Item submission could not be saved.");
    return { status: "error", values, message: `We could not finish saving your item. Please try again or call ${businessConfig.contact.phone}.` };
  }
  // Durable receipt is independent of email availability. The scheduler retries the saved notification.
  try { await deliverSubmissionNotifications(id); }
  catch { console.error("Item saved; email notification awaits retry."); }
  return { status: "success", message: "Thank you. Your item details and any photos have been received. The Amazing Grace team will review your inquiry.", submittedAt: Date.now() };
}
