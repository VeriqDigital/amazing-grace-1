import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  schemaExtraction: { enabled: true, enforceRequiredFields: true },
  typegen: {
    enabled: true,
    path: "../lib/cms/queries.ts",
    schema: "schema.json",
    generates: "../lib/cms/sanity.types.ts",
  },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});
