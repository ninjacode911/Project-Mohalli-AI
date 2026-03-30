import { describe, it, expect } from "vitest";
import { applyFilters } from "@/lib/utils/filters";
import type { ServiceResult } from "@/types";

const mockResults: ServiceResult[] = [
  {
    placeId: "1",
    name: "Open High Rated",
    rating: 4.8,
    reviewCount: 200,
    distance: 2.0,
    distanceUnit: "km",
    address: "Street A",
    isOpen: true,
    hours: "Open now",
    phone: "+91 1234",
    lat: 18.59,
    lng: 73.77,
    photoRef: null,
  },
  {
    placeId: "2",
    name: "Closed Medium Rated",
    rating: 3.5,
    reviewCount: 50,
    distance: 0.5,
    distanceUnit: "km",
    address: "Street B",
    isOpen: false,
    hours: "Closed",
    phone: "",
    lat: 18.591,
    lng: 73.771,
    photoRef: null,
  },
  {
    placeId: "3",
    name: "Open Low Rated Many Reviews",
    rating: 2.0,
    reviewCount: 500,
    distance: 1.5,
    distanceUnit: "km",
    address: "Street C",
    isOpen: true,
    hours: "Open now",
    phone: "+91 5678",
    lat: 18.592,
    lng: 73.772,
    photoRef: null,
  },
];

const defaultFilters = { openNow: false, minRating: 0, radius: 3000 };

describe("applyFilters", () => {
  it("returns all results with default filters sorted by distance", () => {
    const result = applyFilters(mockResults, defaultFilters, "distance");
    expect(result).toHaveLength(3);
    expect(result[0]!.name).toBe("Closed Medium Rated"); // 0.5 km
    expect(result[1]!.name).toBe("Open Low Rated Many Reviews"); // 1.5 km
    expect(result[2]!.name).toBe("Open High Rated"); // 2.0 km
  });

  it("filters by open now", () => {
    const result = applyFilters(
      mockResults,
      { ...defaultFilters, openNow: true },
      "distance"
    );
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.isOpen)).toBe(true);
  });

  it("filters by minimum rating", () => {
    const result = applyFilters(
      mockResults,
      { ...defaultFilters, minRating: 4.0 },
      "distance"
    );
    expect(result).toHaveLength(1);
    expect(result[0]!.name).toBe("Open High Rated");
  });

  it("combines open now and rating filters", () => {
    const result = applyFilters(
      mockResults,
      { openNow: true, minRating: 3.0, radius: 3000 },
      "distance"
    );
    // Open + rating >= 3.0: only "Open High Rated" (4.8)
    expect(result).toHaveLength(1);
    expect(result[0]!.name).toBe("Open High Rated");
  });

  it("sorts by rating descending", () => {
    const result = applyFilters(mockResults, defaultFilters, "rating");
    expect(result[0]!.rating).toBe(4.8);
    expect(result[1]!.rating).toBe(3.5);
    expect(result[2]!.rating).toBe(2.0);
  });

  it("sorts by reviews descending", () => {
    const result = applyFilters(mockResults, defaultFilters, "reviews");
    expect(result[0]!.reviewCount).toBe(500);
    expect(result[1]!.reviewCount).toBe(200);
    expect(result[2]!.reviewCount).toBe(50);
  });

  it("does not mutate original array", () => {
    const original = [...mockResults];
    applyFilters(mockResults, { ...defaultFilters, openNow: true }, "rating");
    expect(mockResults).toEqual(original);
  });

  it("returns empty array when no results match", () => {
    const result = applyFilters(
      mockResults,
      { ...defaultFilters, minRating: 5.0 },
      "distance"
    );
    expect(result).toEqual([]);
  });
});
