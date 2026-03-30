import { describe, it, expect } from "vitest";
import { APP_CONFIG, SEARCH_CONFIG, POPULAR_AREAS } from "@/lib/constants/config";

describe("APP_CONFIG", () => {
  it("has correct app name", () => {
    expect(APP_CONFIG.name).toBe("Mohalla AI");
  });

  it("has a version string", () => {
    expect(APP_CONFIG.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe("SEARCH_CONFIG", () => {
  it("has valid default radius", () => {
    expect(SEARCH_CONFIG.defaultRadius).toBeGreaterThanOrEqual(SEARCH_CONFIG.minRadius);
    expect(SEARCH_CONFIG.defaultRadius).toBeLessThanOrEqual(SEARCH_CONFIG.maxRadius);
  });

  it("has valid autocomplete settings", () => {
    expect(SEARCH_CONFIG.autocompleteDelay).toBeGreaterThan(0);
    expect(SEARCH_CONFIG.autocompleteMinChars).toBeGreaterThan(0);
  });
});

describe("POPULAR_AREAS", () => {
  it("has at least 5 popular areas", () => {
    expect(POPULAR_AREAS.length).toBeGreaterThanOrEqual(5);
  });

  it("each area has name and city", () => {
    for (const area of POPULAR_AREAS) {
      expect(area.name).toBeTruthy();
      expect(area.city).toBeTruthy();
    }
  });
});
