import { getFullCourseList, getCourse } from "../pages/api";
import { getSelectValues } from "../pages/dayAvailability";
import {
  buildCard,
  getErrorMessage,
  getSuccessMessage,
} from "../pages/components";
import { capitalizeFirstChar } from "../../src/pages/selectBoxes";

export async function courseDirectory() {
  const courses = await getFullCourseList();

  const noCourseAlertMsg = getErrorMessage(
    "noCourseSelectedError",
    "You have not selected a course",
  );

  const content = `
  <input type='hidden' id='days' value='1' />
  <p class="mb-4">Use our course directory to view any golf course in Scotland.</p>
  <div class="grid grid-cols-2 gap-4 items-center w-full mb-4">
    <div class="w-full">Courses:</div>
    <div class="w-full"><select id='courseDirectoryListSelect' class="select max-w-sm appearance-none bg-gray-50 text-gray-900" aria-label="select"><option value=''>Select....</option></select></div>
  </div> 
  ${noCourseAlertMsg}
  <div class="card-actions justify-center">
    <a id="viewCourse" class="btn btn-primary">View Course</a>
  </div>
  `;

  document.getElementById("app").innerHTML =
    buildCard(
      "dornoch2",
      "Course Directory",
      content,
      "courseDirectoryHeader",
    ) + `  <div id='resultsDiv' class='pt-4'></div>`;

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

  const coursePlayedAlert = getSuccessMessage(
    "coursePlayedAlert",
    "You have played this course",
  );

  const courseNotPlayedAlert = getSuccessMessage(
    "courseNotPlayedAlert",
    "You have not played this course",
  );

  let content = "";

  content += `
  ${coursePlayedAlert}
  ${courseNotPlayedAlert}
  <h5 class="card-title mb-2.5 text-gray-900">Summary</h5>
  <p class="card-text">${nl2br(club.description)}</p>
  `;

  content += `
  <h5 class="card-title mb-2.5 text-gray-900">Map</h5>
  <p class="card-text mb-2">
    <iframe id='map' src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3167.487838230765!2d${club.location.lon}!3d${club.location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2suk!4v1772042690652!5m2!1sen!2suk" style="width:100%;height:300px;border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </p>
  `;

  if (club.youtube) {
    content += `
    <h5 class="card-title mb-2.5 text-gray-900">YouTube</h5>
    <p class="card-text">
      <iframe style="width:100%;height:300px;border:0;" src="${club.youtube}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </p>
    `;
  }

  if (club.facebook) {
    content += `
    <h5 class="card-title mb-2.5 text-gray-900">Facebook</h5>
    `;

    content += `
    <div class="w-full max-w-md mx-auto">
      <div id="facebookEmbed"
        class="fb-page"
        data-href="https://www.facebook.com/${club.facebook}"
        data-tabs="timeline"
        data-width="500"
        data-adapt-container-width="true">
      </div>
    </div>
    `;
  }

  const top100 = formatTop100(club.top100);
  const courseType = formatCourseType(club.coursetype);
  const region = buildRegion(club.region);
  const category = buildCategory(club.category);
  const onlineBooking = buildOnlineBooking(club);

  let website = "";

  if (club.website) {
    website = `
    <a href="${club.website}" target="_blank" class='badge badge-success'><i class="bi bi-globe"></i>Website</a>
    `;
  }

  let instagram = "";

  if (club.instagram) {
    instagram = `
    <a href="https://www.instagram.com/${club.instagram}" target="_blank" class='badge badge-success'><i class="fa-brands fa-instagram"></i>Instagram</a>
    `;
  }

  let ralph_recommends = "";

  if (club.ralph_recommends == 1) {
    ralph_recommends = `
    <span id="ralphRecommends" class='badge badge-primary cursor-pointer cdModal' data-toShow=ralphRecommends data-courseid=${firstKey}><i class="fa-solid fa-star"></i>Ralph Recomends</span>
    `;
  }

  let imageToUse = "";
  let gallery = "";

  if (club.image == "Yes") {
    imageToUse = firstKey;

    gallery = `
    <span id="viewCourseGallery" class='badge badge-success cursor-pointer cdModal' data-toShow=gallery data-courseid=${firstKey}><i class="fa-solid fa-image"></i>Gallery</span>
    `;
  }

  let opens = "";

  if (club.opens == 1) {
    opens = `
    <span id="viewOpens" class='badge badge-success cursor-pointer cdModal' data-toShow=opens data-courseid=${firstKey} class='badge badge-success'><i class="fa-solid fa-rainbow"></i>Opens</span>
    `;
  } else if (club.opens == 0 && club.openBookingLink) {
    opens = `
    <a href="${club.openBookingLink}" target="_blank" class='badge badge-success'><i class="fa-solid fa-rainbow"></i>Opens</a>
    `;
  }

  let played = "";

  if (club.loggedIn == 1) {
    let coursePlayedClass = "hidden";
    let courseNotPlayedClass = "hidden";

    if (club.played == 1) {
      coursePlayedClass = "";
    } else {
      courseNotPlayedClass = "";
    }

    played = `
    <img src='/images/golf-field-bw.png' style='height:24px;width:24px' title='You have not played this course' class='cursor-pointer playedCourse ${courseNotPlayedClass}' id='playedCourse_${firstKey}' data-courseid=${firstKey} />
    <img src='/images/golf-field-color.png' style='height:24px;width:24px' title='You have played this course!' class='cursor-pointer notPlayedCourse ${coursePlayedClass}' id='notPlayedCourse_${firstKey}' data-courseid=${firstKey} />
    `;
  }

  let card = buildCard(
    imageToUse,
    club.name,
    content,
    firstKey + "_div",
    "",
    ralph_recommends +
      top100 +
      courseType +
      region +
      category +
      onlineBooking +
      website +
      instagram +
      gallery +
      opens,
    played,
  );

  card += `
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 id="modalHeader" class="text-lg font-bold mb-2"></h3>
      <div id="modalContent">
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  `;

  document.getElementById("resultsDiv").innerHTML = card;

  if (window.FB) {
    if (document.getElementById("facebookEmbed")) {
      window.FB.XFBML.parse();
    }
  }
}

function nl2br(str) {
  return str.replace(/(\r\n|\r|\n)/g, "<br>");
}

function formatCourseType(type) {
  let cType = "Inland";

  if (type == "links") {
    cType = "Links";
  }

  return `<span class='badge badge-success cursor-pointer cdModal' data-toShow=courseType data-courseType=${cType}><i class="fa-solid fa-golf-ball-tee"></i>${cType} Course</span>`;
}

function formatTop100(top100) {
  if (top100 == 1) {
    return `<span class='badge badge-success cursor-pointer cdModal' data-toShow=top100><i class="bi bi-123"></i>Top 100</span>`;
  }

  return "";
}

function buildRegion(region) {
  return `<span class='badge badge-success cursor-pointer cdModal' data-toShow=region data-region=${region}><i class="bi bi-input-cursor"></i>${capitalizeFirstChar(region)}</span>`;
}

function buildCategory(category) {
  return `<span class='badge badge-success cursor-pointer cdModal' data-toShow=category data-category=${category}><i class="bi bi-textarea-resize"></i>Category ${capitalizeFirstChar(category.toUpperCase())}</span>`;
}

function buildOnlineBooking(club) {
  if (club.onlineBooking == "Yes") {
    let bookingLink = club.bookingLink;

    if (bookingLink.includes("SearchSlots.aspx")) {
      bookingLink = bookingLink.replace(
        "SearchSlots.aspx",
        "SearchClubDay.aspx",
      );
    }

    return `<a href="${bookingLink}" target="_blank" class='badge badge-success'><i class="bi bi-currency-pound"></i>Online Booking</a>`;
  }

  return "";
}
