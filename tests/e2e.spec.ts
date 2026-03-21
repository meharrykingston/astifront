import { test } from "@playwright/test";

const routes = [
  "/",
  "/analysis",
  "/symptom/headache",
  "/symptoms/fever",
  "/symptoms/chronic-fatigue",
  "/indexcontrol/login",
  "/supermadin",
];

async function safeClickAllButtons(page: any) {
  const buttons = await page.locator("button").all();
  for (const button of buttons) {
    try {
      const visible = await button.isVisible();
      if (!visible) continue;
      const disabled = await button.isDisabled();
      if (disabled) continue;
      await button.click({ timeout: 2000 });
    } catch {
      // ignore single button failures during crawl
    }
  }
}

test.describe("route crawl", () => {
  for (const route of routes) {
    test(`crawl ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "networkidle" });
      await safeClickAllButtons(page);
    });
  }
});
