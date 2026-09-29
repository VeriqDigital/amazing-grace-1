import { createImageUrlBuilder } from "@sanity/image-url";
import type { CmsImage } from "./types";

export function imageUrl(image: CmsImage | null | undefined, width = 1600, height?: number) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!image?.asset?._ref || !image.alt?.trim() || !projectId || !dataset) return undefined;
  try {
    let builder = createImageUrlBuilder({ projectId, dataset }).image(image).width(width).auto("format").quality(85);
    if (height) builder = builder.height(height).fit("crop");
    return builder.url();
  } catch { return undefined; }
}
