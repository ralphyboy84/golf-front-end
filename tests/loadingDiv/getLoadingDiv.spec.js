import { describe, it, expect } from "vitest";
import { getLoadingDiv } from "../../src/pages/loadingDiv";

describe("getLoadingDiv", () => {
  it("should return a string containing the percentage", () => {
    const html = getLoadingDiv(42.7);
    expect(typeof html).toBe("string");
    expect(html).toContain("43% complete"); // percentage rounded with toFixed(0)
  });

  it("should round percentage correctly", () => {
    const html = getLoadingDiv(99.9);
    expect(html).toContain("100% complete"); // rounded up
    expect(html).toContain('value="100"'); // progress element value
  });

  it("should include the spinner, paragraph, and progress elements", () => {
    const html = getLoadingDiv(50);

    expect(html).toContain("loading loading-spinner"); // spinner class
    expect(html).toContain("<p"); // paragraph
    expect(html).toContain("<progress"); // progress element
  });

  it("should handle 0% and 100% correctly", () => {
    const html0 = getLoadingDiv(0);
    expect(html0).toContain("0% complete");
    expect(html0).toContain('value="0"');

    const html100 = getLoadingDiv(100);
    expect(html100).toContain("100% complete");
    expect(html100).toContain('value="100"');
  });
});
