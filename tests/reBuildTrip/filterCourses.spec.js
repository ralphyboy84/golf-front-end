import { describe, it, expect } from "vitest";
import { filterCourses } from "../../src/pages/reBuildTrip";

describe("filterCourses", () => {
  const sampleData = {
    levenlinks: [1, 2, 3],
    lundingc: [4, 5],
    Dumbarnie: [6],
    elie: [7, 8],
  };

  it("should return only the allowed keys present in data", () => {
    const allowedKeys = ["levenlinks", "elie"];
    const result = filterCourses(sampleData, allowedKeys);

    expect(result).toEqual({
      levenlinks: [1, 2, 3],
      elie: [7, 8],
    });
  });

  it("should ignore keys that are not present in data", () => {
    const allowedKeys = ["unknown", "Dumbarnie"];
    const result = filterCourses(sampleData, allowedKeys);

    expect(result).toEqual({
      Dumbarnie: [6],
    });
  });

  it("should return an empty object if no allowed keys match", () => {
    const allowedKeys = ["nonexistent1", "nonexistent2"];
    const result = filterCourses(sampleData, allowedKeys);

    expect(result).toEqual({});
  });

  it("should return an empty object if allowedKeys is empty", () => {
    const result = filterCourses(sampleData, []);
    expect(result).toEqual({});
  });

  it("should return an empty object if data is empty", () => {
    const result = filterCourses({}, ["levenlinks"]);
    expect(result).toEqual({});
  });

  it("should handle allowedKeys containing all keys", () => {
    const allowedKeys = ["levenlinks", "lundingc", "Dumbarnie", "elie"];
    const result = filterCourses(sampleData, allowedKeys);
    expect(result).toEqual(sampleData);
  });
});
