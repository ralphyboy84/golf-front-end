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
