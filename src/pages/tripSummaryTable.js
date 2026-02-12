import { formatCell } from "../pages/formatCell";

export function buildTripSummaryTable(results) {
  let headerAdded;
  let thead;
  let row;
  let cell;
  let div = document.createElement("div");
  div.classList.add("overflow-x-auto");
  div.classList.add("rounded-box");
  div.classList.add("border");
  div.classList.add("border-base-content/5");
  div.classList.add("bg-base-100");
  // div.classList.add("w-full");
  div.classList.add("xs:max-w-xs");
  div.classList.add("md:max-w-2xl");
  div.classList.add("lg:max-w-4xl");

  let table = document.createElement("table");
  let tbody = document.createElement("tbody");
  table.classList.add("table");
  table.classList.add("min-w-max");

  for (let x in results) {
    if (!headerAdded) {
      headerAdded = true;

      // Create a row
      thead = document.createElement("thead");
      row = document.createElement("tr");

      cell = document.createElement("th");
      cell.textContent = "";
      row.appendChild(cell);

      cell = document.createElement("th");
      cell.textContent = "Course";
      row.appendChild(cell);

      // Create cells
      for (let y in results[x]) {
        cell = document.createElement("th");
        cell.textContent = results[x][y].date;
        row.appendChild(cell);
      }

      // Append row to table
      thead.appendChild(row);
      table.appendChild(thead);
    }

    // Create a row
    row = document.createElement("tr");
    row.id = x;

    cell = document.createElement("td");
    cell.innerHTML = `<input type="checkbox" class="checkbox" value="${x}" id="${x}_checkbox" />`;
    row.appendChild(cell);

    cell = document.createElement("th");

    cell.textContent = results[x][0].courseName;
    row.appendChild(cell);

    // Create cells
    for (let z in results[x]) {
      cell = document.createElement("td");
      cell.innerHTML = formatCell(results[x][z]);

      if (cell.innerHTML == "Availability: No") {
        cell.classList.add("bg-red-400");
      }

      row.appendChild(cell);
    }

    // Append row to table
    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  div.appendChild(table);

  return div;
}
