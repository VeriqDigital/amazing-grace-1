import "server-only";
import sharp from "sharp";
import { validatePhotoFiles } from "./photo-limits";

export async function preparePhotos(files: File[]): Promise<Buffer[]> {
  const problem = validatePhotoFiles(files);
  if (problem) throw new Error(problem);
  const images: Buffer[] = [];
  for (const file of files) {
    const input = Buffer.from(await file.arrayBuffer());
    const signatureType = input.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])) ? "image/jpeg"
      : input.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ? "image/png"
      : input.toString("ascii", 0, 4) === "RIFF" && input.toString("ascii", 8, 12) === "WEBP" ? "image/webp" : null;
    if (signatureType !== file.type) throw new Error("The file contents do not match a supported photo type.");
    const image = sharp(input, { limitInputPixels: 40_000_000, failOn: "warning" });
    const metadata = await image.metadata();
    const mime = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" }[metadata.format as string];
    if (!mime || mime !== file.type || (metadata.pages || 1) !== 1) throw new Error("Choose still JPG, PNG, or WebP photos.");
    // Decode/re-encode genuine raster data. Sharp strips EXIF/GPS and other metadata by default.
    images.push(await image.rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer());
  }
  if (images.reduce((total, bytes) => total + bytes.length, 0) > 3 * 1024 * 1024) throw new Error("Please choose smaller photos.");
  return images;
}
