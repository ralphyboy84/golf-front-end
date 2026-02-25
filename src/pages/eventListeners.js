import { router } from "../router";
import {
  filterByKeyWord,
  clearFilters,
  useYourLocationSwitch,
  refreshCalendar,
} from "../pages/calendar";
import { buildFullTripSummary } from "../pages/buildFullTripSummary.js";
import {
  updateCourseList,
  searchForAvailability,
} from "../pages/dayAvailability.js";
import { getAllOpensEndPoint } from "../pages/api";
import { openSearcher } from "../pages/calendar.js";
import { viewCourse } from "../pages/courseDirectory.js";
import { viewCourseGallery } from "../pages/courseGallery.js";

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", function (event) {
    if (event.target.closest(".nextDayButton")) {
      const button = event.target.closest(".nextDayButton");

      const nextDay = document
        .getElementById(button.id)
        .getAttribute("data-nextDay");

      const totalDays = document
        .getElementById(button.id)
        .getAttribute("data-totalDays");

      for (let x = 0; x < totalDays; x++) {
        document.getElementById(`course${x}`).classList.remove("hidden");
        document.getElementById(`course${x}`).classList.add("hidden");
      }

      document.getElementById(`course${nextDay}`).classList.remove("hidden");
    }

    if (event.target.closest(".previousDayButton")) {
      const button = event.target.closest(".previousDayButton");

      const nextDay = document
        .getElementById(button.id)
        .getAttribute("data-previousDay");

      const totalDays = document
        .getElementById(button.id)
        .getAttribute("data-totalDays");

      for (let x = 0; x < totalDays; x++) {
        document.getElementById(`course${x}`).classList.remove("hidden");
        document.getElementById(`course${x}`).classList.add("hidden");
      }

      document.getElementById(`course${nextDay}`).classList.remove("hidden");
    }

    if (event.target.closest("#nextStepBtn")) {
      event.preventDefault();
      const dateValue = document.getElementById("startDate").value;

      if (!dateValue) {
        document.getElementById("startDate").classList.add("input-error");
        document.getElementById("nextStepBtnAlert").classList.remove("hidden");
        return;
      }

      document.getElementById("date").value = encodeURIComponent(dateValue);
      router.navigate("/tripLength");
    }

    if (event.target.closest("#tripLengthButton")) {
      event.preventDefault();
      const tripLengthInDays =
        document.getElementById("tripLengthInDays").value;
      document.getElementById("tripLength").value =
        encodeURIComponent(tripLengthInDays);
      router.navigate("/whereStaying");
    }

    if (event.target.closest("#linksNoLinks")) {
      event.preventDefault();
      const whereStaying = document.getElementById("whereStayingSelect").value;

      if (!whereStaying) {
        document
          .getElementById("whereStayingSelect")
          .classList.add("input-error");
        document.getElementById("whereStayingAlert").classList.remove("hidden");
        return;
      }

      const select = document.getElementById("whereStayingSelect");
      const selectedOption = select.options[select.selectedIndex];

      const lat = selectedOption.getAttribute("data-lat");
      const lon = selectedOption.getAttribute("data-lon");

      document.getElementById("lat").value = encodeURIComponent(lat);
      document.getElementById("lon").value = encodeURIComponent(lon);

      router.navigate("/linksOrNoLinks");
    }

    if (event.target.closest("#courseCategoryButton")) {
      event.preventDefault();
      const courseType = document.getElementById("courseTypeSelect").value;

      if (!courseType) {
        document
          .getElementById("courseTypeSelect")
          .classList.add("input-error");
        document.getElementById("linksNoLinksAlert").classList.remove("hidden");
        return;
      }

      document.getElementById("courseType").value =
        encodeURIComponent(courseType);

      router.navigate("/courseCategory");
    }

    if (event.target.closest("#lastQuestionButton")) {
      event.preventDefault();
      const courseCategory = getMultiSelectValues(
        document.getElementById("courseCategorySelect"),
      );

      if (!courseCategory.length) {
        document
          .getElementById("courseCategorySelect")
          .classList.add("input-error");
        document
          .getElementById("courseCategoryAlert")
          .classList.remove("hidden");
        return;
      }

      document.getElementById("courseCategory").value = courseCategory;
      router.navigate("/lastQuestion");
    }

    if (event.target.closest("#buildMyTripButton")) {
      event.preventDefault();
      const miles = document.getElementById("milageRange").value;
      document.getElementById("miles").value = encodeURIComponent(miles);
      router.navigate("/tripBuilder");
    }

    if (event.target.closest("#rebuildMyTripButton")) {
      event.preventDefault();

      const checkedValues = Array.from(
        document.querySelectorAll('input[type="checkbox"]:checked'),
      ).map((cb) => cb.value);

      document.getElementById("coursesToUse").value = checkedValues;
      router.navigate("/reBuildTrip");
    }

    if (event.target.closest("#keyWordFilter")) {
      event.preventDefault();

      filterByKeyWord();
    }

    if (event.target.closest("#clearFilters")) {
      launchClearFiltersFunctions();
      event.preventDefault();
    }

    if (event.target.closest("#useYourLocationForOpenFiltering")) {
      useYourLocationSwitch();
    }

    if (event.target.closest("#fullSummaryButton")) {
      event.preventDefault();
      buildFullTripSummary();
    }

    if (event.target.closest("#searchForAvailability")) {
      event.preventDefault();
      searchForAvailability();
    }

    if (event.target.closest(".bookTripButton")) {
      const button = event.target.closest(".bookTripButton");

      if (button) {
        window.open(button.dataset.bookingurl, "_blank");
      }
    }

    if (event.target.closest("#viewCourse")) {
      event.preventDefault();
      viewCourse();
    }

    if (event.target.closest("#viewCourseGallery")) {
      event.preventDefault();
      const courseId = document
        .getElementById("viewCourseGallery")
        .getAttribute("data-courseid");

      viewCourseGallery(courseId);
    }
  });

  document.body.addEventListener("change", function (event) {
    if (event.target.closest("#regionFilter")) {
      updateCourseList();
    }
  });
});

function getMultiSelectValues(selectBox) {
  var result = [];
  var options = selectBox && selectBox.options;
  var opt;

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value);
    }
  }

  return result;
}

async function launchClearFiltersFunctions() {
  await clearFilters();
  refreshCalendar(getAllOpensEndPoint);
}

function bookTripButton(element) {
  console.log(element);
  const el = element.target; // the element the listener is attached to
  console.log(el.dataset); // all data attributes
  console.log(el.dataset.id);
}
