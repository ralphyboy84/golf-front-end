import { describe, it, expect } from "vitest";
import { buildCardRow } from "../../src/pages/components";

describe("buildCardRow", () => {
  it("should return HTML containing the provided values", () => {
    const icon = "<svg>icon</svg>";
    const title = "Test Title";
    const subText = "Test Subtitle";

    const result = buildCardRow(icon, title, subText);

    expect(result).toContain(icon);
    expect(result).toContain(title);
    expect(result).toContain(subText);
  });

  it("should return a string", () => {
    const result = buildCardRow("icon", "title", "sub");

    expect(typeof result).toBe("string");
  });

  it("should contain expected CSS classes", () => {
    const result = buildCardRow("icon", "title", "sub");

    expect(result).toContain("flex items-center");
    expect(result).toContain("font-semibold");
    expect(result).toContain("text-sm");
  });
});
