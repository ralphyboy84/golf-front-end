import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { getAllOpensEndPoint, getRegions } from "../pages/api";

let eventsFetched = false;
let endpoint = getAllOpensEndPoint;
let calendar;
let eventsCache = []; // will store events after first fetch

export async function openSearcher() {
  const data = await getRegions();

  document.getElementById("app").innerHTML = `
  <details class="collapse bg-base-100 border-base-300 border">
    <summary class="collapse-title font-semibold">Show Filters</summary>
    <div class="collapse-content text-md">
      <div class="flex gap-3 flex-wrap items-center p-2">
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
      <div class="flex gap-3 flex-wrap items-center p-2">
        Top 100 Course: 
        <select id='top100Filter' class="select">
          <option value='' selected>Select...</option>
          <option value='Yes'>Yes</option>
          <option value='No'>No</option>
        </select>
      </div>
      <div class="flex gap-3 flex-wrap items-center p-2">
        Region: 
        <select id='regionFilter' class="select">
          <option value='' selected>Select...</option>
        </select>
      </div>
      <a data-navigo class="btn btn-primary" id="keyWordFilter">Filter</a>
    </div>
  </details>
  <div id='calendar' class='mt-4'></div>
  `;

  const select = document.getElementById("regionFilter");

  for (let key in data) {
    const option = document.createElement("option");

    option.value = data[key]; // key as value
    option.textContent = capitalizeFirstChar(data[key]); // display name
    select.appendChild(option);
  }

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

export function filterByKeyWord() {
  if (
    !document.getElementById("keywordSearch").value &&
    !document.getElementById("top100Filter").value &&
    document.getElementById("regionFilter").value
  ) {
    alert("You have not entered anything to filter on....");
    return;
  }

  const keyword = document.getElementById("keywordSearch").value;
  const top100 = document.getElementById("top100Filter").value;
  const regions = document.getElementById("regionFilter").value;

  const params = new URLSearchParams({
    keyword,
    top100,
    regions,
  });

  eventsFetched = false;
  endpoint = `${getAllOpensEndPoint}?${params.toString()}`;
  calendar.refetchEvents();
}

function capitalizeFirstChar(str) {
  if (!str) return ""; // handle empty string

  if (str == "eastlothian") {
    str = "East Lothian";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}
