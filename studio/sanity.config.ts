import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error("Set SANITY_STUDIO_PROJECT_ID in studio/.env.local before starting Studio.");

export default defineConfig({
  name: "amazing-grace",
  title: "Amazing Grace Antiques",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({
    structure: (S) => S.list().title("Manage the website").items([
      S.documentTypeListItem("event").title("Events & announcements"),
      S.documentTypeListItem("galleryItem").title("Gallery photos"),
      S.listItem().title("Store photos & visit note").child(
        S.document().schemaType("storeSettings").documentId("storeSettings"),
      ),
    ]),
  })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => template.schemaType !== "storeSettings"),
  },
  document: {
    actions: (actions, context) => context.schemaType === "storeSettings"
      ? actions.filter(({ action }) => !["delete", "duplicate", "unpublish"].includes(action || ""))
      : actions,
  },
});
