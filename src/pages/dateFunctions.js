export function formatDateToDMY(dateStr) {
  // Ensure the input is a string in YYYY-MM-DD format
  const [year, month, day] = dateStr.split("-");

  // Return in dd/mm/yyyy format
  return `${day}/${month}/${year}`;
}
