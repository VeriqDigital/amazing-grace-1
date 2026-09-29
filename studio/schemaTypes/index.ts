import { defineArrayMember, defineField, defineType } from "sanity";

const accessibleImage = defineType({
  name: "accessibleImage", title: "Photo", type: "image",
  options: { hotspot: true, accept: "image/jpeg,image/png,image/webp" },
  fields: [defineField({
    name: "alt", title: "Describe this photo", type: "string",
    description: "Describe what is visible for visitors using screen readers. Do not use just ‘photo’ or a filename.",
    validation: (rule) => rule.required().min(8).max(240),
  })],
  validation: (rule) => rule.custom((value) => !value || value.asset ? true : "Choose a photo."),
});

const event = defineType({
  name: "event", title: "Event / announcement", type: "document",
  groups: [{ name: "details", title: "Details", default: true }, { name: "schedule", title: "Dates & visibility" }],
  fields: [
    defineField({ name: "title", type: "string", group: "details", validation: (rule) => rule.required().max(100) }),
    defineField({ name: "slug", type: "slug", group: "details", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "type", type: "string", group: "details", initialValue: "event", options: { list: [{ title: "Event", value: "event" }, { title: "Announcement", value: "announcement" }], layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 3, group: "details", validation: (rule) => rule.required().max(300) }),
    defineField({ name: "body", title: "Full details", type: "array", group: "details", of: [defineArrayMember({ type: "block", styles: [{ title: "Paragraph", value: "normal" }, { title: "Heading", value: "h2" }], marks: { decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }], annotations: [] } })] }),
    defineField({ name: "image", type: "accessibleImage", group: "details" }),
    defineField({ name: "link", title: "Optional link", type: "object", group: "details", fields: [
      defineField({ name: "label", title: "Button text", type: "string", validation: (rule) => rule.required().max(60) }),
      defineField({ name: "url", title: "Website address", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
    ] }),
    defineField({ name: "date", title: "Event date / announcement start date", type: "date", group: "schedule", description: "Dates and times are local to Lufkin (Central Time). Announcements appear starting on this date.", validation: (rule) => rule.required() }),
    defineField({ name: "endDate", title: "Last day (optional)", type: "date", group: "schedule", description: "For multi-day events. For announcements, this is the last day to show the announcement.", validation: (rule) => rule.min(rule.valueOfField("date")) }),
    ...["startTime", "endTime"].map((name) => defineField({ name, title: name === "startTime" ? "Start time (optional)" : "End time (optional)", type: "string", group: "schedule", description: "24-hour Central Time, such as 14:30 for 2:30 pm. Leave blank if not confirmed.", hidden: ({ document }) => document?.type !== "event", validation: (rule) => rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "24-hour time (HH:mm)" }) })),
    defineField({ name: "published", title: "Show on the website", type: "boolean", group: "schedule", initialValue: false, description: "Turn on, then click Publish. Draft changes are never shown on the website." }),
    defineField({ name: "featured", title: "Feature on the homepage", type: "boolean", group: "schedule", initialValue: false, description: "Featured current/upcoming entries appear first on the homepage. Past events are still excluded." }),
  ],
  validation: (rule) => rule.custom((doc) => {
    if (doc?.startTime && doc?.endTime && (!doc.endDate || doc.endDate === doc.date) && String(doc.endTime) <= String(doc.startTime)) return "End time must follow start time, or choose a later last day.";
    if (doc?.endTime && !doc?.startTime) return "Add a start time when an end time is provided.";
    return true;
  }),
  orderings: [{ title: "Date (newest first)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "image" } },
});

const galleryItem = defineType({
  name: "galleryItem", title: "Gallery photo", type: "document",
  fields: [
    defineField({ name: "image", type: "accessibleImage", validation: (rule) => rule.required() }),
    defineField({ name: "caption", type: "string", validation: (rule) => rule.max(80) }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", initialValue: 10, description: "Lower numbers appear first.", validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: "active", title: "Show in gallery", type: "boolean", initialValue: true }),
  ],
  orderings: [{ title: "Display order", name: "displayOrderAsc", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: { select: { title: "image.alt", subtitle: "caption", media: "image" } },
});

const storeSettings = defineType({
  name: "storeSettings", title: "Store photos & visit note", type: "document",
  fields: [
    ...["hero", "about", "visit", "contact", "sell"].map((name) => defineField({ name: `${name}Image`, title: `${name[0].toUpperCase()}${name.slice(1)} photo`, type: "accessibleImage", description: "Optional. Leave empty to keep the original website photo." })),
    defineField({ name: "visitNote", title: "Visit note", type: "text", rows: 3, description: "Optional holiday hours or a brief note for visitors. For permanent contact details and regular hours, ask your website maintainer.", validation: (rule) => rule.max(240) }),
  ],
  preview: { prepare: () => ({ title: "Store photos & visit note" }) },
});

export const schemaTypes = [accessibleImage, event, galleryItem, storeSettings];
