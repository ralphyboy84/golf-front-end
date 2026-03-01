export async function setCookies() {
  const app = document.getElementById("app");
  const alertMsg = getErrorMessage("nextStepBtnAlert", "You have not se");

  const content = `
  ${getSteps(0)}
  <p class="mb-4 text-center">Are you ok if we use cookies to keep track of any searches you make? We use that information to help you see your previous searches. If not, that is totally ok!</p>
  <div class="p-3 col-4 d-flex justify-content-center text-center">
    <select id='cookiesSelect' class="select max-w-sm appearance-none bg-gray-50 text-gray-900" aria-label="select">
      <option value=''>Select....</option>
        <option value="links">Links Courses</option>
        <option value="nonlinks">Non Links Courses</option>
        <option value="na">Not Fussed</option>
      </select> 
  </div>
  ${alertMsg}
  <div class="card-actions justify-center">
     <a href='/tripLength' data-navigo class="btn btn-primary" id="nextStepBtn">To The Next Step!</a>
  </div>
  `;
  app.innerHTML = buildCard("crudenbay", "Cookies!", content);
}
