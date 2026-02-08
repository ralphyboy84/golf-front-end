import { test, expect } from "@playwright/test";
import { createTrip, validateTripCards } from "./helpers/createTripHelpers";

test("Check you can navigate to index screen", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await expect(page.locator("#pageHeader")).toHaveText(/Page Content/);
  await page.click("#dropDownButton");
  await expect(page.locator("#buildATrip")).toBeVisible();
  await page.click("#buildATrip");
  await expect(page.locator("#gettingStarted")).toBeVisible();
  await expect(page.locator("#gettingStarted").locator("h5")).toHaveText(
    /Welcome to your ultimate Scottish Golf Trip Planner!/,
  );
});

test("Validate no date entered", async ({ page }) => {
  await page.goto("http://localhost:5173/");

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
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.fill("#startDate", "2026-04-09");
  await page.click("#nextStepBtn");
  await page.click("#linksNoLinks");
  await expect(page.locator("#whereStayingAlert")).toBeVisible();
  await expect(page.locator("#whereStayingAlert").locator("span")).toHaveText(
    /You have not selected where you are planning to stay/,
  );
});

test("Validate no links or no links selected", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.fill("#startDate", "2026-04-09");
  await page.click("#nextStepBtn");
  await page.selectOption("#whereStayingSelect", "Leven");
  await page.click("#linksNoLinks");
  await page.click("#courseCategoryButton");
  await expect(page.locator("#linksNoLinksAlert")).toBeVisible();
  await expect(page.locator("#linksNoLinksAlert").locator("span")).toHaveText(
    /You have not selected what type of courses you would like to play/,
  );
});

test("Validate no course category selected", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.fill("#startDate", "2026-04-09");
  await page.click("#nextStepBtn");
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
  await page.goto("http://localhost:5173/");

  await createTrip(
    page,
    "2026-04-09",
    "Leven",
    "Links Courses",
    "B - not the Open Championship courses but still good",
    "20000",
  );
  await validateTripCards(page);
});

test("Check for too many courses returned", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await createTrip(
    page,
    "2026-04-09",
    "Leven",
    "Links Courses",
    "B - not the Open Championship courses but still good",
    "40000",
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

  const expectedRows = [
    {
      id: "levenlinks",
      course: "Leven",
      day1: {
        availability: "Yes",
        firsTeeTime: "10:30",
        price: "£TBC",
      },
      day2: {
        availability: "Yes",
        firsTeeTime: "09:36",
        price: "£85.00",
      },
      day3: {
        availability: "Yes",
        firsTeeTime: "12:09",
        price: "£90.00",
      },
    },
    {
      id: "lundingc",
      course: "Lundin Links",
      day1: {
        availability: "Yes",
        firsTeeTime: "09:32",
        price: "£100.0",
      },
      day2: {
        availability: "No",
      },
      day3: {
        availability: "Yes",
        firsTeeTime: "09:40",
        price: "£100.00",
      },
    },
    {
      id: "elie",
      course: "Elie",
      day1: {
        availability: "No",
      },
      day2: {
        availability: "No",
      },
      day3: {
        availability: "Yes",
        firsTeeTime: "12:09",
        price: "£90.00",
      },
    },
    {
      id: "gullane",
      course: "Gullane - 1",
      day1: {
        availability: "Yes",
        firsTeeTime: "12:09",
        price: "£90.00",
      },
      day2: {
        availability: "Yes",
        firsTeeTime: "11:28",
        price: "£175.00",
      },
      day3: {
        availability: "No",
      },
    },
    {
      id: "kilspinde",
      course: "Kilspindie",
      day1: {
        availability: "Yes",
        firsTeeTime: "12:00",
        price: "£120.00",
      },
      day2: {
        availability: "Yes",
        firsTeeTime: "12:08",
        price: "£120.00",
      },
      day3: {
        availability: "No",
      },
    },
    {
      id: "monifieth",
      course: "Monifieth - Medal",
      day1: {
        availability: "Yes",
        firsTeeTime: "10:02",
        price: "£80.00",
      },
      day2: {
        availability: "Yes",
        firsTeeTime: "10:02",
        price: "£80.00",
      },
      day3: {
        availability: "Yes",
        firsTeeTime: "13:35",
        price: "£80.00",
      },
    },
    {
      id: "panmure",
      course: "Panmure",
      day1: {
        availability: "Yes",
        firsTeeTime: "10:30",
        price: "£80.00",
      },
      day2: {
        availability: "Yes",
        firsTeeTime: "10:10",
        price: "£110.00",
      },
      day3: {
        availability: "Yes",
        firsTeeTime: "20",
        price: "£110.00",
      },
    },
    {
      id: "carnoustieburnside",
      course: "Carnoustie - Burnside",
      day1: {
        availability: "Yes",
        firsTeeTime: "10",
        price: "£110.00",
      },
      day2: {
        availability: "Yes",
        firsTeeTime: "10:00",
        price: "£TBC",
      },
      day3: {
        availability: "Yes",
        firsTeeTime: "15:00",
        price: "TBC",
      },
    },
  ];

  const rows = page.locator("table tbody tr");

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
  await page.goto("http://localhost:5173/");

  await createTrip(
    page,
    "2026-04-09",
    "Leven",
    "Links Courses",
    "B - not the Open Championship courses but still good",
    "40000",
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
