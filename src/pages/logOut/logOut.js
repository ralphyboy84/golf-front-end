import { buildCard, getErrorMessage } from "../../pages/components";
import { logOutUserAPI } from "../../pages/api";

export function logOut() {
  const app = document.getElementById("app");

  const content = `
  <div class="grid grid-cols-1 gap-4 items-center w-full mb-4">
    <div class="w-full">Are you sure you want to sign out? Click the button below if you are.</div>
  </div>
  <div class="card-actions justify-center">
    <a id="logOutButton" class="btn btn-primary">Sign Me Out</a>
  </div>
  `;

  app.innerHTML = buildCard("stonehaven", "Log Out", content, "logOut");
}

export async function logTheUserOut() {
  await logOutUserAPI();

  const app = document.getElementById("app");

  const content = `
  <div class="grid grid-cols-1 gap-4 items-center w-full mb-4">
    <div class="w-full">You have now been logged out.</div>
  </div>
  `;

  app.innerHTML = buildCard("royalaberdeen", "Log Out", content, "logOut");

  getLogOutButtons();
}

export function getLogOutButtons() {
  document.getElementById("logOutLi").classList.add("hidden");
  document.getElementById("yourInfoLi").classList.add("hidden");
  document.getElementById("logInLi").classList.remove("hidden");
  document.getElementById("signUpLi").classList.remove("hidden");
}
