import { describe, it, expect } from "vitest";
import { haversineDistance, formatDistance, slugify } from "@/lib/utils/index";

describe("haversineDistance", () => {
  it("calculates distance between two known points", () => {
    // Wakad to Baner, Pune (~3.5 km)
    const distance = haversineDistance(18.5912, 73.7615, 18.559, 73.7868);
    expect(distance).toBeGreaterThan(2);
    expect(distance).toBeLessThan(5);
  });

  it("returns 0 for same coordinates", () => {
    const distance = haversineDistance(18.5912, 73.7615, 18.5912, 73.7615);
    expect(distance).toBe(0);
  });
});

describe("formatDistance", () => {
  it("formats distance in km", () => {
    expect(formatDistance(3.5)).toBe("3.5 km");
  });

  it("formats distance in meters when less than 1 km", () => {
    expect(formatDistance(0.5)).toBe("500m");
  });
});

describe("slugify", () => {
  it("converts area name to URL-safe slug", () => {
    expect(slugify("Wakad, Pune")).toBe("wakad-pune");
  });

  it("handles multiple spaces and special characters", () => {
    expect(slugify("  Park Street (Wakad)  ")).toBe("park-street-wakad");
  });

  it("handles already slugified text", () => {
    expect(slugify("wakad-pune")).toBe("wakad-pune");
  });
});
