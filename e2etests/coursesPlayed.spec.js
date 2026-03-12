import { test, expect } from "@playwright/test";
import { fakePageLoadLogInCall } from "./helpers/logInHelper";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await interceptLogInCall(page);
  await getCoursesCall(page);
  await fakePageLoadLogInCall(page);
});

async function interceptLogInCall(page) {
  await page.route("**/api/logInUser.php*", async (route) => {
    let body = { success: "xxx" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

async function getCoursesCall(page) {
  await page.route("**/api/getCourses.php", async (route) => {
    let body = {
      aberdour: {
        name: "Aberdour",
        bookingLink: "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php",
        openBookingLink:
          "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php",
        onlineBooking: "Yes",
        openBooking: "Yes",
        bookingSystem: "brs",
        openBookingSystem: "brs",
        availabilityDays: null,
        region: "fife",
        working: "Yes",
        location: {
          lat: "56.047091",
          lon: "-3.306216",
        },
        courseId: "0",
        clubId: "0",
        reason: "",
        baseUrl: "",
        clubv1hub: "",
        clubv1opencourseid: "0",
        brsDomain: "aberdour",
        brsCourseId: "1",
        image: "No",
      },
      Aberfeldy: {
        name: "Aberfeldy",
        bookingLink: "https:\/\/www.aberfeldy-golfclub.co.uk\/",
        openBookingLink: "",
        onlineBooking: "No",
        openBooking: "No",
        bookingSystem: "",
        openBookingSystem: "",
        availabilityDays: null,
        region: "highlands",
        working: "",
        location: {
          lat: "56.621756",
          lon: "-3.871285",
        },
        courseId: "0",
        clubId: "0",
        reason: "",
        baseUrl: "",
        clubv1hub: "",
        clubv1opencourseid: "0",
        brsDomain: "",
        brsCourseId: "0",
        image: "No",
      },
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

async function standardLogIn(page) {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#logIn");
  await page.fill("#username", "ralph");
  await page.fill("#password", "ralph");
  await page.click("#logInButton");

  await expect(page.locator("#loggedIn")).toBeVisible();
  await expect(page.locator("#loggedIn")).toHaveText(
    /Congrats, you are logged in!/,
  );
}

async function aberdourGetCourseAPICall(page, played, loggedIn) {
  await page.route("**/api/getCourses.php?courseId=aberdour", async (route) => {
    let body = {
      aberdour: {
        name: "Aberdour",
        bookingLink: "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php",
        openBookingLink:
          "https:\/\/www.brsgolf.com\/aberdour\/visitor_home.php",
        onlineBooking: "Yes",
        openBooking: "Yes",
        bookingSystem: "brs",
        openBookingSystem: "brs",
        availabilityDays: null,
        region: "fife",
        working: "Yes",
        location: {
          lat: "56.047091",
          lon: "-3.306216",
        },
        courseId: "0",
        clubId: "0",
        reason: "",
        baseUrl: "",
        clubv1hub: "",
        clubv1opencourseid: "0",
        brsDomain: "aberdour",
        brsCourseId: "1",
        image: "No",
        description: "description",
        category: "c",
        loggedIn,
        played,
      },
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

test("Check no played flag when not logged in", async ({ page }) => {
  await aberdourGetCourseAPICall(page, 0, 0);
  await standardLogIn(page);
  await page.click("#dropDownButton");
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await expect(page.locator("#courseDirectoryHeader")).toHaveText(
    /Use our course directory to view any golf course in Scotland./,
  );
  await page.selectOption("#courseDirectoryListSelect", "aberdour");
  await page.click("#viewCourse");
  await expect(page.locator("#aberdour_div")).toBeVisible();
  await expect(page.locator("#playedCourse_aberdour")).not.toBeVisible();
  await expect(page.locator("#notPlayedCourse_aberdour")).not.toBeVisible();
});

test("Check course marked as played", async ({ page }) => {
  await page.route("**/api/markCourseAsPlayed.php*", async (route) => {
    let body = { success: "xxx" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  await aberdourGetCourseAPICall(page, 0, 1);
  await standardLogIn(page);
  await page.click("#dropDownButton");
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await expect(page.locator("#courseDirectoryHeader")).toHaveText(
    /Use our course directory to view any golf course in Scotland./,
  );
  await page.selectOption("#courseDirectoryListSelect", "aberdour");
  await page.click("#viewCourse");
  await expect(page.locator("#aberdour_div")).toBeVisible();
  await expect(page.locator("#playedCourse_aberdour")).toBeVisible();
  await expect(page.locator("#notPlayedCourse_aberdour")).not.toBeVisible();
  await page.click("#playedCourse_aberdour");
  await expect(page.locator("#playedCourse_aberdour")).not.toBeVisible();
  await expect(page.locator("#notPlayedCourse_aberdour")).toBeVisible();
  await expect(page.locator("#coursePlayedAlert")).toBeVisible();
});

test("Check course removed as played", async ({ page }) => {
  await page.route("**/api/markCourseAsNotPlayed.php*", async (route) => {
    let body = { success: "xxx" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  await aberdourGetCourseAPICall(page, 1, 1);
  await standardLogIn(page);
  await page.click("#dropDownButton");
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await expect(page.locator("#courseDirectoryHeader")).toHaveText(
    /Use our course directory to view any golf course in Scotland./,
  );
  await page.selectOption("#courseDirectoryListSelect", "aberdour");
  await page.click("#viewCourse");
  await expect(page.locator("#aberdour_div")).toBeVisible();
  await expect(page.locator("#playedCourse_aberdour")).not.toBeVisible();
  await expect(page.locator("#notPlayedCourse_aberdour")).toBeVisible();
  await page.click("#notPlayedCourse_aberdour");
  await expect(page.locator("#playedCourse_aberdour")).toBeVisible();
  await expect(page.locator("#notPlayedCourse_aberdour")).not.toBeVisible();
  await expect(page.locator("#courseNotPlayedAlert")).toBeVisible();
});
