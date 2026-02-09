import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { getAllOpensEndPoint } from "../pages/api";

export function openSearcher() {
  let calendar;
  let endpoint = getAllOpensEndPoint;
  let eventsCache = []; // will store events after first fetch
  let eventsFetched = false;

  document.getElementById("app").innerHTML = "<div id='calendar'></div>";
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
