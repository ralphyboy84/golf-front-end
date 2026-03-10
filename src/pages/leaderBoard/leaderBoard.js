import { buildCard } from "../../pages/components";
import { getLeaderBoardAPI } from "../../pages/api";

export async function getLeaderBoard() {
  const result = await getLeaderBoardAPI();

  let content = "";
  let rank = 1;

  if (result.length > 0) {
    for (let x in result) {
      let percentage = (result[x].Total / result[x].totalCourses) * 100;
      percentage = percentage.toFixed(2);

      content += `
      <div class="flex gap-4">
        <div class="flex-1 p-4">${rank}</div>
        <div class="flex-1 p-4">${result[x].userid}</div>
        <div class="flex-1 p-4">${result[x].Total} out of ${result[x].totalCourses}</div>
        <div class="flex-1 p-4">${percentage}%</div>
      </div>
      `;

      rank++;
    }
  }

  const app = document.getElementById("app");

  app.innerHTML = buildCard("trumpnew", "Leaderboard", content, "leaderBoard");
}
