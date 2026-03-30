import type { GeocodeResponse } from "@/types";

const GOOGLE_GEOCODING_URL =
  "https://maps.googleapis.com/maps/api/geocode/json";

interface GoogleGeocodeResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
}

interface GoogleGeocodeApiResponse {
  status: string;
  results: GoogleGeocodeResult[];
  error_message?: string;
}

/**
 * Geocode an area name to lat/lng coordinates using Google Geocoding API.
 * Server-side only — uses the secret API key.
 */
export async function geocodeArea(area: string): Promise<GeocodeResponse> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    address: area,
    key: apiKey,
    region: "in",
    language: "en",
  });

  const response = await fetch(`${GOOGLE_GEOCODING_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Google Geocoding API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as GoogleGeocodeApiResponse;

  if (data.status === "ZERO_RESULTS") {
    throw new Error(`No results found for "${area}"`);
  }

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      `Google API request denied: ${data.error_message ?? "Check API key"}`
    );
  }

  if (data.status === "OVER_QUERY_LIMIT") {
    throw new Error("Google API rate limit exceeded. Please try again later.");
  }

  if (data.status !== "OK" || data.results.length === 0) {
    throw new Error(
      `Geocoding failed with status: ${data.status}`
    );
  }

  const result = data.results[0]!;

  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
    cached: false,
  };
}
