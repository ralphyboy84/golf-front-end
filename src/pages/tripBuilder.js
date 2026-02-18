import { buildTripSummaryTable } from "../pages/tripSummaryTable";
import { commonHeaderInfo } from "../pages/trip";
import { getLoadingDiv } from "../pages/loadingDiv";
import { buildCardRow, buildCard } from "../pages/components";
import {
  getListOfPotentialCourses,
  getCourseAvailabilityForDate,
} from "../pages/api";
import { router } from "../router";
import { iconPound, iconDate, iconClock } from "../pages/icons";

function getMultiSelectValues(selectBox) {
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

export async function buildTrip() {
  commonHeaderInfo();
  const app = document.getElementById("app");

  // try {
  app.innerHTML = getLoadingDiv(0);
  const lat = document.getElementById("lat").value;
  const lon = document.getElementById("lon").value;
  const courseTypeOption = document.getElementById("courseType").value;
  const courseQualityOption = document.getElementById("courseCategory").value;
  const travelDistanceOption = document.getElementById("miles").value;
  const courseList = await getListOfPotentialCourses(
    lat,
    lon,
    courseTypeOption,
    courseQualityOption,
    travelDistanceOption,
  );
  await getTripInformation(courseList);
  // } catch (err) {
  //   app.innerHTML = "<p>Error loading data.</p>";
  //   console.log(err);
  // }
}

export function buildTripBuilderOutput(
  courseInfo,
  dayNumber,
  id,
  additionalClass,
  maxDays,
) {
  let content = buildCardRow(iconDate, courseInfo.date, "Date");
  content += buildCardRow(iconPound, courseInfo.price, "Price");
  content += buildCardRow(iconClock, courseInfo.firstTime, "First Tee Time");
  content += `<div class="card-actions justify-center">`;

  if (dayNumber != 0) {
    content += `<a class="btn btn-primary previousDayButton" id="previousDayButton${dayNumber}" data-previousDay=${dayNumber * 1 - 1} data-totalDays=${maxDays}>Previous Day</a>`;
  }

  if (dayNumber < maxDays - 1) {
    content += `<a class="btn btn-primary nextDayButton" id="nextDayButton${dayNumber}" data-nextDay=${dayNumber * 1 + 1} data-totalDays=${maxDays}>Next Day</a>`;
  }

  if (dayNumber == maxDays - 1) {
    content += `<a href="/fullSummaryButton" data-navigo class="btn btn-primary" id="fullSummaryButton">Full Trip Summary</a>`;
  }

  content += `</div>`;

  let imageToUse = "";

  if (courseInfo.image == "Yes") {
    imageToUse = courseInfo.id;
  }

  console.log(imageToUse);
  console.log(courseInfo);

  return buildCard(
    imageToUse,
    `${courseInfo.course} - Day ${dayNumber * 1 + 1}`,
    content,
    id,
    additionalClass,
  );
}

export async function getAllCourseAvailability(courses, numberOfDays, app) {
  if (!numberOfDays) {
    router.navigate("/");
    return;
  }

  const totalApiCalls = Object.keys(courses).length * numberOfDays;
  const startDate = getStartDate();
  const results = {};

  let percentage;
  let otherCount = 0;

  for (let x in courses) {
    let count = 0;
    const fetchPromises = [];

    for (let y = 0; y < numberOfDays; y++) {
      const date = addDays(startDate, count);
      count++;
      otherCount++;
      const fetchPromise = getCourseAvailabilityForDate(
        x,
        date,
        courses[x].courseId,
      );
      fetchPromises.push(fetchPromise);
    }

    // Wait for all fetches for this x to complete
    results[x] = await Promise.all(fetchPromises);

    percentage = (otherCount / totalApiCalls) * 100;

    await sleep(250);

    app.innerHTML = getLoadingDiv(percentage);
  }

  return results;
}

export async function getTripInformation(courses) {
  const numberOfDays = document.getElementById("tripLength").value;

  if (Object.keys(courses).length < numberOfDays) {
    app.innerHTML =
      "Not enough courses have been returned to build your trip. Try shortening your trip or expanding your criteria";
    return;
  }

  const results = await getAllCourseAvailability(courses, numberOfDays, app);
  console.log(results);
  document.getElementById("previousTripResults").value =
    JSON.stringify(results);
  abstractedFunction(results, numberOfDays, app);
}

export function abstractedFunction(results, numberOfDays, app) {
  const div = app;
  app.innerHTML = "";

  const unavailable = {};

  // Loop through the data
  for (const key in results) {
    const allNo = results[key].every(
      (entry) => entry.teeTimesAvailable === "No",
    );
    if (allNo) {
      unavailable[key] = results[key]; // Move to unavailable
      delete results[key]; // Remove from original
    }
  }

  if (!results) {
    router.navigate("/");
    return;
  }

  const length = Object.keys(results).length;

  if (Object.keys(results).length == numberOfDays) {
    const newResults = doTheHardBit(results);

    if (typeof newResults === "string") {
      app.innerHTML += newResults;
      return;
    }

    let tmp = "";
    let additionalClass = "";

    for (let a in newResults) {
      if (a != 0) {
        additionalClass = "hidden";
      }
      tmp += buildTripBuilderOutput(
        newResults[a],
        a,
        `course${a}`,
        additionalClass,
        numberOfDays,
      );
    }

    document.getElementById("tripResults").value = JSON.stringify(newResults);
    const diaryDiv = document.createElement("div");
    diaryDiv.innerHTML = `
    <div class="flex justify-center">
    ${tmp}
    </div>
    `;
    div.appendChild(diaryDiv);
  } else if (Object.keys(results).length > numberOfDays) {
    const content = `
    <p class="mb-4">Too many courses have been returned to build your trip. Check the checkboxes of the courses you would like to include in your trip.</p>
    <div class="card-actions justify-center">
      <a href='/reBuildTrip' class="btn btn-primary" id="rebuildMyTripButton">Rebuild Trip</a>
    </div>
    `;

    app.innerHTML += buildCard(
      "boatofgarten",
      "Too Many Options",
      content,
      "tooManyOptionsCard",
    );

    let table = buildTripSummaryTable(results);
    // Append table to div
    div.appendChild(table);
  } else if (Object.keys(results).length < numberOfDays) {
    app.innerHTML +=
      "Not enough courses have been returned to build your trip. Try shortening your trip or expanding your criteria";
  }
}

export function addDays(date, days) {
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

export function sortAvailabilityByCount(availabilityObject) {
  const availabilityCounts = Object.entries(availabilityObject).map(
    ([courseKey, teeTimes]) => {
      // Use a Set to store unique dates with teeTimesAvailable === "Yes"
      const availableDates = new Set();

      teeTimes.forEach((tt) => {
        if (tt.teeTimesAvailable === "Yes") {
          availableDates.add(tt.date);
        }
      });

      // Return an object with courseName and count of available dates
      return {
        courseName: courseKey,
        availableDatesCount: availableDates.size,
      };
    },
  );

  // Sort ascending by availableDatesCount
  availabilityCounts.sort(
    (a, b) => a.availableDatesCount - b.availableDatesCount,
  );

  return availabilityCounts;
}

export function getUniqueDates(golfData) {
  const allDates = Object.values(golfData)
    .flat() // combine all arrays
    .map((tt) => tt.date); // extract the date

  // Remove duplicates using a Set and sort ascending
  const uniqueSortedDates = [...new Set(allDates)].sort();
  return uniqueSortedDates;
}

function doTheHardBit(availabilityObject) {
  const availabilityCounts = sortAvailabilityByCount(availabilityObject);
  const allDates = getUniqueDates(availabilityObject);

  // Make a deep copy so we can safely mutate
  const remainingAvailable = JSON.parse(JSON.stringify(availabilityObject));

  const returnedObject = [];
  const usedDates = new Set();
  let totalDays;

  availabilityCounts.forEach(({ courseName }) => {
    const teeTimes = remainingAvailable[courseName];
    totalDays = remainingAvailable[courseName].length;

    // Find the first available date that hasn't been used yet
    const firstAvailable = teeTimes.find(
      (tt) => tt.teeTimesAvailable === "Yes" && !usedDates.has(tt.date),
    );

    if (firstAvailable) {
      // Add to returned array
      returnedObject.push({
        id: courseName,
        date: firstAvailable.date,
        course: firstAvailable.courseName,
        price: firstAvailable.cheapestPrice,
        timesAvailable: firstAvailable.timesAvailable,
        firstTime: firstAvailable.firstTime,
        image: firstAvailable.image,
      });

      // Mark this date as used
      usedDates.add(firstAvailable.date);

      // Remove the selected date from this course's array
      const index = teeTimes.findIndex((tt) => tt.date === firstAvailable.date);
      if (index !== -1) {
        teeTimes.splice(index, 1);
      }
    }

    // Optionally, remove the course entirely
    delete remainingAvailable[courseName];
  });

  const td = Number(totalDays);
  const len = returnedObject.length;

  if (td === len) {
    return returnedObject.sort((a, b) => (a.date > b.date ? 1 : -1));
  } else {
    const datesNoAvailability = findDatesWhereNoAvailability(
      allDates,
      returnedObject,
    );
    return (
      "no availability for any of your courses: " +
      datesNoAvailability.join(", ")
    );
  }
}

export function findDatesWhereNoAvailability(allDates, usedDates) {
  const usedDatesOnly = usedDates.map((d) => d.date);

  // Filter the first array to only include dates NOT in the second array
  return allDates.filter((d) => !usedDatesOnly.includes(d));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStartDate() {
  return document.getElementById("date").value;
}
