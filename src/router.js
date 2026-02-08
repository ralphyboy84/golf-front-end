import Navigo from "navigo";

import {
  tripPage,
  setDate,
  whereStaying,
  linksOrNoLinks,
  courseCategory,
  lastQuestion,
} from "./pages/trip.js";

import { cvPage } from "./pages/cv.js";
import { buildTrip } from "./pages/tripBuilder.js";
import { reBuildTrip } from "./pages/reBuildTrip.js";

export const router = new Navigo("/");

router
  .on("/cv", cvPage)
  .on("/trip", tripPage)
  .on("/tripDate", setDate)
  .on("/whereStaying", whereStaying)
  .on("/linksOrNoLinks", linksOrNoLinks)
  .on("/courseCategory", courseCategory)
  .on("/lastQuestion", lastQuestion)
  .on("/tripBuilder", buildTrip)
  .on("/reBuildTrip", reBuildTrip)
  .notFound(() => {
    document.getElementById("app").innerHTML = "<h1>404</h1>";
  });

export default router;
