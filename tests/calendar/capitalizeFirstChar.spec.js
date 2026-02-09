import { describe, it, expect } from "vitest";
import { capitalizeFirstChar } from "../../src/pages/calendar";

describe("capitalizeFirstChar", () => {
  it("capitalizes the first character of a normal string", () => {
    expect(capitalizeFirstChar("hello")).toBe("Hello");
    expect(capitalizeFirstChar("world")).toBe("World");
  });

  it("returns an empty string for empty input", () => {
    expect(capitalizeFirstChar("")).toBe("");
    expect(capitalizeFirstChar(null)).toBe("");
    expect(capitalizeFirstChar(undefined)).toBe("");
  });

  it('handles the special "eastlothian" case', () => {
    expect(capitalizeFirstChar("eastlothian")).toBe("East Lothian");
  });

  it("does not alter a string that already starts with a capital", () => {
    expect(capitalizeFirstChar("Hello")).toBe("Hello");
  });

  it("capitalizes only the first character, leaving the rest unchanged", () => {
    expect(capitalizeFirstChar("hELLO")).toBe("HELLO");
  });
});
