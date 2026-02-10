import { buildCard } from "../pages/components";

export function buildFullTripSummary() {
  const app = document.getElementById("app");
  const previousResults = JSON.parse(
    document.getElementById("tripResults").value,
  );

  let timeline = "";
  let hrEnd = "";
  let hrStart = "";
  let count = 0;

  for (let x in previousResults) {
    hrEnd = "";

    if (count < previousResults.length - 1) {
      hrEnd = "<hr />";
    }

    if (count > 0) {
      hrStart = "<hr />";
    }

    timeline += `
    <li>
      ${hrStart}
      <div class="timeline-start">Day ${count + 1} -  ${previousResults[x].date}</div>
      <div class="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="h-5 w-5"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="timeline-end timeline-box grid grid-cols-[2fr_1fr_2fr_auto] items-center gap-4 text-base w-full">
        <div>${previousResults[x].course}</div> 
        <div>£${previousResults[x].price}</div>
        <div>From: ${previousResults[x].firstTime}</div>
        <div class="text-right">
          <a class="btn btn-primary">Book</a>
        </div>
      </div>
      ${hrEnd}
    </li>
    `;

    count++;
  }

  app.innerHTML = buildCard(
    "ardfin",
    "Full Trip Summary",
    `<ul class="timeline timeline-vertical timeline-compact">${timeline}</ul>`,
    "fullTripSummaryCard",
  );
}
