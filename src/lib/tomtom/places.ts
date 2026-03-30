import type { ServiceResult, PlaceDetail, PlaceReview } from "@/types";
import { CATEGORY_MAP } from "@/lib/constants/categories";
import { haversineDistance } from "@/lib/utils/index";

const TOMTOM_POI_SEARCH_URL =
  "https://api.tomtom.com/search/2/poiSearch";
const TOMTOM_PLACE_URL =
  "https://api.tomtom.com/search/2/place.json";

interface TomTomPoi {
  id: string;
  name: string;
  phone?: string;
  url?: string;
  categories?: string[];
  classifications?: { code: string; names: { name: string }[] }[];
}

interface TomTomAddress {
  freeformAddress: string;
  streetName?: string;
  municipality?: string;
}

interface TomTomOpeningHours {
  mode?: string;
  timeRanges?: {
    startTime: { date: string; hour: number; minute: number };
    endTime: { date: string; hour: number; minute: number };
  }[];
}

interface TomTomSearchResult {
  id: string;
  type: string;
  poi?: TomTomPoi;
  address: TomTomAddress;
  position: { lat: number; lon: number };
  dist?: number;
  score?: number;
  openingHours?: TomTomOpeningHours;
}

interface TomTomSearchApiResponse {
  summary: { numResults: number; totalResults: number };
  results: TomTomSearchResult[];
}

function getApiKey(): string {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) {
    throw new Error("TOMTOM_API_KEY is not configured");
  }
  return apiKey;
}

type OpenStatus = { isOpen: boolean | null; hoursText: string };

/**
 * Determine open/closed status from TomTom data.
 * Returns null for isOpen when hours data is unavailable.
 */
function getOpenStatus(openingHours?: TomTomOpeningHours): OpenStatus {
  if (!openingHours || !openingHours.timeRanges) {
    return { isOpen: null, hoursText: "Hours not available" };
  }

  if (openingHours.timeRanges.length === 0) {
    return { isOpen: null, hoursText: "Hours not available" };
  }

  // TomTom provides time ranges — check if current time falls within any
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  for (const range of openingHours.timeRanges) {
    const startH = range.startTime.hour;
    const startM = range.startTime.minute;
    const endH = range.endTime.hour;
    const endM = range.endTime.minute;

    const currentTotal = currentHour * 60 + currentMinute;
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (currentTotal >= startTotal && currentTotal <= endTotal) {
      return { isOpen: true, hoursText: `Open until ${endH}:${String(endM).padStart(2, "0")}` };
    }
  }

  return { isOpen: false, hoursText: "Currently closed" };
}

// Expanding radius steps: if no results at user's radius, keep widening
const EXPAND_RADII = [5000, 10000, 25000, 50000];

/**
 * Single fetch at a given radius. Returns raw TomTom results.
 */
async function fetchPois(
  apiKey: string,
  query: string,
  lat: number,
  lng: number,
  radius: number
): Promise<TomTomSearchApiResponse> {
  const url = `${TOMTOM_POI_SEARCH_URL}/${query}.json?key=${apiKey}&lat=${lat}&lon=${lng}&radius=${radius}&limit=20&language=en-US&countrySet=IN&openingHours=nextSevenDays`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("TomTom API key is invalid or expired");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error(
      `TomTom Places API returned ${response.status}: ${response.statusText}`
    );
  }

  return (await response.json()) as TomTomSearchApiResponse;
}

function mapResults(
  raw: TomTomSearchResult[],
  lat: number,
  lng: number
): ServiceResult[] {
  return raw
    .filter((r) => r.poi)
    .map((result) => {
      const distance = haversineDistance(
        lat,
        lng,
        result.position.lat,
        result.position.lon
      );

      const status = getOpenStatus(result.openingHours);

      return {
        placeId: result.id,
        name: result.poi?.name ?? "Unknown",
        rating: result.score
          ? Math.min(5, Math.round((result.score / 2) * 10) / 10)
          : 0,
        reviewCount: 0,
        distance,
        distanceUnit: "km",
        address: result.address.freeformAddress,
        isOpen: status.isOpen ?? false,
        hours: status.hoursText,
        phone: result.poi?.phone ?? "",
        lat: result.position.lat,
        lng: result.position.lon,
        photoRef: null,
      };
    });
}

/**
 * Discover services near a location using TomTom POI Search API.
 * Auto-expands search radius if no results found at the requested radius,
 * so it always returns the closest facilities no matter how far.
 */
export async function discoverServices(
  lat: number,
  lng: number,
  category: string,
  radius: number = 3000,
  sort: "distance" | "rating" | "reviews" = "distance"
): Promise<ServiceResult[]> {
  const apiKey = getApiKey();
  const categoryConfig = CATEGORY_MAP.get(category);

  if (!categoryConfig) {
    throw new Error(`Unknown category: ${category}`);
  }

  const query = encodeURIComponent(categoryConfig.fallbackKeyword);

  // Try at requested radius first
  let data = await fetchPois(apiKey, query, lat, lng, radius);

  // Auto-expand if no results: try progressively larger radii
  if (data.summary.numResults === 0 || data.results.length === 0) {
    for (const expandedRadius of EXPAND_RADII) {
      if (expandedRadius <= radius) continue; // Skip if already tried larger
      data = await fetchPois(apiKey, query, lat, lng, expandedRadius);
      if (data.results.length > 0) break;
    }
  }

  if (data.results.length === 0) {
    return [];
  }

  const results = mapResults(data.results, lat, lng);

  // Sort results
  switch (sort) {
    case "rating":
      results.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
      break;
    case "reviews":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "distance":
    default:
      results.sort((a, b) => a.distance - b.distance);
      break;
  }

  return results;
}

/**
 * Get details for a specific place using TomTom Place by ID.
 */
export async function getPlaceDetails(
  placeId: string
): Promise<PlaceDetail> {
  const apiKey = getApiKey();

  const url = `${TOMTOM_PLACE_URL}?key=${apiKey}&entityId=${placeId}&language=en-US`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      throw new Error(`Place not found: ${placeId}`);
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error(
      `TomTom Place Details API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as TomTomSearchApiResponse;

  if (data.results.length === 0) {
    throw new Error(`Place not found: ${placeId}`);
  }

  const result = data.results[0]!;
  const status = getOpenStatus(result.openingHours);

  const reviews: PlaceReview[] = [];

  return {
    placeId: result.id,
    name: result.poi?.name ?? "Unknown",
    rating: result.score ? Math.min(5, Math.round((result.score / 2) * 10) / 10) : 0,
    reviewCount: 0,
    distance: 0,
    distanceUnit: "km",
    address: result.address.freeformAddress,
    isOpen: status.isOpen ?? false,
    hours: status.hoursText,
    phone: result.poi?.phone ?? "",
    lat: result.position.lat,
    lng: result.position.lon,
    photoRef: null,
    website: result.poi?.url ?? null,
    weekdayHours: [],
    reviews,
    photos: [],
    formattedPhone: result.poi?.phone ?? "",
  };
}
