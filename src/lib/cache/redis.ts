import { createHash } from "crypto";
import { CACHE_CONFIG } from "@/lib/constants/config";

/**
 * Simple in-memory cache fallback when Redis is not configured.
 * In production, replace with Upstash Redis or ioredis.
 */
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

function isRedisConfigured(): boolean {
  return !!process.env.REDIS_URL && process.env.REDIS_URL.length > 0;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (isRedisConfigured()) {
    // TODO: Replace with actual Redis client when REDIS_URL is set
    // const redis = getRedisClient();
    // const value = await redis.get(key);
    // return value ? JSON.parse(value) : null;
  }

  // In-memory fallback
  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return JSON.parse(entry.value) as T;
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  const serialized = JSON.stringify(value);

  if (isRedisConfigured()) {
    // TODO: Replace with actual Redis client
    // const redis = getRedisClient();
    // await redis.set(key, serialized, "EX", ttlSeconds);
  }

  // In-memory fallback
  memoryCache.set(key, {
    value: serialized,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export async function cacheDel(key: string): Promise<void> {
  memoryCache.delete(key);
}

// --- Key generators ---

export function geocodeKey(area: string): string {
  const hash = createHash("md5").update(area.toLowerCase().trim()).digest("hex");
  return `geocode:${hash}`;
}

export function discoverKey(
  lat: number,
  lng: number,
  category: string,
  radius: number
): string {
  // Round lat/lng to 3 decimals for cache efficiency (~111m precision)
  const roundedLat = lat.toFixed(3);
  const roundedLng = lng.toFixed(3);
  return `discover:${roundedLat}:${roundedLng}:${category}:${radius}`;
}

export function detailsKey(placeId: string): string {
  return `details:${placeId}`;
}

export { CACHE_CONFIG };
