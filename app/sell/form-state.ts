export const antiqueCategories = [
  { value: "furniture", label: "Furniture" },
  { value: "decor", label: "Home Décor" },
  { value: "jewelry", label: "Jewelry" },
  { value: "collectibles", label: "Collectibles" },
  { value: "textiles", label: "Textiles or Clothing" },
  { value: "tools", label: "Tools" },
  { value: "other", label: "Other or Unsure" },
] as const;

export const preferredContactOptions = [
  { value: "email", label: "Email" },
  { value: "call", label: "Phone call" },
  { value: "text", label: "Text message" },
] as const;

export type AntiqueField =
  | "name"
  | "email"
  | "phone"
  | "category"
  | "approximateAge"
  | "itemDescription"
  | "additionalDetails"
  | "preferredContact";

export type AntiqueFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<AntiqueField, string>>;
  submittedAt?: number;
};

export const initialAntiqueFormState: AntiqueFormState = {
  status: "idle",
  message: "",
};
