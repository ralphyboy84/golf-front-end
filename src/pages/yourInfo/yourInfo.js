import { getLoggedInUserInfo } from "../../pages/api";
import { buildCard } from "../../pages/components";

export async function getYourInfo() {
  const info = await getLoggedInUserInfo();

  const app = document.getElementById("app");

  const content = `
    <div class="grid grid-cols-1 gap-4 items-center w-full mb-4">
      <div class="w-full">Username: ${info.username}</div>
    </div>
    `;

  app.innerHTML = buildCard(
    "crailbalcomie",
    "Your Info",
    content,
    "yourInfoDiv",
  );
}
