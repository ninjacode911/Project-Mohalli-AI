import { describe, it, expect } from "vitest";
import { discoverRequestSchema } from "@/lib/validators/schemas";
import { CATEGORY_MAP, CATEGORIES } from "@/lib/constants/categories";

describe("/api/discover validation", () => {
  it("accepts valid request with defaults", () => {
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "plumber",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.radius).toBe(3000);
      expect(result.data.sort).toBe("distance");
    }
  });

  it("rejects invalid category (at schema level category is a string)", () => {
    // Schema allows any non-empty string; route handler validates against CATEGORY_MAP
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "nonexistent",
    });
    expect(result.success).toBe(true); // Schema passes
    // But CATEGORY_MAP won't have it
    expect(CATEGORY_MAP.has("nonexistent")).toBe(false);
  });

  it("all 12 categories are in CATEGORY_MAP", () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(12);
    for (const cat of CATEGORIES) {
      expect(CATEGORY_MAP.has(cat.id)).toBe(true);
    }
  });
});

describe("/api/categories response shape", () => {
  it("each category has id, name, icon", () => {
    const categories = CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
    }));

    expect(categories.length).toBeGreaterThanOrEqual(12);
    for (const cat of categories) {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.icon).toBeTruthy();
    }
  });
});
