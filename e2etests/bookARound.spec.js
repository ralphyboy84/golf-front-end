import { test, expect } from "@playwright/test";
import { interceptGetCoursesAPICall } from "./helpers/getCoursesHelper";
import { fakePageLoadLogInCall } from "./helpers/logInHelper";
import { interceptGetDistanceAPICall } from "./helpers/getDistanceHelper";
import { interceptGetWeatherAPICall } from "./helpers/getWeatherHelper";

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.clock.setSystemTime(new Date("2026-02-01"));
  await page.goto("/");
  await interceptGetCoursesAPICall(page);
  await fakePageLoadLogInCall(page);
  await interceptGetDistanceAPICall(page);
  await interceptGetWeatherAPICall(page);
});

test("Check you can navigate to index screen", async ({ page }) => {
  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await expect(page.locator("#courseLookingForSelect")).toBeVisible();
});

test("Check you can search for a specific course - user not logged in", async ({
  page,
}) => {
  await page.route(
    "**/api/getCourseAvailabilityForDate.php?club=aberdour&date=2026-02-02*",
    async (route) => {
      const body = {
        date: "04\/04\/2026",
        teeTimesAvailable: "Yes",
        timesAvailable: 19,
        firstTime: "14:00",
        cheapestPrice: "75.00",
        bookingUrl:
          "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php?date=2026-04-04",
        courseName: "Aberdour",
        image: "No",
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );

  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await expect(page.locator("#courseLookingForSelect")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "Yes" });
  await select.dispatchEvent("change");
  await expect(page.locator("#clubsSelect")).toBeVisible();
  await page.selectOption("#clubsSelect", "Aberdour");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5")).toBeVisible();
  await expect(page.locator("h5")).toHaveText(/Aberdour/);
  await expect(page.locator("p")).toHaveText(
    /Good news! There are tee times available on this day/,
  );
  await expect(page.locator("span").nth(0)).toHaveText(/75.00/);
  await expect(page.locator("span").nth(2)).toHaveText(/14.00/);
  await expect(page.locator("span").nth(4)).toHaveText(/19/);
});

test("Check you can search for two specific courses - user not logged in", async ({
  page,
}) => {
  await page.route(
    "**/api/getCourseAvailabilityForDate.php?club=aberdour&date=2026-02-02*",
    async (route) => {
      const body = {
        date: "04\/04\/2026",
        teeTimesAvailable: "Yes",
        timesAvailable: 19,
        firstTime: "14:00",
        cheapestPrice: "75.00",
        bookingUrl:
          "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php?date=2026-04-04",
        courseName: "Aberdour",
        image: "No",
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );

  await page.route(
    "**/api/getCourseAvailabilityForDate.php?club=Aberfeldy&date=2026-02-02*",
    async (route) => {
      const body = {
        date: "04\/04\/2026",
        teeTimesAvailable: "Yes",
        timesAvailable: 100,
        firstTime: "10:00",
        cheapestPrice: "15.00",
        bookingUrl:
          "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php?date=2026-04-04",
        courseName: "Aberfeldy",
        image: "No",
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );

  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await expect(page.locator("#courseLookingForSelect")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "Yes" });
  await select.dispatchEvent("change");
  await expect(page.locator("#clubsSelect")).toBeVisible();
  await page.selectOption("#clubsSelect", ["Aberdour", "Aberfeldy"]);
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
  await expect(page.locator("p").nth(0)).toHaveText(
    /Good news! There are tee times available on this day/,
  );
  await expect(page.locator("span").nth(0)).toHaveText(/75.00/);
  await expect(page.locator("span").nth(2)).toHaveText(/14.00/);
  await expect(page.locator("span").nth(4)).toHaveText(/19/);
  await expect(page.locator("h5").nth(1)).toBeVisible();
  await expect(page.locator("h5").nth(1)).toHaveText(/Aberfeldy/);
  await expect(page.locator("p").nth(1)).toHaveText(
    /Good news! There are tee times available on this day/,
  );
  await expect(page.locator("span").nth(6)).toHaveText(/15.00/);
  await expect(page.locator("span").nth(8)).toHaveText(/10.00/);
  await expect(page.locator("span").nth(10)).toHaveText(/100/);
});

test("Check for results when you do not know the name of the course", async ({
  page,
}) => {
  await page.route(
    "**/api/getCourses.php?region=&top100=Yes&nineHoles=&category=&links=&ralphRecommends=Yes&played=&onlineBooking=Yes",
    async (route) => {
      const body = {
        aberdour: {
          name: "aberdour",
        },
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );

  await page.route(
    "**/api/getCourseAvailabilityForDate.php?club=aberdour&date=2026-02-02*",
    async (route) => {
      const body = {
        date: "04\/04\/2026",
        teeTimesAvailable: "Yes",
        timesAvailable: 19,
        firstTime: "14:00",
        cheapestPrice: "75.00",
        bookingUrl:
          "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php?date=2026-04-04",
        courseName: "Aberdour",
        image: "No",
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );

  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await expect(page.locator("#courseLookingForSelect")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "No" });
  await select.dispatchEvent("change");
  await expect(page.locator("#top100Filter")).toBeVisible();
  await page.selectOption("#top100Filter", "Yes");
  await page.selectOption("#ralphRecommends", "Yes");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
  await expect(page.locator("p").nth(0)).toHaveText(
    /Good news! There are tee times available on this day/,
  );
  await expect(page.locator("span").nth(0)).toHaveText(/75.00/);
  await expect(page.locator("span").nth(2)).toHaveText(/14.00/);
  await expect(page.locator("span").nth(4)).toHaveText(/19/);
});
