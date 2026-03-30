import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { geocodeArea } from "@/lib/tomtom/geocode";

describe("geocodeArea (TomTom)", () => {
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
    await expect(geocodeArea("Wakad, Pune")).rejects.toThrow(
      "TOMTOM_API_KEY is not configured"
    );
  });

  it("returns lat/lng for a valid area", async () => {
    const mockResponse = {
      summary: { numResults: 1 },
      results: [
        {
          position: { lat: 18.5912, lon: 73.7615 },
          address: {
            freeformAddress: "Wakad, Pimpri-Chinchwad, Maharashtra",
          },
        },
      ],
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await geocodeArea("Wakad, Pune");
    expect(result.lat).toBeCloseTo(18.5912, 3);
    expect(result.lng).toBeCloseTo(73.7615, 3);
    expect(result.formattedAddress).toContain("Wakad");
    expect(result.cached).toBe(false);
  });

  it("throws error for zero results", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ summary: { numResults: 0 }, results: [] }),
    } as Response);

    await expect(geocodeArea("xyznonexistent123")).rejects.toThrow(
      "No results found"
    );
  });

  it("throws error for rate limit (429)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    } as Response);

    await expect(geocodeArea("Wakad")).rejects.toThrow("Rate limit");
  });

  it("throws error when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    await expect(geocodeArea("Wakad")).rejects.toThrow("500");
  });
});
