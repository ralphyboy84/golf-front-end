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

export function getCourseAvailabilityForDate(club, date, courseId) {
  return fetch(
    `${import.meta.env.VITE_API_URL}api/getCourseAvailabilityForDate.php?club=${club}&date=${date}&courseId=${courseId}`,
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
  ).then((res) => res.json());
}
