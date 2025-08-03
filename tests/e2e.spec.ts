import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:5173";

test("cards show non-zero counts", async ({ page }) => {
  await page.goto(baseURL + "/public/index.html");
  await page.click("#btn-cards");
  await page.waitForSelector("#cardsView:not(.hidden)");
  const card = page.locator(".division-card").first();
  await expect(card).toBeVisible();
  const text = await card.textContent();
  const m = text?.match(/(\d+[\d,\.]*)\s+ocupaciones/);
  expect(m).toBeTruthy();
  const count = parseInt((m![1] || "0").replace(/[\.,]/g, ""), 10);
  expect(count).toBeGreaterThan(0);
});

test("card counts after filtering do not error", async ({ page }) => {
  await page.goto(baseURL + "/public/index.html");
  await page.click("#btn-cards");
  await page.waitForSelector("#cardsView:not(.hidden)");
  const card = page.locator(".division-card").first();
  await expect(card).toBeVisible();
  const hasFilter = await page.$("#filterFamily");
  if (hasFilter) {
    const options = await page.$$eval("#filterFamily option", (opts) =>
      opts.map((o) => (o as HTMLOptionElement).value)
    );
    const val = options.find((v) => v !== "");
    if (val) {
      await page.selectOption("#filterFamily", val);
      await page.waitForTimeout(300);
      const txt = await card.textContent();
      const mm = txt?.match(/(\d+[\d,\.]*)\s+ocupaciones/);
      expect(mm).toBeTruthy();
    }
  }
});
