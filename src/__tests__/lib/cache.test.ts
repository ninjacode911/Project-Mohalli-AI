import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  cacheGet,
  cacheSet,
  cacheDel,
  geocodeKey,
  discoverKey,
  detailsKey,
} from "@/lib/cache/redis";

describe("In-memory cache", () => {
  beforeEach(async () => {
    // Clear by setting known keys to expire
    await cacheDel("test-key");
  });

  it("returns null for missing key", async () => {
    const result = await cacheGet("nonexistent");
    expect(result).toBeNull();
  });

  it("stores and retrieves a value", async () => {
    await cacheSet("test-key", { hello: "world" }, 60);
    const result = await cacheGet<{ hello: string }>("test-key");
    expect(result).toEqual({ hello: "world" });
  });

  it("expires after TTL", async () => {
    vi.useFakeTimers();
    await cacheSet("ttl-key", "data", 1); // 1 second TTL

    vi.advanceTimersByTime(2000); // Advance 2 seconds

    const result = await cacheGet("ttl-key");
    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("deletes a key", async () => {
    await cacheSet("del-key", "data", 60);
    await cacheDel("del-key");
    const result = await cacheGet("del-key");
    expect(result).toBeNull();
  });
});

describe("Cache key generators", () => {
  it("geocodeKey generates consistent hash", () => {
    const key1 = geocodeKey("Wakad, Pune");
    const key2 = geocodeKey("wakad, pune");
    expect(key1).toBe(key2); // Case insensitive
    expect(key1).toMatch(/^geocode:[a-f0-9]{32}$/);
  });

  it("discoverKey includes all parameters", () => {
    const key = discoverKey(18.5912, 73.7615, "plumber", 3000);
    expect(key).toBe("discover:18.591:73.761:plumber:3000");
  });

  it("detailsKey includes placeId", () => {
    const key = detailsKey("ChIJ123");
    expect(key).toBe("details:ChIJ123");
  });
});
