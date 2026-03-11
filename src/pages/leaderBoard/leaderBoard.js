import { buildCard } from "../../pages/components";
import { getLeaderBoardAPI, getUserCoursesComparison } from "../../pages/api";

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", function (event) {
    if (event.target.closest(".leaderBoardModal")) {
      const row = event.target.closest(".leaderBoardModal");
      const userid = row.getAttribute("data-userid");
      document.getElementById("my_modal_1").showModal();

      loadLeaderBoardModalContent(userid);
    }
  });
});

export async function getLeaderBoard() {
  const result = await getLeaderBoardAPI();

  let content = "";
  let rank = 1;

  if (result.length > 0) {
    for (let x in result) {
      let percentage = (result[x].Total / result[x].totalCourses) * 100;
      percentage = percentage.toFixed(2);

      let bgColor = "";

      if (result[x].you) {
        bgColor = "bg-blue-300";
      }

      content += `
      <div class="flex gap-4 leaderBoardModal cursor-pointer ${bgColor}" data-userid='${result[x].userid}'>
        <div class="flex-1 p-4">${rank}</div>
        <div class="flex-1 p-4">${result[x].userid}</div>
        <div class="flex-1 p-4">${result[x].Total} out of ${result[x].totalCourses}</div>
        <div class="flex-1 p-4">${percentage}%</div>
      </div>
      `;

      rank++;
    }
  } else {
    content = "There is no leaderboard available currently";
  }

  content += `
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 id="modalHeader" class="text-lg font-bold mb-2"></h3>
      <div id="modalContent">
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
  `;

  const app = document.getElementById("app");

  app.innerHTML = buildCard(
    "trumpnew",
    "Leaderboard",
    content,
    "leaderBoardDiv",
  );
}

async function loadLeaderBoardModalContent(userid) {
  const userCourses = await getUserCoursesComparison(userid);

  let content = `${userid} has played the following courses`;

  if (userCourses.length > 0) {
    for (let x in userCourses) {
      let image = "/images/golf-field-bw.png";
      let msg = "You have not played this course";

      if (userCourses[x].played == 1) {
        image = `/images/golf-field-color.png`;
        msg = "You have played this course too!";
      }

      let imageString = `<img src='${image}' alt='${msg}' title='${msg}' />`;

      content += `
      <div class="flex gap-4">
        <div class="flex-1 p-4">${userCourses[x].courseid}</div>
        <div class="flex-1 p-4">${imageString}</div>
      </div>
      `;
    }
  }

  document.getElementById("modalContent").innerHTML = content;
}
