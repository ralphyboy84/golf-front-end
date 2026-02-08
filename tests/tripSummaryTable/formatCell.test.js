import { describe, it, expect } from "vitest";

// Import your function (adjust path if needed)
import { formatCell } from "../../src/pages/formatCell";

describe("formatCell", () => {
  it("should return 'Availability: No' when teeTimesAvailable is No", () => {
    const data = {
      teeTimesAvailable: "No",
      firstTime: "09:00",
      cheapestPrice: "100.00",
    };

    const result = formatCell(data);

    expect(result).toBe("Availability: No");
  });

  it("should return formatted string when tee times are available", () => {
    const data = {
      teeTimesAvailable: "Yes",
      firstTime: "09:32",
      cheapestPrice: "100.00",
    };

    const result = formatCell(data);

    expect(result).toBe(
      "Availability: Yes<br />First Tee Time: 09:32<br />Cheapest Price: £100.00",
    );
  });

  it("should correctly insert different values", () => {
    const data = {
      teeTimesAvailable: "Limited",
      firstTime: "12:15",
      cheapestPrice: "85.50",
    };

    const result = formatCell(data);

    expect(result).toContain("Availability: Limited");
    expect(result).toContain("First Tee Time: 12:15");
    expect(result).toContain("£85.50");
  });

  it("should still format if optional fields are missing", () => {
    const data = {
      teeTimesAvailable: "Yes",
    };

    const result = formatCell(data);

    expect(result).toBe(
      "Availability: Yes<br />First Tee Time: undefined<br />Cheapest Price: £undefined",
    );
  });
});
