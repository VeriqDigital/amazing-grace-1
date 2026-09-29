import { antiqueCategories, preferredContactOptions, type ItemField } from "@/app/sell/form-state";
import { contactSubjects, type ContactField } from "@/app/contact/contact-form-state";
import { getFormString, hasLineBreaks, isValidEmail, isValidPhone } from "./validation";

function contactFields(formData: FormData) {
  const values = { name: getFormString(formData, "name"), email: getFormString(formData, "email"), phone: getFormString(formData, "phone") };
  const errors: Partial<Record<ContactField, string>> = {};
  if (values.name.length < 2 || values.name.length > 100 || hasLineBreaks(values.name)) errors.name = "Enter your name using 2 to 100 characters.";
  if (!isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  if (values.phone && !isValidPhone(values.phone)) errors.phone = "Enter a phone number with at least 7 digits, or leave this field blank.";
  return { values, errors };
}

export function parseContact(formData: FormData) {
  const base = contactFields(formData);
  const values = { ...base.values, subject: getFormString(formData, "subject"), message: getFormString(formData, "message") };
  const errors = base.errors;
  const subject = contactSubjects.find((option) => option.value === values.subject);
  if (!subject) errors.subject = "Choose an inquiry type.";
  if (values.message.length < 10 || values.message.length > 3000) errors.message = "Enter a message using 10 to 3,000 characters.";
  return { values, errors, subject };
}

export function parseAntique(formData: FormData) {
  const base = contactFields(formData);
  const values = {
    ...base.values,
    category: getFormString(formData, "category"), approximateAge: getFormString(formData, "approximateAge"),
    askingPrice: getFormString(formData, "askingPrice"), itemDescription: getFormString(formData, "itemDescription"),
    additionalDetails: getFormString(formData, "additionalDetails"), preferredContact: getFormString(formData, "preferredContact") || "email",
  };
  const errors: Partial<Record<ItemField, string>> = { ...base.errors };
  const category = antiqueCategories.find((option) => option.value === values.category);
  if (values.category && !category) errors.category = "Choose a valid item category.";
  if (values.approximateAge.length > 100 || hasLineBreaks(values.approximateAge)) errors.approximateAge = "Keep the approximate age under 100 characters.";
  if (values.itemDescription.length < 20 || values.itemDescription.length > 3000) errors.itemDescription = "Describe the item using 20 to 3,000 characters.";
  if (values.additionalDetails.length > 3000) errors.additionalDetails = "Keep additional details under 3,000 characters.";
  const preferredContact = preferredContactOptions.find((option) => option.value === values.preferredContact);
  if (!preferredContact) errors.preferredContact = "Choose a valid contact method.";
  else if (values.preferredContact !== "email" && !values.phone) errors.phone = "Add a phone number for calls or text messages.";
  if (values.askingPrice && !/^\d{1,7}(\.\d{1,2})?$/.test(values.askingPrice)) errors.askingPrice = "Enter a price in US dollars, such as 125 or 125.50, or leave it blank.";
  const askingPriceCents = values.askingPrice && !errors.askingPrice ? Math.round(Number(values.askingPrice) * 100) : null;
  return { values, errors, category, preferredContact, askingPriceCents };
}
