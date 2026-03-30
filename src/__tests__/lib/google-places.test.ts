import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { discoverServices, getPlaceDetails } from "@/lib/tomtom/places";

describe("discoverServices (TomTom)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, TOMTOM_API_KEY: "test-key" };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("throws error when API key is not configured", async () => {
    delete process.env.TOMTOM_API_KEY;
    await expect(
      discoverServices(18.59, 73.77, "plumber")
    ).rejects.toThrow("TOMTOM_API_KEY is not configured");
  });

  it("throws error for unknown category", async () => {
    await expect(
      discoverServices(18.59, 73.77, "unknown_cat")
    ).rejects.toThrow("Unknown category: unknown_cat");
  });

  it("returns sorted results by distance (default)", async () => {
    const mockResults = {
      summary: { numResults: 2, totalResults: 2 },
      results: [
        {
          id: "tt-1",
          type: "POI",
          poi: { name: "Far Plumber", phone: "+91 1234" },
          address: { freeformAddress: "Far Street, Pune" },
          position: { lat: 18.60, lon: 73.80 },
        },
        {
          id: "tt-2",
          type: "POI",
          poi: { name: "Near Plumber", phone: "+91 5678" },
          address: { freeformAddress: "Near Street, Pune" },
          position: { lat: 18.591, lon: 73.762 },
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResults,
    } as Response);

    const results = await discoverServices(18.59, 73.77, "plumber");
    expect(results).toHaveLength(2);
    expect(results[0]!.name).toBe("Near Plumber");
    expect(results[0]!.distance).toBeLessThan(results[1]!.distance);
  });

  it("returns empty array for zero results", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        summary: { numResults: 0, totalResults: 0 },
        results: [],
      }),
    } as Response);

    const results = await discoverServices(18.59, 73.77, "plumber");
    expect(results).toEqual([]);
  });

  it("handles results with phone numbers", async () => {
    const mockResults = {
      summary: { numResults: 1, totalResults: 1 },
      results: [
        {
          id: "tt-1",
          type: "POI",
          poi: { name: "Test Plumber", phone: "+91 92095 60675" },
          address: { freeformAddress: "Test Street, Pune" },
          position: { lat: 18.59, lon: 73.77 },
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResults,
    } as Response);

    const results = await discoverServices(18.59, 73.77, "plumber");
    expect(results[0]!.phone).toBe("+91 92095 60675");
  });

  it("throws error for rate limit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as Response);

    await expect(
      discoverServices(18.59, 73.77, "plumber")
    ).rejects.toThrow("Rate limit");
  });
});

describe("getPlaceDetails (TomTom)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, TOMTOM_API_KEY: "test-key" };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns place details", async () => {
    const mockResponse = {
      summary: { numResults: 1 },
      results: [
        {
          id: "tt-123",
          type: "POI",
          poi: {
            name: "Test Plumber",
            phone: "+91 92095 60675",
            url: "https://example.com",
          },
          address: { freeformAddress: "123 Main St, Wakad, Pune" },
          position: { lat: 18.59, lon: 73.77 },
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await getPlaceDetails("tt-123");
    expect(result.placeId).toBe("tt-123");
    expect(result.name).toBe("Test Plumber");
    expect(result.phone).toBe("+91 92095 60675");
    expect(result.website).toBe("https://example.com");
  });

  it("throws error for not found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response);

    await expect(getPlaceDetails("invalid")).rejects.toThrow("Place not found");
  });
});
