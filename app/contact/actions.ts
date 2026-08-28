"use server";

import {
  contactSubjects,
  type ContactField,
  type ContactFormState,
} from "./contact-form-state";
import { businessConfig } from "@/config/business";
import { sendWebsiteEmail } from "@/lib/email";
import {
  getFormString,
  hasLineBreaks,
  isValidEmail,
  isValidPhone,
} from "@/lib/forms/validation";

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const honeypot = getFormString(formData, "company");
  if (honeypot) {
    return {
      status: "success",
      message: "Thank you. Your note has been received.",
      submittedAt: Date.now(),
    };
  }

  const name = getFormString(formData, "name");
  const email = getFormString(formData, "email");
  const phone = getFormString(formData, "phone");
  const subject = getFormString(formData, "subject");
  const message = getFormString(formData, "message");
  const fieldErrors: Partial<Record<ContactField, string>> = {};

  if (name.length < 2 || name.length > 100 || hasLineBreaks(name)) {
    fieldErrors.name = "Enter your name using 2 to 100 characters.";
  }

  if (!isValidEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (phone && !isValidPhone(phone)) {
    fieldErrors.phone = "Enter a valid phone number or leave this field blank.";
  }

  const selectedSubject = contactSubjects.find((option) => option.value === subject);
  if (!selectedSubject) {
    fieldErrors.subject = "Choose an inquiry type.";
  }

  if (message.length < 10 || message.length > 3000) {
    fieldErrors.message = "Enter a message using 10 to 3,000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const emailText = [
    "New Amazing Grace Antiques website inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Inquiry type: ${selectedSubject?.label}`,
    "",
    "Message:",
    message,
    "",
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n");

  const delivery = await sendWebsiteEmail({
    formName: "contact",
    replyTo: email,
    subject: `[Amazing Grace Antiques] ${selectedSubject?.label} — ${name}`,
    text: emailText,
  });

  if (!delivery.ok) {
    return {
      status: "error",
      message: delivery.reason === "configuration"
        ? `We’re unable to accept online messages right now. Please call the shop at ${businessConfig.contact.phone}.`
        : "We could not send your message right now. Please try again or call the shop.",
    };
  }

  return {
    status: "success",
    message: "Thank you. Your message has been sent to Amazing Grace Antiques.",
    submittedAt: Date.now(),
  };
}
