import type { AutocompleteSuggestion, LatLng } from "@/types";

const TOMTOM_SEARCH_URL =
  "https://api.tomtom.com/search/2/search";

interface TomTomSearchResult {
  id: string;
  type: string;
  address: {
    freeformAddress: string;
    municipality?: string;
    countrySubdivision?: string;
    localName?: string;
  };
  position: { lat: number; lon: number };
}

interface TomTomSearchApiResponse {
  results: TomTomSearchResult[];
}

/**
 * Get autocomplete suggestions using TomTom Fuzzy Search API.
 */
export async function getAutocompleteSuggestions(
  input: string,
  location?: LatLng
): Promise<AutocompleteSuggestion[]> {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) {
    throw new Error("TOMTOM_API_KEY is not configured");
  }

  const encodedQuery = encodeURIComponent(input);
  let url = `${TOMTOM_SEARCH_URL}/${encodedQuery}.json?key=${apiKey}&countrySet=IN&language=en-US&limit=5&typeahead=true`;

  if (location) {
    url += `&lat=${location.lat}&lon=${location.lng}&radius=50000`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error(
      `TomTom Search API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = (await response.json()) as TomTomSearchApiResponse;

  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.slice(0, 5).map((result) => {
    const mainText =
      result.address.localName ??
      result.address.municipality ??
      result.address.freeformAddress.split(",")[0] ??
      result.address.freeformAddress;

    const secondaryText =
      result.address.freeformAddress !== mainText
        ? result.address.freeformAddress
        : (result.address.countrySubdivision ?? "India");

    return {
      placeId: result.id,
      description: result.address.freeformAddress,
      mainText: mainText.trim(),
      secondaryText: secondaryText.trim(),
    };
  });
}
