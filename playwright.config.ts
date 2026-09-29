import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next start -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_SANITY_PROJECT_ID: "", NEXT_PUBLIC_SANITY_DATASET: "", SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "", RESEND_API_KEY: "", FORM_RATE_LIMIT_SECRET: "" },
  },
});
