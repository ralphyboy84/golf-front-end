import { getLoggedInUserInfo } from "../../pages/api";

export async function getYourInfo() {
  const info = await getLoggedInUserInfo();

  const app = document.getElementById("app");
  app.innerHTML = info;
}
