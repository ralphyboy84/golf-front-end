import { buildCard, buildCardRow } from "../../pages/components";
import { createCardsForDayAndAddToDOM } from "../../pages/tripBuilder";
import { formatDateToDMY } from "../../pages/dateFunctions";

export function previousTrips() {
  const searchCounts = localStorage.getItem("searchCount");
  const app = document.getElementById("app");

  if (!searchCounts) {
    app.innerHTML = buildCard(
      "fraserburgh",
      "Cannot Find Search",
      "You do not seem to have made any previous searches",
      "noPreviousSearches",
    );
    return;
  }

  let content = "";

  for (let x = 1; x <= searchCounts; x++) {
    console.log(localStorage.getItem("searchCriteria" + x));

    const icon = "<i class='fa-solid fa-golf-ball-tee'></i>";
    const message = getPreviousTripMessage(x, localStorage);
    const button = `<a id='' data-navigo class='btn btn-primary viewTrip whitespace-nowrap' data-tripId=${x}>View Trip</a>`;

    content += buildCardRow(
      icon,
      localStorage.getItem("searchCriteria" + x),
      message,
      button,
    );
  }

  content +=
    "<p class='card-text text-center'><a id='deletePreviousTripSearches' class='btn btn-primary'>Delete Previous Trip Searches</a></p>";

  app.innerHTML = buildCard(
    "blairgowrie",
    "Previous Trip Searches",
    content,
    "previousSearchesDiv",
  );
}

function getPreviousTripMessage(x, storage) {
  return `Trip Starting on ${formatDateToDMY(storage.getItem("searchCriteriaDate" + x))} for  ${storage.getItem("searchNumberOfDays" + x)} days`;
}

export function viewTrip(tripId) {
  if (!localStorage.getItem("search" + tripId)) {
    app.innerHTML = buildCard(
      "fraserburgh",
      "Can't Find Search",
      "Whoops! We can't seem to find that search",
    );

    return;
  }
  const results = JSON.parse(localStorage.getItem("search" + tripId));

  document.getElementById("tripResults").value = localStorage.getItem(
    "search" + tripId,
  );

  createCardsForDayAndAddToDOM(
    results,
    localStorage.getItem("searchNumberOfDays" + tripId),
  );
}

export function deletePreviousSearches() {
  const searchCounts = localStorage.getItem("searchCount");

  for (let x = 1; x <= searchCounts; x++) {
    localStorage.removeItem("search" + x);
    localStorage.removeItem("searchCriteria" + x);
    localStorage.removeItem("searchCriteriaDate" + x);
    localStorage.removeItem("searchNumberOfDays" + x);
  }

  localStorage.removeItem("searchCount");
}
