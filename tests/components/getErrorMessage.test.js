import { describe, it, expect } from "vitest";
import { getErrorMessage } from "../../src/pages/components";

describe("getErrorMessage", () => {
  it("should return a string", () => {
    const result = getErrorMessage("error1", "Something went wrong");
    expect(typeof result).toBe("string");
  });

  it("should include the provided id", () => {
    const result = getErrorMessage("error123", "Message");

    expect(result).toContain("id='error123'");
  });

  it("should include the provided message", () => {
    const result = getErrorMessage("error1", "Test error message");

    expect(result).toContain("Test error message");
  });

  it("should contain accessibility role alert", () => {
    const result = getErrorMessage("error1", "Message");

    expect(result).toContain('role="alert"');
  });

  it("should include expected CSS classes", () => {
    const result = getErrorMessage("error1", "Message");

    expect(result).toContain("alert alert-error hidden");
  });

  it("should render valid DOM structure", () => {
    const html = getErrorMessage("errorBox", "Error occurred");

    const container = document.createElement("div");
    container.innerHTML = html;

    const alert = container.querySelector("#errorBox");
    const span = container.querySelector("span");
    const svg = container.querySelector("svg");

    expect(alert).not.toBeNull();
    expect(alert.getAttribute("role")).toBe("alert");
    expect(span.textContent).toBe("Error occurred");
    expect(svg).not.toBeNull();
  });
});
