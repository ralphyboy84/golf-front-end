export async function getFullCourseList() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}api/getCourses.php`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export async function getListOfPotentialCourses(
  lat,
  lon,
  courseTypeOption,
  courseQualityOption,
  travelDistanceOption,
) {
  return await fetch(
    `${import.meta.env.VITE_API_URL}api/getCourses.php?lat=${lat}&lon=${lon}&courseTypeOption=${courseTypeOption}&courseQualityOption=${courseQualityOption}&travelDistanceOption=${travelDistanceOption}&onlineBooking=Yes`,
  ).then((res) => res.json());
}

export function getCourseAvailabilityForDate(club, date, courseId, opens) {
  return fetch(
    `${import.meta.env.VITE_API_URL}api/getCourseAvailabilityForDate.php?club=${club}&date=${date}&courseId=${courseId}&opens=${opens}`,
  ).then((res) => res.json());
}

export const getAllOpensEndPoint = `${import.meta.env.VITE_API_URL}api/getAllOpens.php`;

export async function getRegions() {
  return await fetch(`${import.meta.env.VITE_API_URL}api/getRegions.php`).then(
    (res) => res.json(),
  );
}

export async function getCourses(region) {
  return await fetch(
    `${import.meta.env.VITE_API_URL}api/getCourses.php?region=${region}`,
  ).then((res) => res.json());
}

export async function getMapDistance(whereStaying, courseList) {
  return await fetch(
    `${import.meta.env.VITE_API_URL}api/map/getDistance.php?from=${whereStaying}&to=${courseList}`,
  ).then((res) => res.json());
}

export async function getWeather(courseList) {
  return await fetch(
    `${import.meta.env.VITE_API_URL}api/weather/getWeather.php?to=${courseList}&date=${document.getElementById("start").value}`,
  ).then((res) => res.json());
}

export async function getCourse(courseId) {
  return await fetch(
    `${import.meta.env.VITE_API_URL}api/getCourses.php?courseId=${courseId}`,
    {
      credentials: "include",
    },
  ).then((res) => res.json());
}

export async function getOpensForCourse(clubid) {
  return await fetch(
    `${import.meta.env.VITE_API_URL}api/getOpensForCourse.php?clubid=${clubid}`,
  ).then((res) => res.json());
}

export async function createUser(username, password) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return await fetch(`${import.meta.env.VITE_API_URL}api/createUser.php`, {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());
}

export async function logInUser(username, password) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  return await fetch(`${import.meta.env.VITE_API_URL}api/logInUser.php`, {
    method: "POST",
    body: formData,
    credentials: "include",
  }).then((res) => res.json());
}

export async function getLoggedInUserInfo() {
  return await fetch(`${import.meta.env.VITE_API_URL}api/getLoggedInUser.php`, {
    credentials: "include",
  }).then((res) => res.json());
}

export async function markCourseAsPlayedAPI(courseid) {
  const formData = new FormData();
  formData.append("courseid", courseid);

  return await fetch(
    `${import.meta.env.VITE_API_URL}api/markCourseAsPlayed.php`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  ).then((res) => res.json());
}

export async function markCourseAsNotPlayedAPI(courseid) {
  const formData = new FormData();
  formData.append("courseid", courseid);

  return await fetch(
    `${import.meta.env.VITE_API_URL}api/markCourseAsNotPlayed.php`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  ).then((res) => res.json());
}

export async function getLeaderBoardAPI() {
  return await fetch(`${import.meta.env.VITE_API_URL}api/getLeaderBoard.php`, {
    credentials: "include",
  }).then((res) => res.json());
}

export async function logOutUserAPI() {
  return await fetch(`${import.meta.env.VITE_API_URL}api/logOutUser.php`, {
    credentials: "include",
  }).then((res) => res.json());
}

export async function getUserCoursesComparison(username) {
  return await fetch(
    `${import.meta.env.VITE_API_URL}api/getUserCoursesComparison.php?username=${username}`,
    {
      credentials: "include",
    },
  ).then((res) => res.json());
}
