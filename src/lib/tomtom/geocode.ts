import type { GeocodeResponse } from "@/types";

const TOMTOM_GEOCODE_URL =
  "https://api.tomtom.com/search/2/geocode";

interface TomTomGeocodeResult {
  position: { lat: number; lon: number };
  address: {
    freeformAddress: string;
    municipality?: string;
    countrySubdivision?: string;
    country?: string;
  };
}

interface TomTomGeocodeApiResponse {
  summary: { numResults: number };
  results: TomTomGeocodeResult[];
}

/**
 * Geocode an area name to lat/lng using TomTom Geocoding API.
 */
export async function geocodeArea(area: string): Promise<GeocodeResponse> {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) {
    throw new Error("TOMTOM_API_KEY is not configured");
  }

  const encodedQuery = encodeURIComponent(area);
  const url = `${TOMTOM_GEOCODE_URL}/${encodedQuery}.json?key=${apiKey}&countrySet=IN&language=en-US&limit=1`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("TomTom API key is invalid or expired");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error(
      `TomTom Geocoding API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as TomTomGeocodeApiResponse;

  if (data.summary.numResults === 0 || data.results.length === 0) {
    throw new Error(`No results found for "${area}"`);
  }

  const result = data.results[0]!;

  return {
    lat: result.position.lat,
    lng: result.position.lon,
    formattedAddress: result.address.freeformAddress,
    cached: false,
  };
}
