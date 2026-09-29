import { MAX_PHOTOS, PHOTO_TYPES, validatePhotoFiles } from "./photo-limits";

// Browser convenience only. The server independently validates and decodes every upload.
export async function resizePhotos(formData: FormData) {
  const files = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > MAX_PHOTOS) throw new Error("Choose up to 5 photos.");
  const prepared: File[] = [];
  for (const file of files) {
    if (!PHOTO_TYPES.includes(file.type)) throw new Error("Choose JPG, PNG, or WebP photos. If your phone uses HEIC, export the photos as JPG first.");
    if (file.size > 20 * 1024 * 1024) throw new Error("Each original photo must be under 20 MB.");
    const bitmap = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not prepare these photos. Please try smaller JPG photos.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Could not prepare a photo. Please choose another.")), "image/webp", 0.8));
      prepared.push(new File([blob], `photo-${prepared.length + 1}.${blob.type === "image/webp" ? "webp" : "png"}`, { type: blob.type }));
    } finally { bitmap.close(); }
  }
  const problem = validatePhotoFiles(prepared);
  if (problem) throw new Error(problem);
  formData.delete("photos");
  prepared.forEach((photo) => formData.append("photos", photo));
}
