"use server";

import {
  antiqueCategories,
  preferredContactOptions,
  type AntiqueField,
  type AntiqueFormState,
} from "./form-state";
import { siteConfig } from "@/config/site";
import { sendWebsiteEmail } from "@/lib/email";

const getString = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

export async function submitAntiqueForm(
  _previousState: AntiqueFormState,
  formData: FormData,
): Promise<AntiqueFormState> {
  if (getString(formData, "company")) {
    return {
      status: "success",
      message: "Thanks for reaching out. Amazing Grace will review your item and follow up with you.",
      submittedAt: Date.now(),
    };
  }

  const name = getString(formData, "name");
  const email = getString(formData, "email");
  const phone = getString(formData, "phone");
  const category = getString(formData, "category");
  const approximateAge = getString(formData, "approximateAge");
  const itemDescription = getString(formData, "itemDescription");
  const additionalDetails = getString(formData, "additionalDetails");
  const preferredContact = getString(formData, "preferredContact") || "email";
  const fieldErrors: Partial<Record<AntiqueField, string>> = {};

  if (name.length < 2 || name.length > 100 || /[\r\n]/.test(name)) {
    fieldErrors.name = "Enter your name using 2 to 100 characters.";
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (phone && (phone.length > 30 || !/^[+()\-.\s\d]{7,30}$/.test(phone))) {
    fieldErrors.phone = "Enter a valid phone number or leave this field blank.";
  }

  const selectedCategory = antiqueCategories.find((option) => option.value === category);
  if (category && !selectedCategory) {
    fieldErrors.category = "Choose a valid item category.";
  }

  if (approximateAge.length > 100 || /[\r\n]/.test(approximateAge)) {
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
        ? `We’re unable to accept online item submissions right now. Please call the shop at ${siteConfig.contact.phone}.`
        : "We could not send your item details right now. Please try again or call the shop.",
    };
  }

  return {
    status: "success",
    message: "Thanks for reaching out. Amazing Grace will review your item and follow up with you.",
    submittedAt: Date.now(),
  };
}
