import { describe, it, expect, beforeEach } from "vitest";
import { viewCourseGallery } from "../../../src/pages/courseGallery/courseGallery";

describe("viewCourseGallery", () => {
  let testImages;

  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = `<div id="carouselDiv"></div>`;

    // Sample image data
    testImages = {
      courseA: ["0001", "0002", "0003"],
      courseB: ["0101"],
    };
  });

  it("renders a carousel when images exist for the course", () => {
    viewCourseGallery("courseA", testImages);

    const carousel = document.querySelector(".carousel");
    expect(carousel).not.toBeNull();
  });

  it("renders the correct number of carousel items", () => {
    viewCourseGallery("courseA", testImages);

    const items = document.querySelectorAll(".carousel-item");
    expect(items.length).toBe(3);
  });

  it("renders the correct number of navigation buttons", () => {
    viewCourseGallery("courseA", testImages);

    const buttons = document.querySelectorAll(".btn");
    expect(buttons.length).toBe(3);
  });

  it("uses the correct image src paths", () => {
    viewCourseGallery("courseA", testImages);

    const imgs = document.querySelectorAll("img");
    expect(imgs[0].getAttribute("src")).toBe("images/courseA/DJI_0001.jpg");
    expect(imgs[1].getAttribute("src")).toBe("images/courseA/DJI_0002.jpg");
    expect(imgs[2].getAttribute("src")).toBe("images/courseA/DJI_0003.jpg");
  });

  it("renders fallback text when no images exist for the course", () => {
    viewCourseGallery("unknownCourse", testImages);

    const container = document.getElementById("carouselDiv");
    expect(container.textContent).toContain(
      "No gallery available for this course",
    );
  });

  it("creates correct anchor links for buttons", () => {
    viewCourseGallery("courseB", testImages);

    const button = document.querySelector(".btn");
    expect(button.getAttribute("href")).toBe("#item1");
    expect(button.textContent).toBe("1");
  });

  it("works correctly for a single image", () => {
    viewCourseGallery("courseB", testImages);

    const items = document.querySelectorAll(".carousel-item");
    expect(items.length).toBe(1);

    const buttons = document.querySelectorAll(".btn");
    expect(buttons.length).toBe(1);

    const img = document.querySelector("img");
    expect(img.getAttribute("src")).toBe("images/courseB/DJI_0101.jpg");
  });
});
