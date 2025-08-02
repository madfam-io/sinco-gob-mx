import { test, expect } from "@playwright/test";

const baseURL = "http://localhost:5173";

test.beforeAll(async ({}, testInfo) => {
  // no-op
});

test("loads app and shows stats", async ({ page }) => {
  await page.goto(baseURL + "/public/index.html");
  await page.waitForSelector("#stat-total-occupations");
  const text = await page.locator("#stat-total-occupations").textContent();
  expect(text).not.toBeNull();
});

test("search highlights in tree", async ({ page }) => {
  await page.goto(baseURL + "/public/index.html");
  await page.fill("#searchInput", "1");
  await page.waitForTimeout(500);
  const highlighted = await page.locator("g.node.search-highlight").count();
  expect(highlighted).toBeGreaterThan(0);
});
