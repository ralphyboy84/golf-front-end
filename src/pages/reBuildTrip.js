import { abstractedFunction } from "../pages/tripBuilder";
import { getLoadingDiv } from "../pages/loadingDiv";

export function reBuildTrip() {
  const app = document.getElementById("app");
  app.innerHTML = getLoadingDiv(0);

  const previousResults = JSON.parse(
    document.getElementById("previousTripResults").value,
  );

  const coursesToUse = document.getElementById("coursesToUse").value;

  let results = filterCourses(previousResults, coursesToUse.split(","));
  abstractedFunction(results, 3, app);
}

export function filterCourses(data, allowedKeys) {
  const result = {};

  // Loop through allowed keys and copy them if they exist in data
  allowedKeys.forEach((key) => {
    if (data[key]) {
      result[key] = data[key];
    }
  });

  return result;
}
