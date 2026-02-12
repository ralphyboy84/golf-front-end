import { describe, it, expect } from "vitest";
import { buildCard } from "../../src/pages/components";

describe("buildCard", () => {
  it("should return a string", () => {
    const result = buildCard("testimg", "Header", "<p>Content</p>");
    expect(typeof result).toBe("string");
  });

  it("should include header and content", () => {
    const result = buildCard("testimg", "My Header", "<p>Hello</p>");

    expect(result).toContain("My Header");
    expect(result).toContain("<p>Hello</p>");
  });

  it("should include the correct image path", () => {
    const result = buildCard("golfcourse", "Header", "Content");

    expect(result).toContain('src="images/golfcourse.jpg"');
  });

  it("should include id when provided", () => {
    const result = buildCard("img", "Header", "Content", "card123");

    expect(result).toContain("id='card123'");
  });

  it("should NOT include id when not provided", () => {
    const result = buildCard("img", "Header", "Content");

    expect(result).not.toContain("id='");
  });

  it("should include additional class when provided", () => {
    const result = buildCard(
      "img",
      "Header",
      "Content",
      undefined,
      "custom-class",
    );

    expect(result).toContain("custom-class");
  });

  it("should NOT include additional class when not provided", () => {
    const result = buildCard("img", "Header", "Content");

    expect(result).not.toContain("undefined");
  });

  it("should render valid DOM structure", () => {
    const html = buildCard(
      "img",
      "Header Text",
      "<p>Body Content</p>",
      "card1",
    );

    const container = document.createElement("div");
    container.innerHTML = html;

    const card = container.querySelector(".card");
    const header = container.querySelector(".card-title");
    const img = container.querySelector("img");

    expect(card).not.toBeNull();
    expect(header.textContent).toBe("Header Text");
    expect(img.getAttribute("src")).toBe("images/img.jpg");
  });
});
