import type { AutocompleteSuggestion, LatLng } from "@/types";

const GOOGLE_AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";

interface GoogleAutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GoogleAutocompleteApiResponse {
  status: string;
  predictions: GoogleAutocompletePrediction[];
  error_message?: string;
}

/**
 * Get autocomplete suggestions for a search input using Google Places Autocomplete API.
 * Server-side only — uses the secret API key.
 */
export async function getAutocompleteSuggestions(
  input: string,
  location?: LatLng
): Promise<AutocompleteSuggestion[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const params = new URLSearchParams({
    input,
    key: apiKey,
    components: "country:in",
    language: "en",
    types: "geocode|locality|sublocality|neighborhood",
  });

  if (location) {
    params.set("location", `${location.lat},${location.lng}`);
    params.set("radius", "50000");
  }

  const response = await fetch(
    `${GOOGLE_AUTOCOMPLETE_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Google Autocomplete API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as GoogleAutocompleteApiResponse;

  if (data.status === "REQUEST_DENIED") {
    throw new Error(
      `Google API request denied: ${data.error_message ?? "Check API key"}`
    );
  }

  if (data.status === "OVER_QUERY_LIMIT") {
    throw new Error("Google API rate limit exceeded. Please try again later.");
  }

  if (data.status === "ZERO_RESULTS" || data.predictions.length === 0) {
    return [];
  }

  if (data.status !== "OK") {
    throw new Error(`Autocomplete failed with status: ${data.status}`);
  }

  return data.predictions.slice(0, 5).map((prediction) => ({
    placeId: prediction.place_id,
    description: prediction.description,
    mainText: prediction.structured_formatting.main_text,
    secondaryText: prediction.structured_formatting.secondary_text,
  }));
}
