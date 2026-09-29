import type { AccessibleImage, EVENTS_QUERY_RESULT, EVENT_QUERY_RESULT, GALLERY_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "./sanity.types";

export type CmsImage = AccessibleImage;
export type StoreEvent = EVENTS_QUERY_RESULT[number];
export type EventDetail = NonNullable<EVENT_QUERY_RESULT>;
export type GalleryItem = GALLERY_QUERY_RESULT[number];
export type StoreSettings = Partial<NonNullable<SETTINGS_QUERY_RESULT>>;
