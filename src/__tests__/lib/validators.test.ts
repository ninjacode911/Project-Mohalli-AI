import { describe, it, expect } from "vitest";
import {
  geocodeRequestSchema,
  autocompleteRequestSchema,
  discoverRequestSchema,
  placeIdSchema,
} from "@/lib/validators/schemas";

describe("geocodeRequestSchema", () => {
  it("accepts valid area name", () => {
    const result = geocodeRequestSchema.safeParse({ area: "Wakad, Pune" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.area).toBe("Wakad, Pune");
    }
  });

  it("trims whitespace", () => {
    const result = geocodeRequestSchema.safeParse({ area: "  Baner  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.area).toBe("Baner");
    }
  });

  it("rejects empty string", () => {
    const result = geocodeRequestSchema.safeParse({ area: "" });
    expect(result.success).toBe(false);
  });

  it("rejects single character", () => {
    const result = geocodeRequestSchema.safeParse({ area: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects missing area field", () => {
    const result = geocodeRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects non-string area", () => {
    const result = geocodeRequestSchema.safeParse({ area: 123 });
    expect(result.success).toBe(false);
  });
});

describe("autocompleteRequestSchema", () => {
  it("accepts valid input", () => {
    const result = autocompleteRequestSchema.safeParse({ input: "Wak" });
    expect(result.success).toBe(true);
  });

  it("accepts input with location", () => {
    const result = autocompleteRequestSchema.safeParse({
      input: "Wak",
      location: { lat: 18.59, lng: 73.77 },
    });
    expect(result.success).toBe(true);
  });

  it("rejects single character input", () => {
    const result = autocompleteRequestSchema.safeParse({ input: "W" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid lat/lng", () => {
    const result = autocompleteRequestSchema.safeParse({
      input: "Wak",
      location: { lat: 200, lng: 73 },
    });
    expect(result.success).toBe(false);
  });
});

describe("discoverRequestSchema", () => {
  it("accepts valid discover request", () => {
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "plumber",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.radius).toBe(3000); // default
      expect(result.data.sort).toBe("distance"); // default
    }
  });

  it("accepts custom radius and sort", () => {
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "plumber",
      radius: 5000,
      sort: "rating",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.radius).toBe(5000);
      expect(result.data.sort).toBe("rating");
    }
  });

  it("rejects radius below minimum (100)", () => {
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "plumber",
      radius: 50,
    });
    expect(result.success).toBe(false);
  });

  it("rejects radius above maximum (50000)", () => {
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "plumber",
      radius: 100000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty category", () => {
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid sort option", () => {
    const result = discoverRequestSchema.safeParse({
      lat: 18.59,
      lng: 73.77,
      category: "plumber",
      sort: "price",
    });
    expect(result.success).toBe(false);
  });
});

describe("placeIdSchema", () => {
  it("accepts valid place ID", () => {
    const result = placeIdSchema.safeParse("ChIJxxxxxx");
    expect(result.success).toBe(true);
  });

  it("rejects empty string", () => {
    const result = placeIdSchema.safeParse("");
    expect(result.success).toBe(false);
  });
});
