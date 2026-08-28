const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\-.\s\d]{7,30}$/;

export const getFormString = (formData: FormData, name: string) => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

export const hasLineBreaks = (value: string) => /[\r\n]/.test(value);

export const isValidEmail = (value: string) =>
  value.length <= 254 && emailPattern.test(value);

export const isValidPhone = (value: string) =>
  value.length <= 30 && phonePattern.test(value);
