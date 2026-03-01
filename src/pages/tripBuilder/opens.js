import { buildCard, getErrorMessage } from "../../pages/components";
import { getSteps } from "../../pages/trip";

export async function setOpenCompetitions() {
  const app = document.getElementById("app");
  const alertMsg = getErrorMessage(
    "openBtnAlert",
    "You have not set whether you are interested in playing in Opens or not",
  );

  const content = `
  ${getSteps(1)}
  <p class="mb-4 text-center">Playing Opens are a great way of playing courses for discounted rates. Please let us know if this is something that interests you or not.</p>
  <div class="p-3 col-4 d-flex justify-content-center text-center">
    <select id='opensSelect' class="select max-w-sm appearance-none bg-gray-50 text-gray-900" aria-label="select">
      <option value=''>Select....</option>
        <option value="opens" selected>I only want to play Opens</option>
        <option value="noopens">I hate the idea of playing Opens</option>
        <option value="both">I do not care</option>
      </select> 
  </div>
  ${alertMsg}
  <div class="card-actions justify-center">
     <a data-navigo class="btn btn-primary" id="ontoTripLength">To The Next Step!</a>
  </div>
  `;
  app.innerHTML = buildCard("shiskine", "Open Competitions", content);
}
