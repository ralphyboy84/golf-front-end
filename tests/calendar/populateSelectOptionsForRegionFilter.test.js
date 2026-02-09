import { describe, it, expect } from "vitest";
import {
  populateSelectOptionsForRegionFilter,
  capitalizeFirstChar,
} from "../../src/pages/calendar";

describe("populateSelectOptionsForRegionFilter", () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = `<select id="regionFilter"></select>`;
  });

  it("should populate the select element with options", () => {
    const data = { a: "north", b: "south", c: "east" };

    populateSelectOptionsForRegionFilter(data);

    const select = document.getElementById("regionFilter");
    const options = Array.from(select.options);

    expect(options.length).toBe(3);
    expect(options[0].value).toBe("north");
    expect(options[0].textContent).toBe("North");
    expect(options[1].value).toBe("south");
    expect(options[1].textContent).toBe("South");
    expect(options[2].value).toBe("east");
    expect(options[2].textContent).toBe("East");
  });

  it("should handle empty data", () => {
    const data = {};

    populateSelectOptionsForRegionFilter(data);

    const select = document.getElementById("regionFilter");
    expect(select.options.length).toBe(0);
  });
});
