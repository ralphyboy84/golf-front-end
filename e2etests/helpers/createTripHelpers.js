import { expect } from "@playwright/test";
import { interceptGetCoursesAPICall } from "./getCoursesHelper";

export async function createTrip(
  page,
  date,
  whereStaying,
  courseType,
  courseCategory,
  milage,
  tripLength,
) {
  await interceptGetCoursesAPICall(page);
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
