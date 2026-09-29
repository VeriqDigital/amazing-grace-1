import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("pages remain readable, accessible, and free of horizontal overflow", async ({ page }, testInfo) => {
  for (const path of ["/", "/events", "/contact", "/sell"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    for (const photo of await page.locator("main img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toHaveJSProperty("complete", true);
      expect(await photo.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath(`${path.replace(/\//g, "") || "home"}.png`), fullPage: true });
  }
});

test("empty events, missing event, and protected maintenance endpoint", async ({ page, request }) => {
  await page.goto("/events");
  await expect(page.getByText("No upcoming events or announcements are posted right now.", { exact: false })).toBeVisible();
  await page.goto("/events/not-a-real-event");
  await expect(page.getByRole("heading", { name: "We couldn’t find that page." })).toBeVisible();
  expect((await request.get("/api/jobs/submissions")).status()).toBe(401);
});

test("unconfigured contact delivery gives an accessible error and retains entered details", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name", { exact: false }).fill("Test Visitor");
  await page.getByLabel("Email", { exact: false }).fill("test@example.com");
  await page.getByLabel("Inquiry type").selectOption("item");
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("I would like to ask about a vintage item.");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("unable to accept online messages");
  await expect(page.getByLabel("Name", { exact: false })).toHaveValue("Test Visitor");
  await expect(page.getByRole("textbox", { name: "Message", exact: true })).toHaveValue("I would like to ask about a vintage item.");
  await expect(page.locator("form").getByRole("alert")).toBeFocused();
});

test("item form keeps photos and values after recoverable errors", async ({ page }) => {
  await page.goto("/sell");
  await page.getByLabel("Name", { exact: false }).fill("Test Visitor");
  await page.getByLabel("Email", { exact: false }).fill("test@example.com");
  await page.getByLabel("Item description").fill("An old wooden chair with decorative carving.");
  await page.getByLabel("Asking price (USD)", { exact: false }).fill("-10");
  await page.getByLabel("Item photos", { exact: false }).setInputFiles("public/images/shop/vintage-chair.jpg");
  await page.getByRole("button", { name: "Submit Item" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("correct the highlighted fields");
  await expect(page.getByLabel("Asking price (USD)", { exact: false })).toBeFocused();
  await expect(page.getByText("1 photo(s) selected.", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Item description")).toHaveValue("An old wooden chair with decorative carving.");
  await page.getByLabel("Asking price (USD)", { exact: false }).fill("125");
  await page.getByRole("button", { name: "Submit Item" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("unable to accept online item submissions");
});

test("mobile menu has named controls, a keyboard focus loop, and Escape returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation only");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.click();
  const close = page.getByRole("button", { name: "Close menu", exact: true });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("dialog").getByRole("link").last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
