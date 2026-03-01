import { test, expect } from "@playwright/test";
import { createTrip, validateTripCards } from "./helpers/createTripHelpers";
import { expectedRows } from "./fixtures/createTripFixtures";
import { interceptGetCourseAvailabilityForDateAPICall } from "./helpers/getCourseAvailabilityForDate";
import { interceptGetCoursesAPICall } from "./helpers/getCoursesHelper";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Check you can navigate to index screen", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await expect(page.locator("#buildATrip")).toBeVisible();
  await page.click("#buildATrip");
  await expect(page.locator("#gettingStarted")).toBeVisible();
  await expect(page.locator("#gettingStarted").locator("h5")).toHaveText(
    /Welcome to your ultimate Scottish Golf Trip Planner!/,
  );
});

test("Validate no date entered", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.click("#nextStepBtn");
  await expect(page.locator("#nextStepBtnAlert")).toBeVisible();
  await expect(page.locator("#nextStepBtnAlert").locator("span")).toHaveText(
    /You have not entered a date/,
  );
});

test("Validate no where staying selected", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await interceptGetCoursesAPICall(page);
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.fill("#startDate", "2026-04-09");
  await page.click("#nextStepBtn");
  await page.click("#tripLengthButton");
  await page.click("#linksNoLinks");
  await expect(page.locator("#whereStayingAlert")).toBeVisible();
  await expect(page.locator("#whereStayingAlert").locator("span")).toHaveText(
    /You have not selected where you are planning to stay/,
  );
});

test("Validate no links or no links selected", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await interceptGetCoursesAPICall(page);
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.fill("#startDate", "2026-04-09");
  await page.click("#nextStepBtn");
  await page.click("#tripLengthButton");
  await page.selectOption("#whereStayingSelect", "Leven");
  await page.click("#linksNoLinks");
  await page.click("#courseCategoryButton");
  await expect(page.locator("#linksNoLinksAlert")).toBeVisible();
  await expect(page.locator("#linksNoLinksAlert").locator("span")).toHaveText(
    /You have not selected what type of courses you would like to play/,
  );
});

test("Validate no course category selected", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await interceptGetCoursesAPICall(page);
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.fill("#startDate", "2026-04-09");
  await page.click("#nextStepBtn");
  await page.click("#tripLengthButton");
  await page.selectOption("#whereStayingSelect", "Leven");
  await page.click("#linksNoLinks");
  await page.selectOption("#courseTypeSelect", "Links Courses");
  await page.click("#courseCategoryButton");
  await page.click("#lastQuestionButton");
  await expect(page.locator("#courseCategoryAlert")).toBeVisible();
  await expect(page.locator("#courseCategoryAlert").locator("span")).toHaveText(
    /You have not selected what category of courses you would like to play/,
  );
});

test("Validate a trip is built", async ({ page }) => {
  await interceptGetCoursesAPICall(page);
  await interceptGetCourseAvailabilityForDateAPICall(page);
  await createTrip(
    page,
    "2026-04-09",
    "Leven",
    "Links Courses",
    "B - not the Open Championship courses but still good",
    "20000",
    "3",
  );
  await validateTripCards(page);
});

test("Validate a trip is built and check navigating to tripBuilder reloads same trip", async ({
  page,
}) => {
  await interceptGetCoursesAPICall(page);
  await interceptGetCourseAvailabilityForDateAPICall(page);
  await createTrip(
    page,
    "2026-04-09",
    "Leven",
    "Links Courses",
    "B - not the Open Championship courses but still good",
    "20000",
    "3",
  );
  await validateTripCards(page);
  await page.goto("/tripBuilder");
  await validateTripCards(page);
});

test("Check for too many courses returned", async ({ page }) => {
  await interceptGetCoursesAPICall(page);
  await interceptGetCourseAvailabilityForDateAPICall(page);
  await createTrip(
    page,
    "2026-04-09",
    "Leven",
    "Links Courses",
    "B - not the Open Championship courses but still good",
    "40000",
    "3",
  );
  await page.waitForSelector("#tooManyOptionsCard");
  await expect(
    page.locator("#tooManyOptionsCard").locator(".card-body"),
  ).toBeVisible();
  await expect(
    page.locator("#tooManyOptionsCard").locator(".card-body").locator("h5"),
  ).toHaveText(/Too Many Options/);
  await expect(
    page.locator("#tooManyOptionsCard").locator(".card-body").locator("p"),
  ).toHaveText(
    /Too many courses have been returned to build your trip. Check the checkboxes of the courses you would like to include in your trip./,
  );
  await expect(page.locator("table")).toBeVisible();

  const rows = page.locator("table tbody tr");

  // expected rows below is imported from createTripFixtures
  for (let i = 0; i < (await rows.count()); i++) {
    const row = rows.nth(i);
    const courseName = await row.locator("td").first().textContent();

    const expected = expectedRows.find((r) => r.course === courseName.trim());
    if (!expected) continue; // skip if row isn’t expected

    const cells = row.locator("td");
    await expect(cells.nth(1)).toHaveText(expected.course);
    await expect(cells.nth(2)).toHaveText(expected.day1.availability);
    await expect(cells.nth(2)).toHaveText(expected.day1.firstTeeTime);
    await expect(cells.nth(2)).toHaveText(expected.day1.price);
    await expect(cells.nth(3)).toHaveText(expected.day2.availability);
    await expect(cells.nth(3)).toHaveText(expected.day2.firstTeeTime);
    await expect(cells.nth(3)).toHaveText(expected.day2.price);
    await expect(cells.nth(4)).toHaveText(expected.day3.availability);
    await expect(cells.nth(4)).toHaveText(expected.day3.firstTeeTime);
    await expect(cells.nth(4)).toHaveText(expected.day3.price);
  }
});

test("Check trip rebuilt ok", async ({ page }) => {
  await interceptGetCoursesAPICall(page);
  await interceptGetCourseAvailabilityForDateAPICall(page);
  await createTrip(
    page,
    "2026-04-09",
    "Leven",
    "Links Courses",
    "B - not the Open Championship courses but still good",
    "40000",
    "3",
  );
  await page.waitForSelector("#tooManyOptionsCard");
  await expect(
    page.locator("#tooManyOptionsCard").locator(".card-body"),
  ).toBeVisible();
  await expect(
    page.locator("#tooManyOptionsCard").locator(".card-body").locator("h5"),
  ).toHaveText(/Too Many Options/);
  await expect(
    page.locator("#tooManyOptionsCard").locator(".card-body").locator("p"),
  ).toHaveText(
    /Too many courses have been returned to build your trip. Check the checkboxes of the courses you would like to include in your trip./,
  );
  await page.check("#levenlinks_checkbox");
  await page.check("#lundingc_checkbox");
  await page.check("#elie_checkbox");
  await page.click("#rebuildMyTripButton");
  await validateTripCards(page);
});
