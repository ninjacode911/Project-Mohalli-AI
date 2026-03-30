import { describe, it, expect } from "vitest";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/constants/categories";

describe("CATEGORIES", () => {
  it("has at least 12 categories", () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(20);
  });

  it("each category has required fields", () => {
    for (const cat of CATEGORIES) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(cat.googleTypes.length).toBeGreaterThan(0);
      expect(cat.fallbackKeyword).toBeTruthy();
    }
  });

  it("has no duplicate IDs", () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("CATEGORY_MAP", () => {
  it("can look up a category by ID", () => {
    const plumber = CATEGORY_MAP.get("plumber");
    expect(plumber).toBeDefined();
    expect(plumber?.name).toBe("Plumber");
    expect(plumber?.googleTypes).toContain("plumber");
  });

  it("returns undefined for invalid ID", () => {
    expect(CATEGORY_MAP.get("invalid")).toBeUndefined();
  });
});
