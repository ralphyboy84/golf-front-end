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
  getUseYourLocation,
  getMilesSlider,
} from "../../pages/components";
import { router } from "../../router";
import {
  getWhereStayingLatLong,
  fetchAllResults2,
  createLoadingDivsForDayAvailabilitySearches,
  getCoursesForDropDown,
  getSelectValues,
  reorderResultsByTeeTimesAvailable,
} from "../../pages/dayAvailability";
import { populateSelectOptionsForRegionFilter } from "../../pages/selectBoxes";
import { formatDateToDMY } from "../../pages/dateFunctions";
import { loadCourseData } from "../../pages/yourInfo/yourInfo";
import { getBrowserLocation } from "../../pages/mapping";

var maxCourses = 20;

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
    ${getUseYourLocation("bookARoundUseLocation")}
    ${getMilesSlider("milesSlider", "hidden")}
  </div>
  ${noCriteriaAlertMsg}
  <div id="bookingButtonDiv" class="card-actions justify-center hidden">
    <a id="filterCoursesForBookingARound" href="filterCoursesForBookingARound" data-navigo class="btn btn-primary">Search for Courses</a>
  </div>
  <input id="userLocationInfo" class="hidden" value="" />
  `;

  document.getElementById("app").innerHTML = buildCard(
    "arbroath",
    "Book a Round",
    content,
  );

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

    if (
      event.target &&
      event.target.classList.contains("viewCourseFromSearch")
    ) {
      event.preventDefault();

      const target = event.target.closest(".viewCourseFromSearch");

      const courseid = target.getAttribute("data-courseid");
      viewCourseFromSearchResults(courseid);
    }

    if (event.target && event.target.id === "reBook") {
      event.preventDefault();
      reBookCourses();
    }

    if (event.target.closest("#bookARoundUseLocation")) {
      bookATripUseYourLocationSwitch();
    }

    if (event.target.closest(".refreshDate")) {
      event.preventDefault();

      const target = event.target.closest(".refreshDate");

      const date = target.getAttribute("data-date");
      refreshDate(date);
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

    if (event.target.closest("#bookingSorting")) {
      event.preventDefault();

      const sorting = document.getElementById("bookingSorting").value;
      sortResultsPage(sorting);
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
      document.getElementById("bookARoundUseLocation").checked == false &&
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
      document.getElementById("bookARoundUseLocation").checked == false &&
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
  const links = document.getElementById("linksCourses").value;
  const category = document.getElementById("mapCourseCategory").value;
  const top100 = document.getElementById("top100Filter").value;
  const date = document.getElementById("start").value;

  let travelDistanceOption = "";
  let lat = "";
  let lon = "";

  if (document.getElementById("bookARoundUseLocation").checked) {
    travelDistanceOption = document.getElementById("openRange").value;
    const temp = document.getElementById("userLocationInfo").value.split(",");

    lat = temp[0];
    lon = temp[1];
  }

  let keys;
  let length;

  if (document.getElementById("courseLookingForSelect").value == "No") {
    const courseParams = {
      top100,
      nineHoles,
      category,
      links,
      ralphRecommends,
      played,
      travelDistanceOption,
      lat,
      lon,
    };
    const courses = await getCourses(courseParams);

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

  const params = new URLSearchParams({
    date,
    courses: keys.toString(),
  });

  if (length < maxCourses) {
    router.navigate(`/checkBookingForCourses?${params.toString()}`);
    return;
  }

  router.navigate(`/filterCoursesForBookingARound?${params.toString()}`);
}

export async function getFilteredCoursesForBookingARound(params) {
  const coursesFromApi = await getCourses();
  const courses = params.courses.split(",");
  const length = courses.length;
  let content = `
  <div class="max-w-xl mx-auto mb-4 text-center bg-base-100 border border-base-300 rounded-xl text-gray-900 p-4">
  Apologies, at this point in time you can only search for ${maxCourses} courses. The following courses meet your criteria. Check the checkboxes of the courses you want to check booking information for.
  `;

  for (let x in courses) {
    content += `
    <div class="grid grid-cols-[auto_1fr_auto] gap-x-4 items-center mt-4">
      <div class=""><input type="checkbox" class="checkbox" value="${courses[x]}" id="${courses[x]}_checkbox" /></div>
      <div class="font-medium text-left">${coursesFromApi[courses[x]].name}</div>
      <div class=""><a id="viewCourseFromSearch" class="btn btn-primary" data-courseid='${courses[x]}'>View Course</a></div>
    </div>
    `;
  }

  content += `<a id="reBook" class="btn btn-primary mt-4">Search Again</a></div>`;

  document.getElementById("app").innerHTML = content;
}

export var coursesData;

export async function checkBookingForCourses(params) {
  const tripStart = new Date(params.date + "T12:00:00");

  let changeDateDiv = "";
  let border = "";

  for (let i = 1; i <= 3; i++) {
    const nextDate = new Date(tripStart); // Create a copy so we don't change the original
    nextDate.setDate(tripStart.getDate() + i);

    // Format it back to a string (YYYY-MM-DD)
    const formatted = nextDate.toISOString().split("T")[0];

    if (i == 1) {
      border = "rounded-l-full";
    } else if (i == 3) {
      border = "rounded-r-full";
    }

    changeDateDiv += `
    <button class="btn btn-md xl:btn-xl font-medium btn-secondary join-item ${border} refreshDate" data-date=${formatted}>${formatDateToDMY(formatted)}</button>
    `;
    border = "";
  }

  const courseList = params.courses.split(",");
  document.getElementById("app").innerHTML = `
  <h2 class="text-2xl font-bold mb-4">Tee time availability for ${formatDateToDMY(params.date)}</h2>
  <div class="join mb-4 justify-center margin-auto flex w-full justify-center">
    ${changeDateDiv}
  </div>
  <details class="collapse bg-base-100 border-base-300 border mb-4">
    <summary class="collapse-title font-semibold"><!-- Burger Icon -->
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h7"
        />
        </svg>
        <span>Show Map</span>
      </div>
    </summary>
          
    <div class="collapse-content text-md">
      <div id='map'></div>
    </div>
  </details>
  <details class="collapse bg-base-100 border-base-300 border mb-4">
    <summary class="collapse-title font-semibold">
      <!-- Burger Icon -->
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h7"
        />
        </svg>
        <span>Sorting</span>
      </div>
    </summary>
    <div class="collapse-content text-md">
      <div class="flex gap-3 flex-wrap items-center p-2 grid grid-cols-2">
        Sort By: 
        <select id='bookingSorting' class="select">
          <option value='' selected>Select...</option>
          <option value='cheapestprice'>Cheapest Price</option>
          <option value='traveltime'>Shortest Distance</option>
        </select>
      </div>
    </div>
  </details>
  <div id="resultsDiv" class='pt-4 grid grid-cols-1 xl:grid-cols-1 gap-6'></div>
  <input type='hidden' id='days' name='days' value='1' />
  <input type='hidden' id='start' name='start' value='${params.date}' />
  `;

  createLoadingDivsForDayAvailabilitySearches(courseList);
  const browserLocation = await getBrowserLocation();
  let info = "";

  if (browserLocation.lat) {
    info = await getMapDistance(
      browserLocation.lat + "," + browserLocation.lon,
      courseList,
    );
  }

  const weather = await getWeather(courseList);

  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("date");

  coursesData = await getCourses({
    courseList: params.courses,
  });
  loadCourseData(coursesData);

  const resultsContainer = document.getElementById("resultsDiv");

  // 1. Show the overlay
  resultsContainer.classList.add("is-loading");

  await fetchAllResults2(courseList, dateParam, info, weather);
  reorderResultsByTeeTimesAvailable();

  resultsContainer.classList.remove("is-loading");
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

  if (checkedValues.length < maxCourses) {
    router.navigate(
      `/checkBookingForCourses?courses=${checkedValues.toString()}&date=${date}`,
    );
  }
}

async function bookATripUseYourLocationSwitch() {
  if (document.getElementById("bookARoundUseLocation").checked) {
    document.getElementById("milesSlider_1").classList.remove("hidden");
    document.getElementById("milesSlider_2").classList.remove("hidden");

    const browserLocation = await getBrowserLocation();

    if (document.getElementById("userLocationInfo") && browserLocation.lat) {
      document.getElementById("userLocationInfo").value =
        browserLocation.lat + "," + browserLocation.lon;
    }
  } else {
    document.getElementById("milesSlider_1").classList.add("hidden");
    document.getElementById("milesSlider_2").classList.add("hidden");
  }
}

function refreshDate(date) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const courses = urlParams.get("courses");

  router.navigate(`/checkBookingForCourses?courses=${courses}&date=${date}`);
}

function sortResultsPage(sortBy) {
  const container = document.getElementById("resultsDiv");
  const items = Array.from(container.children);

  items.sort((a, b) => {
    // 1. Get the price from data attributes
    // Use parseFloat to handle decimals like 35.00
    let priceA = parseFloat(a.getAttribute("data-" + sortBy));
    let priceB = parseFloat(b.getAttribute("data-" + sortBy));

    // 2. Handle "Unknown" or missing prices
    // If it's not a number (NaN), set it to Infinity so it goes to the bottom
    if (isNaN(priceA)) priceA = Infinity;
    if (isNaN(priceB)) priceB = Infinity;

    // 3. Sort ascending (Low to High)
    return priceA - priceB;
  });

  // 4. Clear and Re-append
  container.innerHTML = "";
  items.forEach((item) => container.appendChild(item));
}
