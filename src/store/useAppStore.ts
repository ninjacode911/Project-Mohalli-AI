import { create } from "zustand";
import type {
  ServiceResult,
  Filters,
  SortOption,
  LatLng,
} from "@/types";
import { SEARCH_CONFIG } from "@/lib/constants/config";

interface AppState {
  // --- Search ---
  searchQuery: string;
  selectedLocation: {
    lat: number;
    lng: number;
    formattedAddress: string;
  } | null;
  recentSearches: string[];
  isSearching: boolean;
  searchError: string | null;

  // --- Discovery ---
  selectedCategory: string | null;
  results: ServiceResult[];
  isDiscovering: boolean;
  discoverError: string | null;
  activeMarkerId: string | null;

  // --- Map ---
  mapCenter: LatLng | null;
  mapZoom: number;

  // --- Filters ---
  filters: Filters;
  sortBy: SortOption;

  // --- Actions ---
  setSearchQuery: (query: string) => void;
  setSelectedLocation: (
    location: { lat: number; lng: number; formattedAddress: string } | null
  ) => void;
  addRecentSearch: (area: string) => void;
  setIsSearching: (searching: boolean) => void;
  setSearchError: (error: string | null) => void;
  clearSearch: () => void;

  setSelectedCategory: (category: string | null) => void;
  setResults: (results: ServiceResult[]) => void;
  setIsDiscovering: (discovering: boolean) => void;
  setDiscoverError: (error: string | null) => void;
  setActiveMarker: (placeId: string | null) => void;

  setMapCenter: (center: LatLng | null) => void;
  setMapZoom: (zoom: number) => void;

  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: Filters = {
  openNow: false,
  minRating: 0,
  radius: SEARCH_CONFIG.defaultRadius,
};

export const useAppStore = create<AppState>((set) => ({
  // --- Search State ---
  searchQuery: "",
  selectedLocation: null,
  recentSearches: [],
  isSearching: false,
  searchError: null,

  // --- Discovery State ---
  selectedCategory: null,
  results: [],
  isDiscovering: false,
  discoverError: null,
  activeMarkerId: null,

  // --- Map State ---
  mapCenter: null,
  mapZoom: 14,

  // --- Filter State ---
  filters: { ...DEFAULT_FILTERS },
  sortBy: "distance",

  // --- Search Actions ---
  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedLocation: (location) =>
    set({
      selectedLocation: location,
      mapCenter: location ? { lat: location.lat, lng: location.lng } : null,
    }),

  addRecentSearch: (area) =>
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s !== area);
      const updated = [area, ...filtered].slice(
        0,
        SEARCH_CONFIG.maxRecentSearches
      );
      return { recentSearches: updated };
    }),

  setIsSearching: (searching) => set({ isSearching: searching }),
  setSearchError: (error) => set({ searchError: error }),

  clearSearch: () =>
    set({
      searchQuery: "",
      selectedLocation: null,
      selectedCategory: null,
      results: [],
      isSearching: false,
      searchError: null,
      discoverError: null,
      activeMarkerId: null,
    }),

  // --- Discovery Actions ---
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setResults: (results) => set({ results }),
  setIsDiscovering: (discovering) => set({ isDiscovering: discovering }),
  setDiscoverError: (error) => set({ discoverError: error }),
  setActiveMarker: (placeId) => set({ activeMarkerId: placeId }),

  // --- Map Actions ---
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),

  // --- Filter Actions ---
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  setSortBy: (sort) => set({ sortBy: sort }),

  resetFilters: () =>
    set({
      filters: { ...DEFAULT_FILTERS },
      sortBy: "distance",
    }),
}));
