import { test, expect } from "@playwright/test";
import { interceptGetCoursesAPICall } from "./helpers/getCoursesHelper";
import { fakePageLoadLogInCall } from "./helpers/logInHelper";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await interceptGetCoursesAPICall(page);
  await fakePageLoadLogInCall(page);
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

test("Check no search with no course", async ({ page }) => {
  await page.click("#dropDownButton");
  await expect(page.locator("#courseDirectory")).toBeVisible();
  await page.click("#courseDirectory");
  await expect(page.locator("#courseDirectoryHeader")).toBeVisible();
  await page.click("#viewCourse");
  await expect(
    page.locator("#resultsDiv").locator("#levenlinks_div"),
  ).not.toBeVisible();
  await expect(page.locator("#noCourseSelectedError")).toBeVisible();
  await expect(page.locator("#noCourseSelectedError")).toHaveText(
    /You have not selected a course/,
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
  await expect(
    page.locator("#modalContent").locator(".carousel"),
  ).toBeVisible();
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

test("Check Aberdour has opens badge", async ({ page }) => {
  aberdourGetCourseAPICall(page);

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
  await expect(page.locator("#viewOpensBadge")).toBeVisible();
  await expect(page.locator("#viewOpensBadge")).toHaveText(/Opens/);
});

test("Check Aberdour has opens title but no opens returned", async ({
  page,
}) => {
  aberdourGetCourseAPICall(page);

  await page.route(
    "**/api/getOpensForCourse.php?clubid=aberdour",
    async (route) => {
      let body = {};

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );

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
  await expect(page.locator("#viewOpensBadge")).toBeVisible();
  await expect(page.locator("#viewOpensBadge")).toHaveText(/Opens/);
  await page.click("#viewOpensBadge");
  await expect(page.locator("#modalContent")).toBeVisible();
  await expect(page.locator("#modalContent")).toHaveText(/No Opens found/);
});

test("Check Aberdour has opens returned", async ({ page }) => {
  aberdourGetCourseAPICall(page);

  await page.route(
    "**/api/getOpensForCourse.php?clubid=aberdour",
    async (route) => {
      let body = [
        {
          clubid: "aberdour",
          courseid: "1",
          openid: "102",
          name: "Mixed Texas Scramble Open",
          date: "2026-05-17",
          openBookingSystem: "brs",
          openBookingLink:
            "https:\/\/visitors.brsgolf.com\/aberdour#\/open-competitions",
          token: "",
          brsDomain: "aberdour",
        },
        {
          clubid: "aberdour",
          courseid: "1",
          openid: "103",
          name: "Senior Gents Open",
          date: "2026-06-02",
          openBookingSystem: "brs",
          openBookingLink:
            "https:\/\/visitors.brsgolf.com\/aberdour#\/open-competitions",
          token: "",
          brsDomain: "aberdour",
        },
      ];

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );

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
  await expect(page.locator("#viewOpensBadge")).toBeVisible();
  await expect(page.locator("#viewOpensBadge")).toHaveText(/Opens/);
  await page.click("#viewOpensBadge");
  await expect(page.locator("#modalContent")).toBeVisible();
  await expect(page.locator("#modalContent")).toHaveText(
    /Mixed Texas Scramble Open/,
  );
  await expect(page.locator("#modalContent")).toHaveText(/Senior Gents Open/);
});

async function aberdourGetCourseAPICall(page) {
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
        loggedIn: 1,
        played: 1,
        opens: 1,
      },
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}
