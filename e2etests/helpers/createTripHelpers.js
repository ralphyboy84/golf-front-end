import { expect } from "@playwright/test";
import { courses } from "../fixtures/getCourses";
import {
  tripCoursesBasic,
  tripCoursesTooMany,
} from "../fixtures/getCoursesForTrip";

export async function createTrip(
  page,
  date,
  whereStaying,
  courseType,
  courseCategory,
  milage,
  tripLength,
) {
  await interceptGetCourseAPICall(page);
  await page.click("#dropDownButton");
  await page.click("#buildATrip");
  await page.click("#startTripBuilder");
  await page.fill("#startDate", date);
  await page.click("#nextStepBtn");
  await page.fill("#tripLengthInDays", tripLength);
  await page.click("#tripLengthButton");
  await page.selectOption("#whereStayingSelect", whereStaying);
  await page.click("#linksNoLinks");
  await page.selectOption("#courseTypeSelect", courseType);
  await page.click("#courseCategoryButton");
  await page.selectOption("#courseCategorySelect", courseCategory);
  await page.click("#lastQuestionButton");
  await page.fill("#milageRange", milage);
  await page.click("#buildMyTripButton");
}

export async function validateTripCards(page) {
  await page.waitForSelector("#course0");
  await expect(page.locator("#course0").locator(".card-body")).toBeVisible();
  await expect(
    page.locator("#course0").locator(".card-body").locator("h5"),
  ).toHaveText(/Lundin Links - Day 1/);
  await page.click("#nextDayButton0");
  await page.waitForSelector("#course1");
  await expect(page.locator("#course1").locator(".card-body")).toBeVisible();
  await expect(
    page.locator("#course1").locator(".card-body").locator("h5"),
  ).toHaveText(/Leven - Day 2/);
  await page.click("#nextDayButton1");
  await page.waitForSelector("#course2");
  await expect(page.locator("#course2").locator(".card-body")).toBeVisible();
  await expect(
    page.locator("#course2").locator(".card-body").locator("h5"),
  ).toHaveText(/Elie - Day 3/);
}

export async function interceptGetCourseAPICall(page) {
  await page.route("**/api/getCourses.php", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(courses),
    });
  });
}

export async function interceptGetCoursesForTripAPICall(page) {
  await page.route(
    "**/api/getCourses.php?lat=56.197846&lon=-2.988865&courseTypeOption=links&courseQualityOption=b&travelDistanceOption=20000&onlineBooking=Yes",
    async (route) => {
      const url = new URL(route.request().url());
      const travelDistanceOption = url.searchParams.get("travelDistanceOption");

      let body;

      if (travelDistanceOption == 20000) {
        body = tripCoursesBasic;
      } else if (travelDistanceOption == 40000) {
        body = tripCoursesTooMany;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );
}
