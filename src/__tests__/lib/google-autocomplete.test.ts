import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAutocompleteSuggestions } from "@/lib/tomtom/autocomplete";

describe("getAutocompleteSuggestions (TomTom)", () => {
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
    await expect(getAutocompleteSuggestions("Wak")).rejects.toThrow(
      "TOMTOM_API_KEY is not configured"
    );
  });

  it("returns suggestions for valid input", async () => {
    const mockResponse = {
      results: [
        {
          id: "tt-1",
          type: "Geography",
          address: {
            freeformAddress: "Wakad, Pimpri-Chinchwad, Maharashtra, India",
            localName: "Wakad",
            countrySubdivision: "Maharashtra",
          },
          position: { lat: 18.59, lon: 73.77 },
        },
        {
          id: "tt-2",
          type: "Geography",
          address: {
            freeformAddress: "Wakadewadi, Pune, Maharashtra, India",
            localName: "Wakadewadi",
            countrySubdivision: "Maharashtra",
          },
          position: { lat: 18.58, lon: 73.78 },
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const results = await getAutocompleteSuggestions("Wak");
    expect(results).toHaveLength(2);
    expect(results[0]!.placeId).toBe("tt-1");
    expect(results[0]!.mainText).toBe("Wakad");
  });

  it("returns empty array for zero results", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    } as Response);

    const results = await getAutocompleteSuggestions("xyznonexistent");
    expect(results).toEqual([]);
  });

  it("limits to 5 suggestions max", async () => {
    const results = Array.from({ length: 8 }, (_, i) => ({
      id: `tt-${i}`,
      type: "Geography",
      address: {
        freeformAddress: `Place ${i}, India`,
        localName: `Place ${i}`,
      },
      position: { lat: 18 + i * 0.01, lon: 73 + i * 0.01 },
    }));

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ results }),
    } as Response);

    const suggestions = await getAutocompleteSuggestions("Place");
    expect(suggestions).toHaveLength(5);
  });

  it("throws error for rate limit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as Response);

    await expect(getAutocompleteSuggestions("Wak")).rejects.toThrow(
      "Rate limit"
    );
  });
});
