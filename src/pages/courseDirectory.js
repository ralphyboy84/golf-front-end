import { getFullCourseList, getCourse } from "../pages/api";
import { getSelectValues } from "../pages/dayAvailability";
import { buildCard, buildCardRow, getErrorMessage } from "../pages/components";
import { capitalizeFirstChar } from "../../src/pages/selectBoxes";

export async function courseDirectory() {
  const courses = await getFullCourseList();

  const noCourseAlertMsg = getErrorMessage(
    "noCourseSelectedError",
    "You have not selected a course",
  );

  document.getElementById("app").innerHTML = `
  <div class="flex justify-center mb-6">
    <div class="card sm:max-w-sm md:max-w-xl bg-gray-100 border border-base-300 rounded-xl text-gray-900 overflow-hidden">
      <figure><img src="images/dornoch2.jpg" alt="Watch" /></figure>
    </div>
  </div>
  <input type='hidden' id='days' value='1' />
  <div class="card card-border bg-base-500 border border-base-300 w-full">
    <div class="card-body w-full">
      <h2 id="courseDirectoryHeader" class="card-title">Course Directory</h2>
      <div class="grid grid-cols-2 gap-4 items-center w-full">
        <div class="w-full">Courses:</div>
        <div class="w-full"><select id='courseDirectoryListSelect' class="select max-w-sm appearance-none bg-gray-50 text-gray-900" aria-label="select"><option value=''>Select....</option></select></div>
      </div> 
      ${noCourseAlertMsg}
      <div class="w-full justify-center text-center"><a id="viewCourse" class="btn btn-primary">View Course</a></div>
    </div>
  </div>
  <div id='resultsDiv' class='pt-4'></div>
  <div id='carouselDiv' class='pt-4'></div>
`;

  const select = document.getElementById("courseDirectoryListSelect");

  Object.entries(courses).forEach(([key, club]) => {
    const option = document.createElement("option");

    option.value = key; // you can use key or club.courseId etc
    option.textContent = club.name; // what the user sees

    // Optional: store extra info as data attributes
    option.dataset.lat = club.location.lat;
    option.dataset.lon = club.location.lon;

    select.appendChild(option);
  });
}

export async function viewCourse() {
  const courseId = getSelectValues(
    document.getElementById("courseDirectoryListSelect"),
  );

  const courseInfo = await getCourse(courseId[0].course);
  const firstKey = Object.keys(courseInfo)[0];
  const club = courseInfo[firstKey];

  let content = "";

  content += `
  <p class="card-text">${nl2br(club.description)}</p>
  `;

  content += `
  <p class="card-text">
    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3167.487838230765!2d${club.location.lon}!3d${club.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2suk!4v1772042690652!5m2!1sen!2suk" style="width:100%;height:300px;border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </p>
  `;

  if (club.youtube) {
    content += `
    <p class="card-text">
      <iframe style="width:100%;height:300px;border:0;" src="${club.youtube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </p>
    `;
  }

  const top100 = formatTop100(club.top100);
  const courseType = formatCourseType(club.coursetype);
  const region = buildRegion(club.region);
  const category = buildCategory(club.category);
  const onlineBooking = buildOnlineBooking(club.onlineBooking);

  let imageToUse = "";

  if (club.image == "Yes") {
    imageToUse = firstKey;

    content += `
    <p class="card-text">
      <a id="viewCourseGallery" class="btn btn-primary" data-courseid=${firstKey}>View Gallery</a>
    </p>
    `;
  }

  const card = buildCard(
    imageToUse,
    club.name,
    content,
    firstKey + "_div",
    "",
    top100 + courseType + region + category + onlineBooking,
  );
  document.getElementById("resultsDiv").innerHTML = card;
  document.getElementById("carouselDiv").innerHTML = "";
}

function nl2br(str) {
  return str.replace(/(\r\n|\r|\n)/g, "<br>");
}

function formatCourseType(type) {
  let cType = "Inland";

  if (type == "links") {
    cType = "Links";
  }

  return `<span class='badge badge-success'>${cType}</span>`;
}

function formatTop100(top100) {
  if (top100 == 1) {
    return "<span class='badge badge-success'>Top 100</span>";
  }

  return "";
}

function buildRegion(region) {
  return `<span class='badge badge-success'>${capitalizeFirstChar(region)}</span>`;
}

function buildCategory(category) {
  return `<span class='badge badge-success'>Category ${capitalizeFirstChar(category.toUpperCase())}</span>`;
}

function buildOnlineBooking(onlineBooking) {
  if (onlineBooking == "Yes") {
    return "<span class='badge badge-success'>Online Booking</span>";
  }

  return "";
}
