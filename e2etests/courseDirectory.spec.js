import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Check you can navigate to index screen", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#courseDirectory")).toBeVisible();
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await expect(page.locator("#courseDirectoryHeader")).toHaveText(
    /Course Directory/,
  );
});

test("Check you view Leven", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#courseDirectory")).toBeVisible();
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await expect(page.locator("#courseDirectoryHeader")).toHaveText(
    /Course Directory/,
  );
  await page.selectOption("#courseDirectoryListSelect", "Leven");
  await page.click("#viewCourse");
  await expect(page.locator("#levenlinks_div")).toBeVisible();
  await expect(page.locator("#levenlinks_div").locator("figure")).toBeVisible();
  await expect(
    page.locator("#levenlinks_div").locator("#viewCourseGallery"),
  ).toBeVisible();
});

test("Check Leven gallery exists", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#courseDirectory")).toBeVisible();
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await expect(page.locator("#courseDirectoryHeader")).toHaveText(
    /Course Directory/,
  );
  await page.selectOption("#courseDirectoryListSelect", "Leven");
  await page.click("#viewCourse");
  await expect(page.locator("#levenlinks_div")).toBeVisible();
  await expect(page.locator("#levenlinks_div").locator("figure")).toBeVisible();
  await expect(
    page.locator("#levenlinks_div").locator("#viewCourseGallery"),
  ).toBeVisible();
  await page.click("#viewCourseGallery");
  await expect(page.locator("#carouselDiv").locator(".carousel")).toBeVisible();
});

test("Check Aberdour has no image", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#courseDirectory")).toBeVisible();
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await expect(page.locator("#courseDirectoryHeader")).toHaveText(
    /Course Directory/,
  );
  await page.selectOption("#courseDirectoryListSelect", "Aberdour");
  await page.click("#viewCourse");
  await expect(page.locator("#aberdour_div")).toBeVisible();
  await expect(
    page.locator("#aberdour_div").locator("figure"),
  ).not.toBeVisible();
  await expect(
    page.locator("#aberdour_div").locator("#viewCourseGallery"),
  ).not.toBeVisible();
});
