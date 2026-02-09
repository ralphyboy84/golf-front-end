import { describe, it, expect } from "vitest";
import { getUniqueDates } from "../../src/pages/tripBuilder";

describe("getUniqueDates", () => {
  it("returns unique sorted dates from golfData", () => {
    const golfData = {
      course1: [
        { date: "2026-02-10", teeTime: "08:00" },
        { date: "2026-02-11", teeTime: "09:00" },
      ],
      course2: [
        { date: "2026-02-10", teeTime: "10:00" }, // duplicate date
        { date: "2026-02-12", teeTime: "11:00" },
      ],
    };

    const result = getUniqueDates(golfData);
    expect(result).toEqual(["2026-02-10", "2026-02-11", "2026-02-12"]);
  });

  it("returns an empty array when golfData is empty", () => {
    const result = getUniqueDates({});
    expect(result).toEqual([]);
  });

  it("works if one course has no tee times", () => {
    const golfData = {
      course1: [],
      course2: [{ date: "2026-03-01", teeTime: "08:00" }],
    };

    const result = getUniqueDates(golfData);
    expect(result).toEqual(["2026-03-01"]);
  });

  it("handles multiple duplicates correctly", () => {
    const golfData = {
      course1: [{ date: "2026-04-01" }, { date: "2026-04-01" }],
      course2: [{ date: "2026-04-01" }, { date: "2026-04-02" }],
    };

    const result = getUniqueDates(golfData);
    expect(result).toEqual(["2026-04-01", "2026-04-02"]);
  });
});
