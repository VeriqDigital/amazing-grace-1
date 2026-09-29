import { defineQuery } from "groq";

export const EVENTS_QUERY = defineQuery(`*[_type == "event" && published == true && defined(slug.current)] | order(date asc, _id asc) {
  _id, _updatedAt, title, "slug": slug.current, type, shortDescription, date, endDate, startTime, endTime, featured
}`);
export const EVENT_QUERY = defineQuery(`*[_type == "event" && published == true && slug.current == $slug][0] {
  _id, _updatedAt, title, "slug": slug.current, type, shortDescription, body, date, endDate, startTime, endTime, featured, image, link
}`);
export const GALLERY_QUERY = defineQuery(`*[_type == "galleryItem" && active == true && defined(image.asset) && defined(image.alt)] | order(displayOrder asc, _id asc) {
  _id, image, caption, displayOrder
}`);
export const SETTINGS_QUERY = defineQuery(`*[_type == "storeSettings" && _id == "storeSettings"][0] {
  heroImage, aboutImage, visitImage, contactImage, sellImage, visitNote
}`);
