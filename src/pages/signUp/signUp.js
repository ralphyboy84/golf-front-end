import { buildCard, getErrorMessage } from "../../pages/components";
import { createUser } from "../../pages/api";

export function signUp() {
  const app = document.getElementById("app");

  const noUserNameMsg = getErrorMessage(
    "noUserName",
    "You have not entered a username",
  );

  const noPasswordMsg = getErrorMessage(
    "noPassword",
    "You have not entered a password",
  );

  const noPasswordConfirmMsg = getErrorMessage(
    "noPasswordConfirm",
    "You have not confirmed your password",
  );

  const passwordsDoNotMatch = getErrorMessage(
    "passwordsDoNotMatch",
    "Your passwords do not match",
  );

  const userExists = getErrorMessage("userExists", "This user already exists");

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
  <div class="grid grid-cols-2 gap-4 items-center w-full mb-4">
    <div class="w-full">Confirm Password:</div>
    <div class="w-full"><input type='password' id='passwordConfirmed' value='' class='input bg-gray-50 text-gray-900' /></div>
  </div>
  ${noPasswordConfirmMsg}  
  ${passwordsDoNotMatch} 
  ${userExists}
  <div class="card-actions justify-center">
    <a id="signUpButton" class="btn btn-primary">Sign Me Up</a>
  </div>
  `;

  app.innerHTML = buildCard("fortrose", "Sign Up", content, "signUp");
}

export async function signTheUserUp() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("passwordConfirmed").value;

  if (!username) {
    document.getElementById("noUserName").classList.remove("hidden");
    return;
  }

  if (!password) {
    document.getElementById("noPassword").classList.remove("hidden");
    return;
  }

  if (!confirmPassword) {
    document.getElementById("noPasswordConfirm").classList.remove("hidden");
    return;
  }

  if (password != confirmPassword) {
    document.getElementById("passwordsDoNotMatch").classList.remove("hidden");
    return;
  }

  const result = await createUser(username, password);

  if (result.success) {
    const app = document.getElementById("app");

    const content = `
    <div class="grid grid-cols-1 gap-4 items-center w-full mb-4">
      <div class="w-full">Congrats, you have signed up and are logged in!</div>
    </div>
    `;

    app.innerHTML = buildCard(
      "carnoustiebuddon",
      "Logged In",
      content,
      "loggedIn",
    );

    document.getElementById("logOutLi").classList.remove("hidden");
    document.getElementById("yourInfoLi").classList.remove("hidden");
    document.getElementById("logInLi").classList.add("hidden");
    document.getElementById("signUpLi").classList.add("hidden");
  } else {
    document.getElementById("userExists").classList.remove("hidden");
  }
}
