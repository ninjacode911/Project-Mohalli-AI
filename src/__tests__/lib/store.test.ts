import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/store/useAppStore";

describe("useAppStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAppStore.setState({
      searchQuery: "",
      selectedLocation: null,
      recentSearches: [],
      isSearching: false,
      searchError: null,
      selectedCategory: null,
      results: [],
      isDiscovering: false,
      discoverError: null,
      activeMarkerId: null,
      mapCenter: null,
      mapZoom: 14,
      filters: { openNow: false, minRating: 0, radius: 3000 },
      sortBy: "distance",
    });
  });

  it("has correct initial state", () => {
    const state = useAppStore.getState();
    expect(state.searchQuery).toBe("");
    expect(state.selectedLocation).toBeNull();
    expect(state.recentSearches).toEqual([]);
    expect(state.isSearching).toBe(false);
    expect(state.filters.radius).toBe(3000);
    expect(state.sortBy).toBe("distance");
  });

  it("setSearchQuery updates query", () => {
    useAppStore.getState().setSearchQuery("Wakad");
    expect(useAppStore.getState().searchQuery).toBe("Wakad");
  });

  it("setSelectedLocation updates location and map center", () => {
    useAppStore.getState().setSelectedLocation({
      lat: 18.59,
      lng: 73.77,
      formattedAddress: "Wakad, Pune",
    });

    const state = useAppStore.getState();
    expect(state.selectedLocation?.lat).toBe(18.59);
    expect(state.mapCenter?.lat).toBe(18.59);
    expect(state.mapCenter?.lng).toBe(73.77);
  });

  it("addRecentSearch adds to front and deduplicates", () => {
    const { addRecentSearch } = useAppStore.getState();

    addRecentSearch("Wakad, Pune");
    addRecentSearch("Baner, Pune");
    addRecentSearch("Wakad, Pune"); // duplicate

    const { recentSearches } = useAppStore.getState();
    expect(recentSearches).toEqual(["Wakad, Pune", "Baner, Pune"]);
  });

  it("addRecentSearch limits to maxRecentSearches", () => {
    const { addRecentSearch } = useAppStore.getState();

    for (let i = 0; i < 15; i++) {
      addRecentSearch(`Area ${i}`);
    }

    const { recentSearches } = useAppStore.getState();
    expect(recentSearches.length).toBeLessThanOrEqual(10);
    expect(recentSearches[0]).toBe("Area 14"); // most recent first
  });

  it("clearSearch resets search state", () => {
    const store = useAppStore.getState();
    store.setSearchQuery("Wakad");
    store.setSelectedLocation({
      lat: 18.59,
      lng: 73.77,
      formattedAddress: "Wakad",
    });
    store.setSelectedCategory("plumber");
    store.setSearchError("test error");

    useAppStore.getState().clearSearch();

    const state = useAppStore.getState();
    expect(state.searchQuery).toBe("");
    expect(state.selectedLocation).toBeNull();
    expect(state.selectedCategory).toBeNull();
    expect(state.searchError).toBeNull();
    expect(state.results).toEqual([]);
  });

  it("setFilter updates individual filter", () => {
    useAppStore.getState().setFilter("openNow", true);
    expect(useAppStore.getState().filters.openNow).toBe(true);

    useAppStore.getState().setFilter("minRating", 4.0);
    expect(useAppStore.getState().filters.minRating).toBe(4.0);

    // Other filters unchanged
    expect(useAppStore.getState().filters.openNow).toBe(true);
  });

  it("resetFilters restores defaults", () => {
    const store = useAppStore.getState();
    store.setFilter("openNow", true);
    store.setFilter("minRating", 4.5);
    store.setSortBy("rating");

    useAppStore.getState().resetFilters();

    const state = useAppStore.getState();
    expect(state.filters.openNow).toBe(false);
    expect(state.filters.minRating).toBe(0);
    expect(state.filters.radius).toBe(3000);
    expect(state.sortBy).toBe("distance");
  });
});
