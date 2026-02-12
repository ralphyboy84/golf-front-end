import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { getAllOpensEndPoint, getRegions } from "../pages/api";
import { populateSelectOptionsForRegionFilter } from "../pages/selectBoxes";

let eventsFetched = false;
let endpoint = getAllOpensEndPoint;
let calendar;
let eventsCache = []; // will store events after first fetch

export async function openSearcher() {
  const data = await getRegions();

  document.getElementById("app").innerHTML = `
  <details id="openFilters" class="collapse bg-base-100 border-base-300 border">
    <summary class="collapse-title font-semibold">Show Filters</summary>
    <div class="collapse-content text-md">
      <div id="innerFilterDiv" class="flex gap-3 flex-wrap items-center p-2 grid grid-cols-2">
        Keyword Search: 
        <label class="input">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" id="keywordSearch" required placeholder="Enter a phrase like ladies, gents, mixed etc." />
        </label>
      </div>
      <div class="flex gap-3 flex-wrap items-center p-2 grid grid-cols-2">
        Top 100 Course: 
        <select id='top100Filter' class="select">
          <option value='' selected>Select...</option>
          <option value='Yes'>Yes</option>
          <option value='No'>No</option>
        </select>
      </div>
      <div class="flex gap-3 flex-wrap items-center p-2 grid grid-cols-2">
        Region: 
        <select id='regionFilter' class="select">
          <option value='' selected>Select...</option>
        </select>
      </div>
      <div class="flex gap-3 flex-wrap items-center p-2 grid grid-cols-2">
        Use Your Location: 
        <input id="useYourLocationForOpenFiltering" type="checkbox" class="toggle toggle-primary" />
      </div>
      <div id="showHowManyMilesDiv" class="flex gap-3 flex-wrap items-center p-2 hidden grid grid-cols-2">
        How Many Miles From You: 
        <div class="w-full max-w-xs">
          <input id="openRange" type="range" min="20000" max="100000" value="0" class="range range-primary" step="20000" />
          <div class="flex justify-between px-2.5 mt-2 text-xs">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
          <div class="flex justify-between px-2.5 mt-2 text-xs">
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100</span>
          </div>
        </div>
      </div>
      <div class="flex text-center justify-center gap-3 mt-3">
        <a data-navigo class="btn btn-primary" id="clearFilters">Clear Filters</a>
        <a data-navigo class="btn btn-primary" id="keyWordFilter">Apply Filters</a>
      </div>
    </div>
  </details>
  <input id="userLocationInfo" class="hidden" value="" />
  <div id='calendar' class='mt-4'></div>
  `;

  populateSelectOptionsForRegionFilter(data);
  initialiseCalendar();
}

export function filterByKeyWord() {
  if (
    !document.getElementById("keywordSearch").value &&
    !document.getElementById("top100Filter").value &&
    !document.getElementById("regionFilter").value &&
    !document.getElementById("useYourLocationForOpenFiltering").checked
  ) {
    alert("You have not entered anything to filter on....");
    return;
  }

  const keyword = document.getElementById("keywordSearch").value;
  const top100 = document.getElementById("top100Filter").value;
  const regions = document.getElementById("regionFilter").value;

  let distance = "";
  let latlon = "";

  if (document.getElementById("useYourLocationForOpenFiltering").checked) {
    distance = document.getElementById("openRange").value;
    latlon = document.getElementById("userLocationInfo").value;
  }

  const params = new URLSearchParams({
    keyword,
    top100,
    regions,
    distance,
    latlon,
  });

  eventsFetched = false;
  endpoint = `${getAllOpensEndPoint}?${params.toString()}`;
  calendar.refetchEvents();
}

export function clearFilters() {
  document.getElementById("keywordSearch").value = "";
  document.getElementById("top100Filter").value = "";
  document.getElementById("regionFilter").value = "";
  document.getElementById("useYourLocationForOpenFiltering").checked = "";
  document.getElementById("showHowManyMilesDiv").classList.add("hidden");
}

export function useYourLocationSwitch() {
  if (document.getElementById("useYourLocationForOpenFiltering").checked) {
    document.getElementById("showHowManyMilesDiv").classList.remove("hidden");

    navigator.geolocation.getCurrentPosition(function (location) {
      if (document.getElementById("userLocationInfo")) {
        document.getElementById("userLocationInfo").value =
          location.coords.latitude + "," + location.coords.longitude;
      }
    });
  } else {
    document.getElementById("showHowManyMilesDiv").classList.add("hidden");
  }
}

function initialiseCalendar() {
  var calendarEl = document.getElementById("calendar");

  let initialView = "dayGridMonth";

  if (window.innerWidth < 600) {
    initialView = "listWeek";
  }

  calendar = new Calendar(calendarEl, {
    themeSystem: "bootstrap5",
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView,
    height: "auto", // lets it fill the parent, but can cause tiny height if empty
    contentHeight: "auto", // similar
    dayMaxEventRows: true, // optional
    lazyFetching: true,
    // Add a minHeight
    viewDidMount: function (info) {
      // set a min height for the listWeek container
      info.el.style.minHeight = "400px"; // adjust as needed
    },
    // events(fetchInfo, success, failure) {
    //   fetch(endpoint)
    //     .then((r) => r.json())
    //     .then(success)
    //     .catch(failure);
    // },
    events: function (fetchInfo, successCallback, failureCallback) {
      if (!eventsFetched) {
        // fetch events from server only once
        fetch(endpoint)
          .then((res) => res.json())
          .then((data) => {
            eventsCache = data; // store them
            eventsFetched = true; // prevent future fetches
            successCallback(eventsCache);
          })
          .catch((err) => failureCallback(err));
      } else {
        // return cached events
        successCallback(eventsCache);
      }
    },
    windowResize: function (view) {
      if (window.innerWidth < 600) {
        calendar.changeView("listWeek"); // switch to list view on mobile
        calendar.setOption("height", "auto");
      } else {
        calendar.changeView("dayGridMonth"); // back to month on desktop
      }
    },
    eventClick: function (info) {
      // If event has a URL
      if (info.event.url) {
        window.open(info.event.url, "_blank"); // opens in new tab
        info.jsEvent.preventDefault(); // prevents default FullCalendar behavior
      }
    },
    loading: function (isLoading) {
      // isLoading is true when fetching starts, false when finished
      //   var loadingEl = document.getElementById("loading");
      //   if (isLoading) {
      //     loadingEl.style.display = "block";
      //   } else {
      //     loadingEl.style.display = "none";
      //   }
    },
  });
  calendar.render();
}
