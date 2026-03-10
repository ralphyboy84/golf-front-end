import {
  markCourseAsPlayedAPI,
  markCourseAsNotPlayedAPI,
} from "../../pages/api";

export async function markCourseAsPlayed(courseid) {
  const result = await markCourseAsPlayedAPI(courseid);

  if (result.success) {
    document.getElementById(`playedCourse_${courseid}`).classList.add("hidden");
    document
      .getElementById(`notPlayedCourse_${courseid}`)
      .classList.remove("hidden");

    document.getElementById("coursePlayedAlert").classList.remove("hidden");
    document.getElementById("courseNotPlayedAlert").classList.add("hidden");
  } else if (result.error == "already added") {
    alert("You have already played this course");
  }
}

export async function markCourseAsNotPlayed(courseid) {
  await markCourseAsNotPlayedAPI(courseid);

  document
    .getElementById(`playedCourse_${courseid}`)
    .classList.remove("hidden");
  document
    .getElementById(`notPlayedCourse_${courseid}`)
    .classList.add("hidden");

  document.getElementById("courseNotPlayedAlert").classList.remove("hidden");
  document.getElementById("coursePlayedAlert").classList.add("hidden");
}
