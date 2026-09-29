import "server-only";
import { createClient } from "@sanity/client";
import { cache } from "react";
import { EVENTS_QUERY, EVENT_QUERY, GALLERY_QUERY, SETTINGS_QUERY } from "./queries";
import type { EventDetail, GalleryItem, StoreEvent, StoreSettings } from "./types";

export const cmsConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
const client = cmsConfigured ? createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-09-28",
  perspective: "published",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  timeout: 8000,
  maxRetries: 1,
}) : null;

// Cache public editorial content for one minute; never cache submission data.
async function query<T>(groq: string, fallback: T, params: Record<string, string> = {}): Promise<T> {
  if (!client) return fallback;
  return client.fetch<T>(groq, params, { next: { revalidate: 60 } });
}
export const getEvents = cache(() => query<StoreEvent[]>(EVENTS_QUERY, []));
export const getEvent = cache((slug: string) => query<EventDetail | null>(EVENT_QUERY, null, { slug }));
export const getGallery = cache(() => query<GalleryItem[]>(GALLERY_QUERY, []));
export const getStoreSettings = cache(async () => {
  try { return await query<StoreSettings | null>(SETTINGS_QUERY, null) || {}; }
  catch { console.error("Store settings unavailable; using original photos."); return {}; }
});
