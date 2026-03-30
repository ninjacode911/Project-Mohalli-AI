import type { ServiceResult, PlaceDetail, PlaceReview } from "@/types";
import { CATEGORY_MAP } from "@/lib/constants/categories";
import { haversineDistance } from "@/lib/utils/index";

const GOOGLE_NEARBY_URL =
  "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const GOOGLE_DETAILS_URL =
  "https://maps.googleapis.com/maps/api/place/details/json";

// --- Nearby Search Types ---
interface GooglePlaceResult {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  geometry: {
    location: { lat: number; lng: number };
  };
  vicinity?: string;
  formatted_address?: string;
  opening_hours?: {
    open_now?: boolean;
  };
  business_status?: string;
  photos?: { photo_reference: string }[];
}

interface GoogleNearbyApiResponse {
  status: string;
  results: GooglePlaceResult[];
  next_page_token?: string;
  error_message?: string;
}

// --- Place Details Types ---
interface GooglePlaceDetail {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  geometry: {
    location: { lat: number; lng: number };
  };
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  reviews?: {
    author_name: string;
    rating: number;
    text: string;
    relative_time_description: string;
  }[];
  photos?: { photo_reference: string }[];
}

interface GoogleDetailsApiResponse {
  status: string;
  result: GooglePlaceDetail;
  error_message?: string;
}

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }
  return apiKey;
}

/**
 * Discover services near a location using Google Places Nearby Search API.
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

  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: radius.toString(),
    key: apiKey,
    language: "en",
  });

  // Use the first Google type as the primary type filter
  if (categoryConfig.googleTypes[0]) {
    params.set("type", categoryConfig.googleTypes[0]);
  }

  // Add keyword for better results
  params.set("keyword", categoryConfig.fallbackKeyword);

  const response = await fetch(`${GOOGLE_NEARBY_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Google Places API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as GoogleNearbyApiResponse;

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      `Google API request denied: ${data.error_message ?? "Check API key"}`
    );
  }

  if (data.status === "OVER_QUERY_LIMIT") {
    throw new Error("Google API rate limit exceeded. Please try again later.");
  }

  if (data.status === "ZERO_RESULTS") {
    return [];
  }

  if (data.status !== "OK") {
    throw new Error(`Places search failed with status: ${data.status}`);
  }

  // Map results and calculate distances
  const results: ServiceResult[] = data.results
    .filter((place) => place.business_status !== "CLOSED_PERMANENTLY")
    .map((place) => {
      const distance = haversineDistance(
        lat,
        lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      );

      return {
        placeId: place.place_id,
        name: place.name,
        rating: place.rating ?? 0,
        reviewCount: place.user_ratings_total ?? 0,
        distance,
        distanceUnit: "km",
        address: place.vicinity ?? place.formatted_address ?? "",
        isOpen: place.opening_hours?.open_now ?? false,
        hours: place.opening_hours?.open_now ? "Open now" : "Closed",
        phone: "",
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        photoRef: place.photos?.[0]?.photo_reference ?? null,
      };
    });

  // Sort results
  switch (sort) {
    case "rating":
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
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
 * Get full details for a specific place using Google Place Details API.
 */
export async function getPlaceDetails(
  placeId: string
): Promise<PlaceDetail> {
  const apiKey = getApiKey();

  const fields = [
    "place_id",
    "name",
    "rating",
    "user_ratings_total",
    "geometry",
    "formatted_address",
    "formatted_phone_number",
    "international_phone_number",
    "website",
    "opening_hours",
    "reviews",
    "photos",
  ].join(",");

  const params = new URLSearchParams({
    place_id: placeId,
    fields,
    key: apiKey,
    language: "en",
  });

  const response = await fetch(`${GOOGLE_DETAILS_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Google Place Details API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as GoogleDetailsApiResponse;

  if (data.status === "NOT_FOUND" || data.status === "INVALID_REQUEST") {
    throw new Error(`Place not found: ${placeId}`);
  }

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      `Google API request denied: ${data.error_message ?? "Check API key"}`
    );
  }

  if (data.status !== "OK") {
    throw new Error(`Place details failed with status: ${data.status}`);
  }

  const place = data.result;

  const reviews: PlaceReview[] = (place.reviews ?? [])
    .slice(0, 3)
    .map((review) => ({
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      time: review.relative_time_description,
    }));

  const photoRefs = (place.photos ?? [])
    .slice(0, 3)
    .map((p) => p.photo_reference);

  return {
    placeId: place.place_id,
    name: place.name,
    rating: place.rating ?? 0,
    reviewCount: place.user_ratings_total ?? 0,
    distance: 0,
    distanceUnit: "km",
    address: place.formatted_address ?? "",
    isOpen: place.opening_hours?.open_now ?? false,
    hours: place.opening_hours?.open_now ? "Open now" : "Closed",
    phone: place.international_phone_number ?? place.formatted_phone_number ?? "",
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    photoRef: photoRefs[0] ?? null,
    website: place.website ?? null,
    weekdayHours: place.opening_hours?.weekday_text ?? [],
    reviews,
    photos: photoRefs,
    formattedPhone: place.formatted_phone_number ?? "",
  };
}
