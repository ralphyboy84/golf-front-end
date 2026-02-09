import { describe, it, expect } from "vitest";
import { findDatesWhereNoAvailability } from "../../src/pages/tripBuilder";

describe("findDatesWhereNoAvailability", () => {
  it("returns dates from allDates that are not in usedDates", () => {
    const allDates = ["2026-02-10", "2026-02-11", "2026-02-12"];
    const usedDates = [{ date: "2026-02-10" }, { date: "2026-02-12" }];

    const result = findDatesWhereNoAvailability(allDates, usedDates);
    expect(result).toEqual(["2026-02-11"]);
  });

  it("returns all dates if none are used", () => {
    const allDates = ["2026-02-10", "2026-02-11"];
    const usedDates = [];

    const result = findDatesWhereNoAvailability(allDates, usedDates);
    expect(result).toEqual(["2026-02-10", "2026-02-11"]);
  });

  it("returns empty array if all dates are used", () => {
    const allDates = ["2026-02-10", "2026-02-11"];
    const usedDates = [{ date: "2026-02-10" }, { date: "2026-02-11" }];

    const result = findDatesWhereNoAvailability(allDates, usedDates);
    expect(result).toEqual([]);
  });

  it("handles partial overlaps correctly", () => {
    const allDates = ["2026-02-10", "2026-02-11", "2026-02-12"];
    const usedDates = [{ date: "2026-02-11" }];

    const result = findDatesWhereNoAvailability(allDates, usedDates);
    expect(result).toEqual(["2026-02-10", "2026-02-12"]);
  });
});
