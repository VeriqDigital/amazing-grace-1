"use server";

import {
  antiqueCategories,
  preferredContactOptions,
  type AntiqueField,
  type AntiqueFormState,
} from "./form-state";
import { businessConfig } from "@/config/business";
import { sendWebsiteEmail } from "@/lib/email";
import {
  getFormString,
  hasLineBreaks,
  isValidEmail,
  isValidPhone,
} from "@/lib/forms/validation";

export async function submitAntiqueForm(
  _previousState: AntiqueFormState,
  formData: FormData,
): Promise<AntiqueFormState> {
  if (getFormString(formData, "company")) {
    return {
      status: "success",
      message: "Thanks for reaching out. Amazing Grace will review your item and follow up with you.",
      submittedAt: Date.now(),
    };
  }

  const name = getFormString(formData, "name");
  const email = getFormString(formData, "email");
  const phone = getFormString(formData, "phone");
  const category = getFormString(formData, "category");
  const approximateAge = getFormString(formData, "approximateAge");
  const itemDescription = getFormString(formData, "itemDescription");
  const additionalDetails = getFormString(formData, "additionalDetails");
  const preferredContact = getFormString(formData, "preferredContact") || "email";
  const fieldErrors: Partial<Record<AntiqueField, string>> = {};

  if (name.length < 2 || name.length > 100 || hasLineBreaks(name)) {
    fieldErrors.name = "Enter your name using 2 to 100 characters.";
  }

  if (!isValidEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (phone && !isValidPhone(phone)) {
    fieldErrors.phone = "Enter a valid phone number or leave this field blank.";
  }

  const selectedCategory = antiqueCategories.find((option) => option.value === category);
  if (category && !selectedCategory) {
    fieldErrors.category = "Choose a valid item category.";
  }

  if (approximateAge.length > 100 || hasLineBreaks(approximateAge)) {
    fieldErrors.approximateAge = "Keep the approximate age under 100 characters.";
  }

  if (itemDescription.length < 20 || itemDescription.length > 3000) {
    fieldErrors.itemDescription = "Describe the item using 20 to 3,000 characters.";
  }

  if (additionalDetails.length > 3000) {
    fieldErrors.additionalDetails = "Keep additional details under 3,000 characters.";
  }

  const selectedContact = preferredContactOptions.find(
    (option) => option.value === preferredContact,
  );
  if (!selectedContact) {
    fieldErrors.preferredContact = "Choose a valid contact method.";
  } else if (preferredContact !== "email" && !phone) {
    fieldErrors.phone = "Add a phone number for calls or text messages.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const emailText = [
    "New antique submission from the Amazing Grace Antiques website",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Preferred contact: ${selectedContact?.label}`,
    `Item category: ${selectedCategory?.label || "Not provided"}`,
    `Approximate age: ${approximateAge || "Not provided"}`,
    "",
    "Item description:",
    itemDescription,
    "",
    "Additional details:",
    additionalDetails || "Not provided",
    "",
    "Photos: Not included with this submission.",
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n");

  const delivery = await sendWebsiteEmail({
    formName: "antique",
    replyTo: email,
    subject: `[Amazing Grace Antiques] Item submission — ${selectedCategory?.label || "Uncategorized"} — ${name}`,
    text: emailText,
  });

  if (!delivery.ok) {
    return {
      status: "error",
      message: delivery.reason === "configuration"
        ? `We’re unable to accept online item submissions right now. Please call the shop at ${businessConfig.contact.phone}.`
        : "We could not send your item details right now. Please try again or call the shop.",
    };
  }

  return {
    status: "success",
    message: "Thanks for reaching out. Amazing Grace will review your item and follow up with you.",
    submittedAt: Date.now(),
  };
}
