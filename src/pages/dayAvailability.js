import { getCourses, getRegions } from "../pages/api";
import { populateSelectOptionsForRegionFilter } from "../pages/selectBoxes";

export async function dayAvailability() {
  const app = document.getElementById("app");

  app.innerHTML = `
  <div class="card card-border bg-base-500 border border-base-300 w-full">
    <div class="card-body w-full">
      <h2 class="card-title">Search for Day Availability</h2>
      <div class="grid grid-cols-3 gap-4 items-center w-full">
        <div class="w-full">Regions:</div>
        <div class="w-full"><select id="regionFilter" class="select w-full appearance-none bg-gray-50 text-gray-900" aria-label="select"><option value=''>Select....</option></select></div>
        <div class="w-full"><a id="filterRegions" class="btn btn-primary">Filter</a></div>
        <div class="w-full">Courses:</div>
        <div class="w-full"><select id="clubsSelect" multiple class="select w-full appearance-none bg-gray-50 text-gray-900" aria-label="select"></select></div>
        <div class="w-full"><a id="searchForAvailability" class="btn btn-primary">Search For Availability</a></div>
      </div>
    </div>
  </div>
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

export function searchForAvailability() {
  alert("coming soon");
}
