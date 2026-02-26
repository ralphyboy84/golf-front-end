import { test, expect } from "@playwright/test";
import { interceptGetCourseAvailabilityForDateAPICall } from "./helpers/getCourseAvailabilityForDate";
import { interceptGetCoursesAPICall } from "./helpers/getCoursesHelper";

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.clock.setSystemTime(new Date("2026-02-01"));
  await page.goto("/");
  await interceptGetCoursesAPICall(page);
});

test("Check you can navigate to index screen", async ({ page }) => {
  await page.click("#dropDownButton");
  await expect(page.locator("#dayAvailability")).toBeVisible();
  await page.click("#dayAvailability");
  await expect(page.locator("#searchForAvailability")).toBeVisible();
});

test("Check no search with no date", async ({ page }) => {
  await interceptGetCourseAvailabilityForDateAPICall(page);

  await page.click("#dropDownButton");
  await expect(page.locator("#dayAvailability")).toBeVisible();
  await page.click("#dayAvailability");
  await expect(page.locator("#searchForAvailability")).toBeVisible();
  await page.selectOption("#clubsSelect", "Tain");
  await page.click("#searchForAvailability");
  await expect(page.locator("#resultsDiv").locator("#tain")).not.toBeVisible();
  await expect(page.locator("#dayAvailabilityDateError")).toBeVisible();
  await expect(page.locator("#dayAvailabilityDateError")).toHaveText(
    /You have not entered a date/,
  );
});

test("Check no search with no course", async ({ page }) => {
  await interceptGetCourseAvailabilityForDateAPICall(page);

  await page.click("#dropDownButton");
  await expect(page.locator("#dayAvailability")).toBeVisible();
  await page.click("#dayAvailability");
  await expect(page.locator("#searchForAvailability")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  await page.click("#searchForAvailability");
  await expect(page.locator("#resultsDiv").locator("#tain")).not.toBeVisible();
  await expect(page.locator("#noCourseSelectedError")).toBeVisible();
  await expect(page.locator("#noCourseSelectedError")).toHaveText(
    /You have not selected a course/,
  );
});

test("Search for Tain with availability", async ({ page }) => {
  await interceptGetCourseAvailabilityForDateAPICall(page);

  await page.click("#dropDownButton");
  await expect(page.locator("#dayAvailability")).toBeVisible();
  await page.click("#dayAvailability");
  await expect(page.locator("#searchForAvailability")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  await page.selectOption("#clubsSelect", "Tain");
  await page.click("#searchForAvailability");
  await expect(page.locator("#resultsDiv").locator("#tain")).toBeVisible();
  await expect(
    page.locator("#resultsDiv").locator("#tain").locator(".card-text"),
  ).toHaveText(/Good news! There are tee times available on this day/);
});

test("Search for Tain and Brora with availability", async ({ page }) => {
  await interceptGetCourseAvailabilityForDateAPICall(page);

  await page.click("#dropDownButton");
  await expect(page.locator("#dayAvailability")).toBeVisible();
  await page.click("#dayAvailability");
  await expect(page.locator("#searchForAvailability")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  await page
    .locator("#clubsSelect")
    .selectOption([{ label: "Tain" }, { label: "Brora" }]);
  await page.click("#searchForAvailability");
  await expect(page.locator("#resultsDiv").locator("#tain")).toBeVisible();
  await expect(
    page.locator("#resultsDiv").locator("#tain").locator(".card-text"),
  ).toHaveText(/Good news! There are tee times available on this day/);
  await expect(
    page.locator("#resultsDiv").locator("#broragolfclub"),
  ).toBeVisible();
  await expect(
    page.locator("#resultsDiv").locator("#broragolfclub").locator(".card-text"),
  ).toHaveText(/Good news! There are tee times available on this day/);
});

test("Search for Tain with availability and an Open", async ({ page }) => {
  await interceptGetCourseAvailabilityForDateAPICall(page);

  await page.click("#dropDownButton");
  await expect(page.locator("#dayAvailability")).toBeVisible();
  await page.click("#dayAvailability");
  await expect(page.locator("#searchForAvailability")).toBeVisible();
  await page.fill("#start", "2026-02-03");
  await page.selectOption("#clubsSelect", "Tain");
  await page.click("#searchForAvailability");
  await expect(page.locator("#resultsDiv").locator("#tain")).toBeVisible();
  await expect(
    page.locator("#resultsDiv").locator("#tain").locator(".card-text").nth(0),
  ).toHaveText(/Good news! There are tee times available on this day/);
  await expect(
    page.locator("#resultsDiv").locator("#tain").locator(".card-text").nth(1),
  ).toHaveText(/There is an Open Competition on on this day/);
});

test("Search for Tain with no availability", async ({ page }) => {
  await interceptGetCourseAvailabilityForDateAPICall(page);

  await page.click("#dropDownButton");
  await expect(page.locator("#dayAvailability")).toBeVisible();
  await page.click("#dayAvailability");
  await expect(page.locator("#searchForAvailability")).toBeVisible();
  await page.fill("#start", "2026-02-04");
  await page.selectOption("#clubsSelect", "Tain");
  await page.click("#searchForAvailability");
  await expect(page.locator("#resultsDiv").locator("#tain")).toBeVisible();
  await expect(
    page.locator("#resultsDiv").locator("#tain").locator(".card-text"),
  ).toHaveText(/Sorry - there are no tee times available on this day/);
});
