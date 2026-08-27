export const contactSubjects = [
  { value: "selling", label: "Selling an Antique" },
  { value: "item", label: "Item or Inventory Question" },
  { value: "event", label: "Event or Announcement" },
  { value: "visit", label: "Visiting the Store" },
  { value: "general", label: "General Question" },
] as const;

export type ContactField = "name" | "email" | "phone" | "subject" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  submittedAt?: number;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
};
