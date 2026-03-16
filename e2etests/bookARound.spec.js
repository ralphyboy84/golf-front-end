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
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
  await expect(page.locator("p").nth(0)).toHaveText(
    /Good news! There are tee times available on this day/,
  );
  await expect(page.locator("span").nth(1)).toHaveText(/75.00/);
  await expect(page.locator("span").nth(3)).toHaveText(/14.00/);
  await expect(page.locator("span").nth(5)).toHaveText(/19/);
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
  await expect(page.locator("span").nth(1)).toHaveText(/75.00/);
  await expect(page.locator("span").nth(3)).toHaveText(/14.00/);
  await expect(page.locator("span").nth(5)).toHaveText(/19/);
  await expect(page.locator("h5").nth(2)).toBeVisible();
  await expect(page.locator("h5").nth(3)).toHaveText(/Aberfeldy/);
  await expect(page.locator("p").nth(3)).toHaveText(
    /Good news! There are tee times available on this day/,
  );
  await expect(page.locator("span").nth(18)).toHaveText(/15.00/);
  await expect(page.locator("span").nth(20)).toHaveText(/10.00/);
  await expect(page.locator("span").nth(22)).toHaveText(/100/);
});

test("Check no criteria entered and not logged in when you do not know the name of the course", async ({
  page,
}) => {
  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await expect(page.locator("#courseLookingForSelect")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "No" });
  await select.dispatchEvent("change");
  await expect(page.locator("#top100Filter")).toBeVisible();
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("#noCriteriaAlertMsg")).toBeVisible();
  await expect(page.locator("#noCriteriaAlertMsg")).toHaveText(
    /You have not selected any criteria/,
  );
});

test("Check no criteria entered and logged in when you do not know the name of the course", async ({
  page,
}) => {
  await page.route("**/api/getLoggedInUser.php*", async (route) => {
    let body = { username: "1" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await expect(page.locator("#courseLookingForSelect")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "No" });
  await select.dispatchEvent("change");
  await expect(page.locator("#top100Filter")).toBeVisible();
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("#noCriteriaAlertMsg")).toBeVisible();
  await expect(page.locator("#noCriteriaAlertMsg")).toHaveText(
    /You have not selected any criteria/,
  );
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
  await expect(page.locator("span").nth(1)).toHaveText(/75.00/);
  await expect(page.locator("span").nth(3)).toHaveText(/14.00/);
  await expect(page.locator("span").nth(5)).toHaveText(/19/);
});

test("Check for results when you do not know the name of the course and too many returned", async ({
  page,
}) => {
  await page.route("**/api/getCourses.php**", async (route) => {
    const body = {
      aberdour: {
        name: "aberdour",
      },
      aberdour1: {
        name: "aberdour",
      },
      aberdour2: {
        name: "aberdour",
      },
      aberdour3: {
        name: "aberdour",
      },
      aberdour4: {
        name: "aberdour",
      },
      aberdour5: {
        name: "aberdour",
      },
      aberdour6: {
        name: "aberdour",
      },
      aberdour7: {
        name: "aberdour",
      },
      aberdour8: {
        name: "aberdour",
      },
      aberdour9: {
        name: "aberdour",
      },
      aberdour0: {
        name: "aberdour",
      },
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

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
  await expect(page.locator("#app")).toHaveText(
    /The following courses meet your criteria:/,
  );
});

async function sharedInterceptFunctionForValidationFormElements(
  page,
  getCourseUrl,
) {
  await page.route(getCourseUrl, async (route) => {
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
  });

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
}

async function validatingFormElementsCommonSteps(page) {
  await expect(page.locator("#dropDownButton")).toBeVisible();
  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await expect(page.locator("#courseLookingForSelect")).toBeVisible();
  await page.fill("#start", "2026-02-02");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "No" });
  await select.dispatchEvent("change");
}

test("Check for results when you do not know the name of the course and top 100 course set", async ({
  page,
}) => {
  sharedInterceptFunctionForValidationFormElements(
    page,
    "**/api/getCourses.php?region=&top100=Yes&nineHoles=&category=&links=&ralphRecommends=&played=&onlineBooking=Yes",
  );
  validatingFormElementsCommonSteps(page);
  await expect(page.locator("#top100Filter")).toBeVisible();
  await page.selectOption("#top100Filter", "Yes");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
});

test("Check for results when you do not know the name of the course and 9 hole course set", async ({
  page,
}) => {
  sharedInterceptFunctionForValidationFormElements(
    page,
    "**/api/getCourses.php?region=&top100=&nineHoles=Yes&category=&links=&ralphRecommends=&played=&onlineBooking=Yes",
  );
  validatingFormElementsCommonSteps(page);
  await expect(page.locator("#nineHoleFilter")).toBeVisible();
  await page.selectOption("#nineHoleFilter", "Yes");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
});

test("Check for results when you do not know the name of the course and ralph recommends set", async ({
  page,
}) => {
  sharedInterceptFunctionForValidationFormElements(
    page,
    "**/api/getCourses.php?region=&top100=&nineHoles=&category=&links=&ralphRecommends=Yes&played=&onlineBooking=Yes",
  );
  validatingFormElementsCommonSteps(page);
  await expect(page.locator("#ralphRecommends")).toBeVisible();
  await page.selectOption("#ralphRecommends", "Yes");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
});

test("Check for results when you do not know the name of the course and links course set", async ({
  page,
}) => {
  sharedInterceptFunctionForValidationFormElements(
    page,
    "**/api/getCourses.php?region=&top100=&nineHoles=&category=&links=Yes&ralphRecommends=&played=&onlineBooking=Yes",
  );
  validatingFormElementsCommonSteps(page);
  await expect(page.locator("#linksCourses")).toBeVisible();
  await page.selectOption("#linksCourses", "Yes");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
});

test("Check for results when you do not know the name of the course and category set", async ({
  page,
}) => {
  sharedInterceptFunctionForValidationFormElements(
    page,
    "**/api/getCourses.php?region=&top100=&nineHoles=&category=a&links=&ralphRecommends=&played=&onlineBooking=Yes",
  );
  validatingFormElementsCommonSteps(page);
  await expect(page.locator("#mapCourseCategory")).toBeVisible();
  await page.selectOption("#mapCourseCategory", "A");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
});

test("Check for results when you do not know the name of the course and played set", async ({
  page,
}) => {
  await page.route("**/api/getLoggedInUser.php*", async (route) => {
    let body = { username: "1" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  sharedInterceptFunctionForValidationFormElements(
    page,
    "**/api/getCourses.php?region=&top100=&nineHoles=&category=&links=&ralphRecommends=&played=Yes&onlineBooking=Yes",
  );
  validatingFormElementsCommonSteps(page);
  await expect(page.locator("#played")).toBeVisible();
  await page.selectOption("#played", "Yes");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("h5").nth(0)).toBeVisible();
  await expect(page.locator("h5").nth(0)).toHaveText(/Aberdour/);
});

test("Check no date entered when you know the course you are playing", async ({
  page,
}) => {
  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "Yes" });
  await select.dispatchEvent("change");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("#dayAvailabilityDateError")).toBeVisible();
  await expect(page.locator("#dayAvailabilityDateError")).toHaveText(
    /You have not entered a date/,
  );
});

test("Check no course selected when you know the course you are playing", async ({
  page,
}) => {
  await page.click("#dropDownButton");
  await expect(page.locator("#bookARound")).toBeVisible();
  await page.click("#bookARound");
  await page.fill("#start", "2026-02-02");
  const select = page.locator("select#courseLookingForSelect");
  await select.selectOption({ value: "Yes" });
  await select.dispatchEvent("change");
  await page.click("#filterCoursesForBookingARound");
  await expect(page.locator("#noCourseSelectedError")).toBeVisible();
  await expect(page.locator("#noCourseSelectedError")).toHaveText(
    /You have not selected a course/,
  );
});
