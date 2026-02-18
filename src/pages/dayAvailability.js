import {
  getCourses,
  getRegions,
  getMapDistance,
  getWeather,
  getCourseAvailabilityForDate,
} from "../pages/api";
import { populateSelectOptionsForRegionFilter } from "../pages/selectBoxes";
import { buildCard, buildCardRow } from "../pages/components";
import {
  iconPound,
  iconSlots,
  iconClock,
  iconCompetition,
} from "../pages/icons";

export async function dayAvailability() {
  const app = document.getElementById("app");

  app.innerHTML = `
  <div class="flex justify-center mb-6">
    <div class="card sm:max-w-sm md:max-w-xl bg-gray-100 border border-base-300 rounded-xl text-gray-900">
      <figure><img src="images/arbroath.jpg" alt="Watch" /></figure>
    </div>
  </div>
  <input type='hidden' id='days' value='1' />
  <div class="card card-border bg-base-500 border border-base-300 w-full">
    <div class="card-body w-full">
      <h2 class="card-title">Search for Day Availability</h2>
      <div class="grid grid-cols-2 gap-4 items-center w-full">
        <div class="w-full">Enter Date:</div>
        <div class="w-full"><input type='date' id='start' value='' class='input bg-gray-50 text-gray-900' /></div>
        <div class="w-full">Regions:</div>
        <div class="w-full"><select id="regionFilter" class="select w-full appearance-none bg-gray-50 text-gray-900" aria-label="select"><option value=''>Select....</option></select></div>
        <div class="w-full">Courses:</div>
        <div class="w-full"><select id="clubsSelect" multiple class="select w-full appearance-none bg-gray-50 text-gray-900" aria-label="select"></select></div>
      </div> 
      <div class="w-full justify-center text-center"><a id="searchForAvailability" class="btn btn-primary">Search For Availability</a></div>
    </div>
  </div>
  <div id='resultsDiv' class='pt-4'></div>
  `;

  await getCoursesForDropDown();
  const data = await getRegions();
  populateSelectOptionsForRegionFilter(data);
}

export async function updateCourseList() {
  var region = getSelectValues(document.getElementById("regionFilter"));

  let regionArray = [];

  for (let x in region) {
    regionArray.push(region[x].course);
  }

  await getCoursesForDropDown(regionArray);
}

export async function getCoursesForDropDown(region) {
  const courses = await getCourses(region);

  document.getElementById("clubsSelect").innerHTML = "";
  const select = document.getElementById("clubsSelect");

  // Loop through the object and add options
  for (const key in courses) {
    if (courses.hasOwnProperty(key)) {
      const option = document.createElement("option");
      option.value = key; // key as value
      option.textContent = courses[key].name; // display name
      option.setAttribute("data-courseId", courses[key].courseId || "");
      select.appendChild(option);
    }
  }
}

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i = 0, iLen = options.length; i < iLen; i++) {
    opt = options[i];

    if (
      opt.selected
      // &&
      // (opt.getAttribute("data-onlineBooking") == "Yes" ||
      //   opt.getAttribute("data-openBooking") == "Yes")
    ) {
      result.push({
        course: opt.value,
        courseName: opt.text,
        courseId: opt.getAttribute("data-courseId") || 1,
      });
    }
  }

  return result;
}

export async function searchForAvailability() {
  var selectBoxValues = getSelectValues(document.getElementById("clubsSelect"));

  if (!selectBoxValues.length) {
    document.getElementById("resultsDiv").innerHTML =
      "You have not selected any courses";
    return;
  }

  const courseLimit = 5;

  if (selectBoxValues.length > courseLimit) {
    alert(
      `Sorry you can only search for a maximum of ${courseLimit} courses just now`,
    );
    return;
  }

  document.getElementById("resultsDiv").innerHTML = "";

  for (let x in selectBoxValues) {
    const parent = document.getElementById("resultsDiv");

    // 2. Create a new child div
    const child = document.createElement("div");
    child.id = selectBoxValues[x].course;

    // 3. Set some content for the child
    child.textContent = "Please wait.... loading.....";

    // 4. Optionally add styles or attributes
    child.classList.add("col-sm-12");
    child.classList.add("col-md-4");
    // child.style.marginTop = "10px";
    // child.style.padding = "5px";

    // 5. Append the child div to the parent div
    parent.appendChild(child);
  }

  const tripStart = document.getElementById("start").value;

  let courseList = [];

  for (let x in selectBoxValues) {
    courseList.push(selectBoxValues[x].course);
  }

  const whereStaying = await getWhereStayingLatLong();
  const info = await getMapDistance(whereStaying, courseList);
  const weather = await getWeather(courseList);

  fetchAllResults2(selectBoxValues, tripStart, info, weather);
}

async function getWhereStayingLatLong() {
  return;
  const params = new URLSearchParams({
    q: document.getElementById("staying").value,
    max: 10,
  });

  return await fetch("https://api.geodojo.net/locate/find?" + params)
    .then((response) => response.json())
    .then((data) => data.result[0].latlng);
}

async function fetchAllResults2(
  selectBoxValues,
  tripStart,
  travelInfo,
  weather,
) {
  const results = {};

  for (let x in selectBoxValues) {
    let count = 0;

    for (let y = 0; y < document.getElementById("days").value; y++) {
      const date = addDays(tripStart, count);
      count++;

      getCourseAvailabilityForDate(
        selectBoxValues[x].course,
        date,
        selectBoxValues[x].courseId,
      ).then(
        (fetchPromise) =>
          (document.getElementById(selectBoxValues[x].course).innerHTML =
            displayContent(
              fetchPromise,
              travelInfo,
              selectBoxValues[x].course,
              weather,
            )) + "<br />",
      );
    }
  }

  return results;
}

function displayContent(msg, travelInfo, courseId, weather) {
  let temp = "";
  let timesAvailable = "";
  let openText = "";
  let openTimesAvailable = "";
  let weatherInfo = "";
  let moreInfoButton = getClickHereForMoreInfoButton(msg);

  if (msg.onlineBooking == "No") {
    temp = `Unfortunately, Online Booking is not available but they do allow visitors on this day`;
  }

  if (msg.teeTimesAvailable == "Yes") {
    temp = "Good news! There are tee times available on this day";

    timesAvailable = buildCardRow(
      iconPound,
      msg.cheapestPrice,
      "Prices Starting From",
    );
    timesAvailable += buildCardRow(iconClock, msg.firstTime, "First Tee Time");
    timesAvailable += buildCardRow(
      iconSlots,
      msg.timesAvailable,
      "Available Slots",
    );

    let driveTime = "Currently Unavailable";

    if (weather[courseId]) {
      weatherInfo = buildCardRow(
        weather[courseId].generalForecast,
        "General Forecast",
        weather[courseId].generalForecastIcon,
      );

      weatherInfo += buildCardRow(
        weather[courseId].chanceOfRain,
        "Chance of Rain",
        "bi-cloud-rain",
      );

      weatherInfo += buildCardRow(
        weather[courseId].tmeperature,
        "Daily High",
        "bi-thermometer",
      );

      weatherInfo += buildCardRow(weather[courseId].wind, "Wind", "bi-wind");
    }

    if (travelInfo[courseId]) {
      driveTime = travelInfo[courseId];
    }

    if (driveTime != "Currently Unavailable") {
      timesAvailable += buildCardRow(
        driveTime,
        "Drive to Course",
        "bi-car-front",
      );
    }

    if (msg.competitionId || msg.name) {
      openText = "<br /><br />" + getOpenText(msg);
    }
  } else if (!temp) {
    if (msg.competitionId && isFutureDate(msg.bookingsOpenDate)) {
      temp = `There is an Open Competition on on this day and bookings for this will become available at ${msg.bookingsOpenDate}`;
    } else if (msg.bookingOpen == "Yes") {
      temp = getOpenText(msg);
      moreInfoButton = "";
    } else if (msg.bookingsOpenDate == "TBC") {
      temp = `There is an Open Competition on on this day but it is not available for booking yet`;
    } else {
      temp = "Sorry - there are no tee times available on this day";
    }
  }

  const content = `
  <p class="card-text">${temp}</p>
  ${timesAvailable}
  ${weatherInfo}
  ${moreInfoButton}
  ${openText}
  `;

  let imageToUse = "";

  if (msg.image == "Yes") {
    imageToUse = courseId;
  }

  return buildCard(imageToUse, msg.courseName, content);
}

function addDays(date, days) {
  var result = new Date(date).getTime() + 86400000 * days;
  const tomorrow = new Date(result);
  let month = tomorrow.getMonth() + 1;

  if (month < 10) {
    month = "0" + month;
  }

  let day = tomorrow.getDate();

  if (day < 10) {
    day = "0" + day;
  }

  return tomorrow.getFullYear() + "-" + month + "-" + day;
}

function getClickHereForMoreInfoButton(msg) {
  return `<a href="${msg.bookingUrl}" class="btn btn-primary" target="_blank">Click here for more info</a>`;
}

function getOpenText(msg) {
  let openText = `
      <p class="card-text">There is an Open Competition on on this day</p>
      `;

  openText += buildCardRow(iconPound, msg.openGreenFee, "Open Entry Fee");
  openText += buildCardRow(iconSlots, msg.slotsAvailable, "Available Slots");
  openText += buildCardRow(iconCompetition, msg.name, "Competition");

  openText += `<a href="${msg.openBookingUrl}" class="btn btn-primary" target="_blank">Click here for more info</a>`;

  return openText;
}

function isFutureDate(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);

  // Create date at midnight to avoid time issues
  const givenDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Guard against invalid dates (e.g. 32/13/2025)
  if (
    givenDate.getFullYear() !== year ||
    givenDate.getMonth() !== month - 1 ||
    givenDate.getDate() !== day
  ) {
    return false;
  }

  return givenDate > today;
}
