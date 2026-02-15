import { describe, it, expect } from "vitest";
import { clearFilters } from "../../src/pages/calendar";

describe("clearFilters", () => {
  beforeEach(() => {
    // Set up a mock DOM before each test
    document.body.innerHTML = `
      <input id="keywordSearch" value="test keyword" />
      <select id="top100Filter">
        <option value="" selected>Select...</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <select id="regionFilter">
        <option value="" selected>Select...</option>
        <option value="north" selected>North</option>
      </select>
      <select id="courseListSelect">
        <option value="" selected>Select...</option>
        <option value="carnoustie" selected>Carnoustie</option>
      </select>
      <input type="checkbox" id="useYourLocationForOpenFiltering" checked />
      <div id="showHowManyMilesDiv"></div>
    `;
  });

  it("should clear all input and select values", () => {
    clearFilters();
    expect(document.getElementById("keywordSearch").value).toBe("");
    expect(document.getElementById("top100Filter").value).toBe("");
    expect(document.getElementById("regionFilter").value).toBe("");
    expect(document.getElementById("courseListSelect").value).toBe("");
  });

  it("should uncheck the checkbox", () => {
    clearFilters();
    expect(
      document.getElementById("useYourLocationForOpenFiltering").checked,
    ).toBe(false);
  });

  it('should hide the "showHowManyMilesDiv" element', () => {
    clearFilters();
    expect(
      document
        .getElementById("showHowManyMilesDiv")
        .classList.contains("hidden"),
    ).toBe(true);
  });
});
