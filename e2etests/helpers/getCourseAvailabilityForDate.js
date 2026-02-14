import { levenlinks20260409 } from "../fixtures/courseAvailability/levenlinks/20260409";
import { levenlinks20260410 } from "../fixtures/courseAvailability/levenlinks/20260410";
import { levenlinks20260411 } from "../fixtures/courseAvailability/levenlinks/20260411";
import { lundingc20260409 } from "../fixtures/courseAvailability/lundingc/20260409";
import { lundingc20260410 } from "../fixtures/courseAvailability/lundingc/20260410";
import { lundingc20260411 } from "../fixtures/courseAvailability/lundingc/20260411";
import { elie20260409 } from "../fixtures/courseAvailability/elie/20260409";
import { elie20260410 } from "../fixtures/courseAvailability/elie/20260410";
import { elie20260411 } from "../fixtures/courseAvailability/elie/20260411";

export async function interceptGetCoursesForTripAPICall(page) {
  await page.route(
    "**/api/getCourseAvailabilityForDate.php*",
    async (route) => {
      const url = new URL(route.request().url());
      const club = url.searchParams.get("club");
      const date = url.searchParams.get("date");

      let body;

      if (club == "levenlinks" && date == "2026-04-09") {
        body = levenlinks20260409;
      } else if (club == "levenlinks" && date == "2026-04-10") {
        body = levenlinks20260410;
      } else if (club == "levenlinks" && date == "2026-04-11") {
        body = levenlinks20260411;
      } else if (club == "lundingc" && date == "2026-04-09") {
        body = lundingc20260409;
      } else if (club == "lundingc" && date == "2026-04-10") {
        body = lundingc20260410;
      } else if (club == "lundingc" && date == "2026-04-11") {
        body = lundingc20260411;
      } else if (club == "elie" && date == "2026-04-09") {
        body = elie20260409;
      } else if (club == "elie" && date == "2026-04-10") {
        body = elie20260410;
      } else if (club == "elie" && date == "2026-04-11") {
        body = elie20260411;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(tripCourses),
      });
    },
  );
}
