import { levenlinks20260409 } from "../fixtures/courseAvailability/levenlinks/20260409";
import { levenlinks20260410 } from "../fixtures/courseAvailability/levenlinks/20260410";
import { levenlinks20260411 } from "../fixtures/courseAvailability/levenlinks/20260411";
import { lundingc20260409 } from "../fixtures/courseAvailability/lundingc/20260409";
import { lundingc20260410 } from "../fixtures/courseAvailability/lundingc/20260410";
import { lundingc20260411 } from "../fixtures/courseAvailability/lundingc/20260411";
import { elie20260409 } from "../fixtures/courseAvailability/elie/20260409";
import { elie20260410 } from "../fixtures/courseAvailability/elie/20260410";
import { elie20260411 } from "../fixtures/courseAvailability/elie/20260411";
import { dumbarnie20260409 } from "../fixtures/courseAvailability/Dumbarnie/20260409";
import { dumbarnie20260410 } from "../fixtures/courseAvailability/Dumbarnie/20260410";
import { dumbarnie20260411 } from "../fixtures/courseAvailability/Dumbarnie/20260411";
import { kilspindie20260409 } from "../fixtures/courseAvailability/kilspindie/20260409";
import { kilspindie20260410 } from "../fixtures/courseAvailability/kilspindie/20260410";
import { kilspindie20260411 } from "../fixtures/courseAvailability/kilspindie/20260411";
import { tain20260202 } from "../fixtures/courseAvailability/tain/20260202";
import { tain20260203 } from "../fixtures/courseAvailability/tain/20260203";
import { tain20260204 } from "../fixtures/courseAvailability/tain/20260204";

export async function interceptGetCourseAvailabilityForDateAPICall(page) {
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
      } else if (club == "Dumbarnie" && date == "2026-04-09") {
        body = dumbarnie20260409;
      } else if (club == "Dumbarnie" && date == "2026-04-10") {
        body = dumbarnie20260410;
      } else if (club == "Dumbarnie" && date == "2026-04-11") {
        body = dumbarnie20260411;
      } else if (club == "kilspindie" && date == "2026-04-09") {
        body = kilspindie20260409;
      } else if (club == "kilspindie" && date == "2026-04-10") {
        body = kilspindie20260410;
      } else if (club == "kilspindie" && date == "2026-04-11") {
        body = kilspindie20260411;
      } else if (club == "tain" && date == "2026-02-02") {
        body = tain20260202;
      } else if (club == "tain" && date == "2026-02-03") {
        body = tain20260203;
      } else if (club == "tain" && date == "2026-02-04") {
        body = tain20260204;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    },
  );
}
