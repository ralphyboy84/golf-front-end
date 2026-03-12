import { describe, it, expect, beforeEach } from "vitest";
import { viewCourseGallery } from "../../../src/pages/courseGallery/courseGallery";

describe("viewCourseGallery()", () => {
  const mockImages = {
    carnoustie: ["001", "002", "003"],
    emptyCourse: [],
    // 'missingCourse' is intentionally omitted to test undefined keys
  };

  it("should render a full carousel when images exist", () => {
    const result = viewCourseGallery("carnoustie", mockImages);

    // Verify HTML structure for the first item
    expect(result).toContain('id="item1"');
    expect(result).toContain('src="images/carnoustie/DJI_001.jpg"');

    // Verify the navigation button exists
    expect(result).toContain(
      '<a href="#item1" class="btn btn-xs shrink-0">1</a>',
    );

    // Verify it scaled to the 3rd item correctly
    expect(result).toContain('id="item3"');
    expect(result).toContain('href="#item3"');
  });

  it('should return the "No gallery" message if the image array is empty', () => {
    const result = viewCourseGallery("emptyCourse", mockImages);

    expect(result).toBe("No gallery available for this course");
    expect(result).not.toContain("carousel-item");
  });

  it('should return the "No gallery" message if the courseId does not exist in the object', () => {
    const result = viewCourseGallery("st-andrews", mockImages);

    expect(result).toBe("No gallery available for this course");
  });

  it("should correctly increment the counter (x) for IDs and button text", () => {
    const result = viewCourseGallery("carnoustie", mockImages);

    // Check that we have exactly three buttons numbered 1, 2, and 3
    expect(result).toContain(">1</a>");
    expect(result).toContain(">2</a>");
    expect(result).toContain(">3</a>");
  });
});
