import Navigo from "navigo";

import {
  tripPage,
  setDate,
  whereStaying,
  linksOrNoLinks,
  courseCategory,
  lastQuestion,
  tripLength,
} from "./pages/trip.js";

import { buildFullTripSummary } from "./pages/buildFullTripSummary.js";
import { buildTrip } from "./pages/tripBuilder.js";
import { reBuildTrip } from "./pages/reBuildTrip.js";
import { openSearcher } from "./pages/calendar.js";
import { loadHome } from "./pages/home.js";

export const router = new Navigo("/");

router
  .on("/trip", tripPage)
  .on("/tripDate", setDate)
  .on("/tripLength", tripLength)
  .on("/whereStaying", whereStaying)
  .on("/linksOrNoLinks", linksOrNoLinks)
  .on("/courseCategory", courseCategory)
  .on("/lastQuestion", lastQuestion)
  .on("/tripBuilder", buildTrip)
  .on("/reBuildTrip", reBuildTrip)
  .on("/fullSummaryButton", buildFullTripSummary)
  .on("/openSearcher", openSearcher)
  .on("/", loadHome)
  .notFound(() => {
    document.getElementById("app").innerHTML = "<h1>404</h1>";
  });

export default router;
