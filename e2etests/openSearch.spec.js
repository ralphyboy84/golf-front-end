import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.clock.setSystemTime(new Date("2026-02-01"));
  await page.goto("http://localhost:5173/");
});

test("Check you can navigate to the open searcher screen", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#buildATrip")).toBeVisible();
  await page.click("#openSearcher");
  await expect(page.locator("#calendar")).toBeVisible();
  await expect(page.locator("#calendar")).toHaveText(/February 2026/);
});

test("Check february content", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#buildATrip")).toBeVisible();
  await page.click("#openSearcher");
  await expect(page.locator("#calendar")).toBeVisible();
  await expect(page.locator("#calendar")).toHaveText(/February 2026/);

  await expect(page.locator('[data-date="2026-02-14"]')).toHaveText(
    /Duff House Royal - Ladies Banffshire Plus/,
  );
  await expect(page.locator('[data-date="2026-02-14"]')).toHaveText(
    /Vale of Leven - Calcutta Cup Texas Scramble/,
  );
});

test("Check filter on keyword", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#buildATrip")).toBeVisible();
  await page.click("#openSearcher");
  await expect(page.locator("#calendar")).toBeVisible();
  await page.click("#openFilters");
  await expect(
    page.locator("#openFilters").locator("#innerFilterDiv"),
  ).toBeVisible();
  await page.fill("#keywordSearch", "ladies");
  await expect(page.locator('[data-date="2026-02-14"]')).toHaveText(
    /Duff House Royal - Ladies Banffshire Plus/,
  );
});
