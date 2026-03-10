import { buildCard, getErrorMessage } from "../../pages/components";
import { logInUser } from "../../pages/api";

export function logIn() {
  const app = document.getElementById("app");

  const noUserNameMsg = getErrorMessage(
    "noUserName",
    "You have not entered a username",
  );

  const noPasswordMsg = getErrorMessage(
    "noPassword",
    "You have not entered a password",
  );

  const passwordsDoNotMatch = getErrorMessage(
    "passwordsDoNotMatch",
    "Wrong password entered",
  );

  const content = `
  <div class="grid grid-cols-2 gap-4 items-center w-full">
    <div class="w-full">Enter Username:</div>
    <div class="w-full"><input type='text' id='username' value='' class='input bg-gray-50 text-gray-900' /></div>
  </div>
  ${noUserNameMsg}
  <div class="grid grid-cols-2 gap-4 items-center w-full">
    <div class="w-full">Enter Password:</div>
    <div class="w-full"><input type='password' id='password' value='' class='input bg-gray-50 text-gray-900' /></div>
  </div>
  ${noPasswordMsg}
  ${passwordsDoNotMatch} 
  <div class="card-actions justify-center">
    <a id="logInButton" class="btn btn-primary">Log Me In</a>
  </div>
  `;

  app.innerHTML = buildCard("grantownonspey", "Log In", content, "logIn");
}

export async function logInTheUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username) {
    document.getElementById("noUserName").classList.remove("hidden");
    return;
  }

  if (!password) {
    document.getElementById("noPassword").classList.remove("hidden");
    return;
  }

  const result = await logInUser(username, password);

  if (result.success) {
    const app = document.getElementById("app");

    const content = `
    <div class="grid grid-cols-1 gap-4 items-center w-full mb-4">
      <div class="w-full">Congrats, you are logged in!</div>
    </div>
    `;

    app.innerHTML = buildCard(
      "royalaberdeen",
      "Logged In",
      content,
      "loggedIn",
    );

    document.getElementById("logOutLi").classList.remove("hidden");
    document.getElementById("yourInfoLi").classList.remove("hidden");
    document.getElementById("logInLi").classList.add("hidden");
    document.getElementById("signUpLi").classList.add("hidden");
  } else {
    document.getElementById("passwordsDoNotMatch").classList.remove("hidden");
  }
}
