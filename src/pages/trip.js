import { getFullCourseList } from "../pages/api";
import { buildCard, getErrorMessage } from "../pages/components";

export async function commonHeaderInfo() {
  const header = document.getElementById("pageHeader");
  //  const liTag = document.getElementById("golfInScotland");
  // const firstUl = liTag.querySelector("ul");
  // const anchor = document.querySelector('a[href="/trip"]');

  //  liTag.classList.add("menu-open");
  //header.innerHTML = "Trip Planner";
  //  firstUl.style.display = "block";
  //  anchor.classList.add("active");
}

export async function tripPage() {
  await commonHeaderInfo();
  const app = document.getElementById("app");

  const content = `
  <p class="mb-4">Before I start building your trip, I have a few questions to ask to get a feel for what you like and don't like.</p>
  <div class="card-actions justify-center">
    <a href='/tripDate' data-navigo class="btn btn-primary" id="startTripBuilder">Ok. Lets Go!</a>
  </div>
  `;
  app.innerHTML = buildCard(
    "carnoustie",
    "Welcome to your ultimate Scottish Golf Trip Planner!",
    content,
    "gettingStarted",
  );
}

export async function setDate() {
  await commonHeaderInfo();
  const app = document.getElementById("app");
  const alertMsg = getErrorMessage(
    "nextStepBtnAlert",
    "You have not entered a date",
  );

  const content = `
  ${getSteps(0)}
  <p class="mb-4 text-center">Can you start by telling me when you would like the trip to start?</p>
  <div class="p-3 col-4 d-flex justify-content-center text-center">
    <input type="date" class="input max-w-sm bg-gray-50 text-gray-900" placeholder="YYYY-MM-DD" id="startDate" value="" />
  </div>
  ${alertMsg}
  <div class="card-actions justify-center">
     <a href='/tripLength' data-navigo class="btn btn-primary" id="nextStepBtn">To The Next Step!</a>
  </div>
  `;
  app.innerHTML = buildCard("crudenbay", "Lets Get Some Dates Sorted", content);
}

export async function tripLength() {
  await commonHeaderInfo();
  const app = document.getElementById("app");

  const content = `
  ${getSteps(1)}
  <p class="mb-4 text-center">And how many days do you want the trip to last?</p>
    <div class="flex justify-center m-6">
      <div class="w-full max-w-xs">
        <input id="tripLengthInDays" type="range" min="1" max="7" value="1" class="range range-primary" step="1" />
        <div class="flex justify-between px-2.5 mt-2 text-xs">
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div class="flex justify-between px-2.5 mt-2 text-xs">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
        </div>
      </div>
    </div>
  <div class="card-actions justify-center">
     <a href='/whereStaying' data-navigo class="btn btn-primary" id="tripLengthButton">To The Next Step!</a>
  </div>
  `;
  app.innerHTML = buildCard("banchory", "Trip Length", content);
}

export async function whereStaying() {
  await commonHeaderInfo();
  const app = document.getElementById("app");
  const alertMsg = getErrorMessage(
    "whereStayingAlert",
    "You have not selected where you are planning to stay",
  );

  try {
    const data = await getFullCourseList();

    const content = `
    ${getSteps(2)}
    <p class="mb-4 text-center">What course will you be staying closest to?</p>
    <div class="p-3 col-4 d-flex justify-content-center text-center">
      <select id='whereStayingSelect' class="select max-w-sm appearance-none bg-gray-50 text-gray-900" aria-label="select"><option value=''>Select....</option></select> 
    </div>
    ${alertMsg}
    <div class="card-actions justify-center">
      <a href='/linksOrNoLinks' data-navigo class="btn btn-primary" id="linksNoLinks">Onto The Next Question</a>
    </div>
    `;
    app.innerHTML = buildCard("panmure", "Where You Staying?", content);

    const select = document.getElementById("whereStayingSelect");

    Object.entries(data).forEach(([key, club]) => {
      const option = document.createElement("option");

      option.value = key; // you can use key or club.courseId etc
      option.textContent = club.name; // what the user sees

      // Optional: store extra info as data attributes
      option.dataset.lat = club.location.lat;
      option.dataset.lon = club.location.lon;

      select.appendChild(option);
    });
  } catch (err) {
    app.innerHTML = "<p>Error loading data.</p>";
  }
}

export async function linksOrNoLinks() {
  await commonHeaderInfo();
  const app = document.getElementById("app");

  const alertMsg = getErrorMessage(
    "linksNoLinksAlert",
    "You have not selected what type of courses you would like to play",
  );

  const content = `
  ${getSteps(3)}
    <p class="mb-4 text-center">Now I would like to know what type of courses you are interested in playing. A true Scottish links like a Royal Troon or Royal Dornoch? Or are you more interested in inland courses like a Gleneagles or Blairgowrie?</p>
    <div class="p-3 col-4 d-flex justify-content-center text-center">
      <select id='courseTypeSelect' class="select max-w-sm appearance-none bg-gray-50 text-gray-900" aria-label="select">
      <option value=''>Select....</option>
        <option value="links">Links Courses</option>
        <option value="nonlinks">Non Links Courses</option>
        <option value="na">Not Fussed</option>
      </select> 
    </div>
    ${alertMsg}
    <div class="card-actions justify-center">
      <a href='/courseCategory' data-navigo class="btn btn-primary" id="courseCategoryButton">Not Much Longer Now</a>
    </div>
    `;
  app.innerHTML = buildCard("nairn", "Links Or No Links?", content);
}

export async function courseCategory() {
  await commonHeaderInfo();
  const app = document.getElementById("app");

  const alertMsg = getErrorMessage(
    "courseCategoryAlert",
    "You have not selected what category of courses you would like to play",
  );

  const content = `
  ${getSteps(4)}
    <p class="mb-4 text-center">OK second last question. I'd love to know the "Category" of course you would like to play. Is it just the A rated courses? The Open Championship venues like Carnoustie and Turnberry? Or what about the B categories like a Nairn? They might not host Open Championships but they are still top, top courses. Don't forget about C category courses as well. These are courses that are generally ranked between 50 and 100 in the course rankings. They offer great savings on some of the A&B category courses. You also have the D category courses. These are the hidden gems, the courses off the beaten track that don't tend to be visited much by tourists. Great value for money and very friendly members!</p>
    <div class="p-3 col-4 d-flex justify-content-center text-center">
      <select id='courseCategorySelect' class="select max-w-sm appearance-none bg-gray-50 text-gray-900" aria-label="select" multiple="multiple">
        <option value="a">A - the best of the best</option>
        <option value="b">B - not the Open Championship courses but still good</option>
        <option value="c">C - the 50-100 ranked courses</option>
        <option value="d">D - the hidden gems and authentic Scottish experiences</option>
      </select> 
    </div>
    ${alertMsg}
    <div class="card-actions justify-center">
      <a href='/lastQuestion' data-navigo class="btn btn-primary" id="lastQuestionButton">Onto The Last Question</a>
    </div>
    `;
  app.innerHTML = buildCard("scotscraiggolfclub", "Course Category", content);
}

export async function lastQuestion() {
  await commonHeaderInfo();
  const app = document.getElementById("app");

  const content = `
  ${getSteps(5)}
    <p class="mb-4 text-center">And finally - how many miles are you prepared to travel?</p>
    <div class="flex justify-center m-6">
      <div class="w-full max-w-xs">
        <input id="milageRange" type="range" min="0" max="100000" value="0" class="range range-primary" step="20000" />
        <div class="flex justify-between px-2.5 mt-2 text-xs">
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div class="flex justify-between px-2.5 mt-2 text-xs">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100</span>
        </div>
      </div>
    </div>
    <div class="card-actions justify-center">
      <a href='/tripBuilder' data-navigo class="btn btn-primary" id="buildMyTripButton">Ok - Build My Trip!</a>
    </div>
    `;
  app.innerHTML = buildCard("northberwick", "How Far To Travel?", content);
}

function getSteps(defaultValue) {
  const elements = [
    "Dates",
    "Length",
    "Staying",
    "Types",
    "Categories",
    "Distance",
  ];

  let html = "";
  let count = 0;
  let active = "";

  for (let x in elements) {
    active = "";

    if (count <= defaultValue) {
      active = "step-primary";
    }

    html += `<li class="step ${active}">${elements[x]}</li>`;
    count++;
  }

  return `<ul class="steps hidden sm:flex justify-center pb-8">${html}</ul>`;
}
