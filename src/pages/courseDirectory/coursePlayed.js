import { markCourseAsPlayedAPI } from "../../pages/api";

export async function markCourseAsPlayed(courseid) {
  const result = await markCourseAsPlayedAPI(courseid);

  if (result.success) {
    document.getElementById(`playedCourse_${courseid}`).src =
      "/images/golf-field-color.png";
  } else if (result.error == "already added") {
    alert("You have already played this course");
  }
}
