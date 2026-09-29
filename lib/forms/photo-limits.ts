export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
export const MAX_TOTAL_PHOTO_BYTES = 3 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validatePhotoFiles(files: File[]): string | undefined {
  if (files.length > MAX_PHOTOS) return "Choose up to 5 photos.";
  if (files.some((file) => !PHOTO_TYPES.includes(file.type))) return "Choose JPG, PNG, or WebP photos. Other file types are not supported.";
  if (files.some((file) => file.size === 0 || file.size > MAX_PHOTO_BYTES) || files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_PHOTO_BYTES) return "Photos must total 3 MB or less. Please choose smaller photos or send fewer at a time.";
}
