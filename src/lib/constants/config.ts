// ============================================================
// Mohalla AI — Application Configuration
// ============================================================

export const APP_CONFIG = {
  name: "Mohalla AI",
  tagline: "Find trusted services in your neighbourhood",
  subtitle: "Plumbers, pharmacies, mechanics & more — one search away",
  version: "1.0.0",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

export const SEARCH_CONFIG = {
  /** Default search radius in meters */
  defaultRadius: 3000,
  /** Minimum search radius in meters */
  minRadius: 100,
  /** Maximum search radius in meters */
  maxRadius: 50000,
  /** Radius options shown in the UI (meters) */
  radiusOptions: [1000, 2000, 3000, 5000],
  /** Debounce delay for autocomplete in ms */
  autocompleteDelay: 300,
  /** Minimum characters before triggering autocomplete */
  autocompleteMinChars: 2,
  /** Maximum recent searches to store */
  maxRecentSearches: 10,
} as const;

export const MAP_CONFIG = {
  /** Default zoom level for neighbourhood view */
  defaultZoom: 14,
  /** Zoom level when a specific result is focused */
  focusZoom: 16,
  /** TomTom API key for map tiles (client-side) */
  apiKey: process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "",
} as const;

export const CACHE_CONFIG = {
  /** Geocode cache TTL in seconds (30 days) */
  geocodeTtl: 30 * 24 * 60 * 60,
  /** Discover cache TTL in seconds (24 hours) */
  discoverTtl: 24 * 60 * 60,
  /** Place details cache TTL in seconds (24 hours) */
  detailsTtl: 24 * 60 * 60,
  /** Popular areas cache TTL in seconds (1 hour) */
  popularTtl: 60 * 60,
} as const;

export const RATING_OPTIONS = [0, 3.0, 3.5, 4.0, 4.5] as const;

export const SORT_OPTIONS = [
  { value: "distance" as const, label: "Nearest first" },
  { value: "rating" as const, label: "Highest rated" },
  { value: "reviews" as const, label: "Most reviewed" },
] as const;

export const POPULAR_AREAS = [
  { name: "Wakad", city: "Pune" },
  { name: "Baner", city: "Pune" },
  { name: "Kothrud", city: "Pune" },
  { name: "Hinjewadi", city: "Pune" },
  { name: "Viman Nagar", city: "Pune" },
] as const;
