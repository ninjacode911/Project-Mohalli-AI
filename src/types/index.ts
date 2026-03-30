// ============================================================
// Mohalla AI — Core Type Definitions
// ============================================================

// --- Geocoding ---
export interface GeocodeRequest {
  area: string;
}

export interface GeocodeResponse {
  lat: number;
  lng: number;
  formattedAddress: string;
  cached: boolean;
}

// --- Autocomplete ---
export interface AutocompleteRequest {
  input: string;
  location?: LatLng;
}

export interface AutocompleteSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

// --- Location ---
export interface LatLng {
  lat: number;
  lng: number;
}

// --- Categories ---
export interface Category {
  id: string;
  name: string;
  icon: string;
  googleTypes: string[];
  fallbackKeyword: string;
}

// --- Service Discovery ---
export interface DiscoverRequest {
  lat: number;
  lng: number;
  category: string;
  radius?: number;
  sort?: SortOption;
}

export type SortOption = "distance" | "rating" | "reviews";

export interface ServiceResult {
  placeId: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: number;
  distanceUnit: string;
  address: string;
  isOpen: boolean;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
  photoRef: string | null;
}

export interface DiscoverResponse {
  results: ServiceResult[];
  meta: {
    area: string;
    category: string;
    radius: number;
    totalResults: number;
    cached: boolean;
    cacheAge?: string;
  };
}

// --- Place Details ---
export interface PlaceReview {
  author: string;
  rating: number;
  text: string;
  time: string;
}

export interface PlaceDetail extends ServiceResult {
  website: string | null;
  weekdayHours: string[];
  reviews: PlaceReview[];
  photos: string[];
  formattedPhone: string;
}

// --- Filters ---
export interface Filters {
  openNow: boolean;
  minRating: number;
  radius: number;
}

// --- App State ---
export interface SearchState {
  searchQuery: string;
  selectedLocation: {
    lat: number;
    lng: number;
    formattedAddress: string;
  } | null;
  recentSearches: string[];
  isSearching: boolean;
  searchError: string | null;
}

export interface DiscoveryState {
  selectedCategory: string | null;
  results: ServiceResult[];
  isDiscovering: boolean;
  discoverError: string | null;
  activeMarkerId: string | null;
}

export interface MapState {
  mapCenter: LatLng | null;
  mapZoom: number;
}

export interface FilterState {
  filters: Filters;
  sortBy: SortOption;
}
