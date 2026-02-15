import {
  tripCoursesBasic,
  tripCoursesTooMany,
  getAllCourses,
} from "../fixtures/getCoursesForTrip";

export async function interceptGetCoursesAPICall(page) {
  await page.route("**/api/getCourses.php*", async (route) => {
    const url = new URL(route.request().url());
    const travelDistanceOption = url.searchParams.get("travelDistanceOption");

    let body = getAllCourses;

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
  });
}
