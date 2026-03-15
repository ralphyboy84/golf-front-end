import {
  getLoggedInUserInfo,
  getCourses,
  getMapDistance,
  getWeather,
  getRegions,
} from "../../pages/api";
import {
  buildCard,
  getErrorMessage,
  getTop100CourseSelect,
  get9HoleCourseSelect,
  getRalphRecommendsSelect,
  getLinksCourseSelect,
  getYouHavePlayedSelect,
  getCourseCategorySelect,
} from "../../pages/components";
import { router } from "../../router";
import {
  getWhereStayingLatLong,
  fetchAllResults2,
  createLoadingDivsForDayAvailabilitySearches,
  getCoursesForDropDown,
  getSelectValues,
} from "../../pages/dayAvailability";
import { populateSelectOptionsForRegionFilter } from "../../pages/selectBoxes";
import { formatDateToYMD } from "../../pages/dateFunctions";

export async function bookARound() {
  const loggedIn = await getLoggedInUserInfo();

  let youHavePlayed = "";

  if (loggedIn.username) {
    youHavePlayed = getYouHavePlayedSelect();
  }

  const alertMsg = getErrorMessage(
    "dayAvailabilityDateError",
    "You have not entered a date",
  );

  const noCourseAlertMsg = getErrorMessage(
    "noCourseSelectedError",
    "You have not selected a course",
  );

  const noCriteriaAlertMsg = getErrorMessage(
    "noCriteriaAlertMsg",
    "You have not selected any criteria",
  );

  const content = `
  <input type='hidden' id='days' value='1' />
  <p class="mb-4">Check for tee time availability at over 350 courses in Scotland</p>
  <div class="grid grid-cols-2 gap-4 items-center w-full mb-4">
    <div class="w-full">Enter Date:</div>
    <div class="w-full"><input type='date' id='start' value='' class='input bg-gray-50 text-gray-900' /></div>
  </div>
  ${alertMsg}
  <div class="grid grid-cols-2 gap-4 items-center w-full mb-4">
    <div class="w-full">Do you know the name of the course(s) that you are looking to play?:</div>
    <div class="w-full">
      <select id="courseLookingForSelect" class="select w-full appearance-none bg-gray-50 text-gray-900" aria-label="select">
        <option value=''>Select....</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    </div>
  </div>
  <div id="courseSelectDiv" class="grid grid-cols-2 gap-4 items-center w-full mb-4 hidden">
    <div class="w-full">Regions:</div>
    <div class="w-full"><select id="regionFilter" class="select w-full appearance-none bg-gray-50 text-gray-900" aria-label="select"><option value=''>Select....</option></select></div>
    <div class="w-full">Courses:</div>
    <div class="w-full"><select id="clubsSelect" multiple class="select w-full appearance-none bg-gray-50 text-gray-900" aria-label="select"></select></div>
  </div>
  ${noCourseAlertMsg}
  <div id="courseFilterDiv" class="grid grid-cols-2 gap-4 items-center w-full mb-4 hidden">
    ${getTop100CourseSelect()}
    ${get9HoleCourseSelect()}
    ${getRalphRecommendsSelect()}
    ${getLinksCourseSelect()}
    ${getCourseCategorySelect()}
    ${youHavePlayed}
  </div>
  ${noCriteriaAlertMsg}
  <div id="bookingButtonDiv" class="card-actions justify-center hidden">
    <a id="filterCoursesForBookingARound" href="filterCoursesForBookingARound" data-navigo class="btn btn-primary">Search for Courses</a>
  </div>
  `;

  document.getElementById("app").innerHTML =
    buildCard("arbroath", "Book a Round", content) +
    `  <div id='resultsDiv' class='pt-4'></div>`;

  await getCoursesForDropDown();
  const data = await getRegions();
  populateSelectOptionsForRegionFilter(data, "regionFilter");
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", function (event) {
    // Check if the clicked element is our specific button
    if (event.target && event.target.id === "filterCoursesForBookingARound") {
      event.preventDefault();
      handleSearchForCourseButton();
    }

    if (event.target && event.target.id === "viewCourseFromSearch") {
      event.preventDefault();
      const courseid = document
        .getElementById("viewCourseFromSearch")
        .getAttribute("data-courseid");
      viewCourseFromSearchResults(courseid);
    }

    if (event.target && event.target.id === "reBook") {
      event.preventDefault();
      reBookCourses();
    }
  });

  document.body.addEventListener("change", function (event) {
    if (event.target.closest("#courseLookingForSelect")) {
      const courseLookingForSelect = document.getElementById(
        "courseLookingForSelect",
      ).value;

      document.getElementById("courseSelectDiv").classList.add("hidden");
      document.getElementById("courseFilterDiv").classList.add("hidden");

      if (courseLookingForSelect == "Yes") {
        document.getElementById("courseSelectDiv").classList.remove("hidden");
        document.getElementById("bookingButtonDiv").classList.remove("hidden");
      } else if (courseLookingForSelect == "No") {
        document.getElementById("courseFilterDiv").classList.remove("hidden");
        document.getElementById("bookingButtonDiv").classList.remove("hidden");
      }
    }
  });
});

async function handleSearchForCourseButton() {
  if (!document.getElementById("start").value) {
    document
      .getElementById("dayAvailabilityDateError")
      .classList.remove("hidden");
    return;
  }

  document.getElementById("dayAvailabilityDateError").classList.add("hidden");

  if (
    !document.getElementById("clubsSelect").value &&
    document.getElementById("courseLookingForSelect").value == "Yes"
  ) {
    document.getElementById("noCourseSelectedError").classList.remove("hidden");
    return;
  }

  document.getElementById("noCourseSelectedError").classList.add("hidden");

  let loggedInFlag = false;

  if (document.getElementById("played")) {
    loggedInFlag = true;
  }

  if (loggedInFlag == false) {
    if (
      !document.getElementById("top100Filter").value &&
      !document.getElementById("nineHoleFilter").value &&
      !document.getElementById("ralphRecommends").value &&
      !document.getElementById("linksCourses").value &&
      !document.getElementById("mapCourseCategory").value &&
      document.getElementById("courseLookingForSelect").value == "No"
    ) {
      document.getElementById("noCriteriaAlertMsg").classList.remove("hidden");
      return;
    }
  } else if (loggedInFlag == true) {
    if (
      !document.getElementById("top100Filter").value &&
      !document.getElementById("nineHoleFilter").value &&
      !document.getElementById("ralphRecommends").value &&
      !document.getElementById("linksCourses").value &&
      !document.getElementById("mapCourseCategory").value &&
      !document.getElementById("played").value &&
      document.getElementById("courseLookingForSelect").value == "No"
    ) {
      document.getElementById("noCriteriaAlertMsg").classList.remove("hidden");
      return;
    }
  }

  document.getElementById("noCriteriaAlertMsg").classList.add("hidden");

  let played = "";

  if (document.getElementById("played")) {
    played = document.getElementById("played").value;
  }

  const nineHoles = document.getElementById("nineHoleFilter").value;
  const ralphRecommends = document.getElementById("ralphRecommends").value;
  const linksCourses = document.getElementById("linksCourses").value;
  const category = document.getElementById("mapCourseCategory").value;
  const top100 = document.getElementById("top100Filter").value;
  const date = document.getElementById("start").value;

  let keys;
  let length;

  if (document.getElementById("courseLookingForSelect").value == "No") {
    const courses = await getCourses(
      "",
      top100,
      nineHoles,
      category,
      linksCourses,
      ralphRecommends,
      played,
      "Yes",
    );

    length = Object.keys(courses).length;
    keys = Object.keys(courses);
  } else if (document.getElementById("courseLookingForSelect").value == "Yes") {
    keys = getSelectValues(document.getElementById("clubsSelect"));
    length = keys.length;
  }

  if (length == 0) {
    alert("No courses found to match this criteria");
    return;
  }

  if (length < 10) {
    router.navigate(
      `/checkBookingForCourses?courses=${keys.toString()}&date=${date}`,
    );
    return;
  }

  router.navigate(
    `/filterCoursesForBookingARound?date=${date}&courses=${keys.toString()}`,
  );
}

export async function getFilteredCoursesForBookingARound(params) {
  const coursesFromApi = await getCourses();
  const courses = params.courses.split(",");
  const length = courses.length;
  let content = `The following courses meet your criteria:`;

  for (let x in courses) {
    content += `
    <div id="courseSelectDiv" class="grid grid-cols-3 gap-4 items-center mb-4">
      <div class="w-full"><input type="checkbox" class="checkbox" value="${courses[x]}" id="${courses[x]}_checkbox" /></div>
      <div class="w-full">${coursesFromApi[courses[x]].name}</div>
      <div class="w-full"><a id="viewCourseFromSearch" class="btn btn-primary" data-courseid='${courses[x]}'>View Course</a></div>
    </div>
    `;
  }

  content += `<a id="reBook" class="btn btn-primary">Book</a>`;

  document.getElementById("app").innerHTML = content;
}

export async function checkBookingForCourses(params) {
  const courseList = params.courses.split(",");
  document.getElementById("app").innerHTML = `
    <div id="resultsDiv"></div>
    <input type='hidden' id='days' name='days' value='1' />
    <input type='hidden' id='start' name='start' value='${params.date}' />
    `;

  createLoadingDivsForDayAvailabilitySearches(courseList);
  const whereStaying = await getWhereStayingLatLong();
  const info = await getMapDistance(whereStaying, courseList);
  const weather = await getWeather(courseList);

  fetchAllResults2(courseList, formatDateToYMD(params.date), info, weather);
}

function viewCourseFromSearchResults(courseid) {
  router.navigate(`/viewCourse/${courseid}`);
}

function reBookCourses() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const date = urlParams.get("date");

  const checkedValues = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked'),
  ).map((cb) => cb.value);

  if (checkedValues.length < 10) {
    router.navigate(
      `/checkBookingForCourses?courses=${checkedValues.toString()}&date=${date}`,
    );
  }
}
