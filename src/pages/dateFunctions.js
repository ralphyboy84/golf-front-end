export function formatDateToDMY(dateStr) {
  // Ensure the input is a string in YYYY-MM-DD format
  const [year, month, day] = dateStr.split("-");

  // Return in dd/mm/yyyy format
  return `${day}/${month}/${year}`;
}

export function formatDateToYMD(dateStr) {
  // Ensure the input is a string in YYYY-MM-DD format
  const [day, month, year] = dateStr.split("/");

  // Return in dd/mm/yyyy format
  return `${year}-${month}-${day}`;
}

export function checkForPastDate(dateStr) {
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (targetDate < now) {
    return true;
  }
}
