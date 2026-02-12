export function populateSelectOptionsForRegionFilter(data) {
  const select = document.getElementById("regionFilter");

  for (let key in data) {
    const option = document.createElement("option");

    option.value = data[key]; // key as value
    option.textContent = capitalizeFirstChar(data[key]); // display name
    select.appendChild(option);
  }
}

export function capitalizeFirstChar(str) {
  if (!str) return ""; // handle empty string

  if (str == "eastlothian") {
    str = "East Lothian";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}
