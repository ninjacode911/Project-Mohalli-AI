"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, X, Clock } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppStore } from "@/store/useAppStore";
import { SEARCH_CONFIG } from "@/lib/constants/config";
import type { AutocompleteSuggestion } from "@/types";

export function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedLocation,
    addRecentSearch,
    recentSearches,
    isSearching,
    setIsSearching,
    setSearchError,
    searchError,
  } = useAppStore();

  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(
    searchQuery,
    SEARCH_CONFIG.autocompleteDelay
  );

  const {
    lat: geoLat,
    lng: geoLng,
    loading: geoLoading,
    error: geoError,
    requestLocation,
  } = useGeolocation();

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (debouncedQuery.length < SEARCH_CONFIG.autocompleteMinChars) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    let cancelled = false;

    async function fetchSuggestions() {
      try {
        const response = await fetch("/api/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: debouncedQuery }),
        });

        if (!response.ok) return;

        const data = (await response.json()) as {
          suggestions: AutocompleteSuggestion[];
        };

        if (!cancelled) {
          setSuggestions(data.suggestions);
          setShowDropdown(data.suggestions.length > 0);
          setShowRecent(false);
        }
      } catch {
        // Silently fail — autocomplete is non-critical
      }
    }

    void fetchSuggestions();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Handle geolocation result
  useEffect(() => {
    if (geoLat !== null && geoLng !== null) {
      void handleGeocode(`${geoLat},${geoLng}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoLat, geoLng]);

  // Set geolocation error
  useEffect(() => {
    if (geoError) {
      setSearchError(geoError);
    }
  }, [geoError, setSearchError]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowRecent(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGeocode = useCallback(
    async (area: string) => {
      setIsSearching(true);
      setSearchError(null);
      setShowDropdown(false);
      setShowRecent(false);

      try {
        const response = await fetch("/api/geocode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ area }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error: string };
          throw new Error(errorData.error);
        }

        const data = (await response.json()) as {
          lat: number;
          lng: number;
          formattedAddress: string;
        };

        setSelectedLocation({
          lat: data.lat,
          lng: data.lng,
          formattedAddress: data.formattedAddress,
        });

        setSearchQuery(data.formattedAddress);
        addRecentSearch(area);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        setSearchError(message);
      } finally {
        setIsSearching(false);
      }
    },
    [
      setIsSearching,
      setSearchError,
      setSelectedLocation,
      setSearchQuery,
      addRecentSearch,
    ]
  );

  const handleSelectSuggestion = (suggestion: AutocompleteSuggestion) => {
    setSearchQuery(suggestion.description);
    setSuggestions([]);
    setShowDropdown(false);
    void handleGeocode(suggestion.description);
  };

  const handleSelectRecent = (area: string) => {
    setSearchQuery(area);
    setShowRecent(false);
    void handleGeocode(area);
  };

  const handleSubmit = () => {
    if (searchQuery.trim().length >= 2) {
      void handleGeocode(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    setShowRecent(false);
    setSearchError(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = showRecent ? recentSearches : suggestions;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        if (showRecent && recentSearches[activeIndex]) {
          handleSelectRecent(recentSearches[activeIndex]);
        } else if (suggestions[activeIndex]) {
          handleSelectSuggestion(suggestions[activeIndex]);
        }
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setShowRecent(false);
      setActiveIndex(-1);
    }
  };

  const handleFocus = () => {
    if (
      searchQuery.length === 0 &&
      recentSearches.length > 0 &&
      suggestions.length === 0
    ) {
      setShowRecent(true);
    }
  };

  const dropdownVisible =
    showDropdown || (showRecent && recentSearches.length > 0);

  return (
    <div className="relative w-full max-w-xl">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveIndex(-1);
              if (e.target.value.length === 0 && recentSearches.length > 0) {
                setShowRecent(true);
                setShowDropdown(false);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            placeholder="Enter your area, society, or PIN code..."
            className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search for a location"
            aria-expanded={dropdownVisible}
            aria-haspopup="listbox"
            aria-controls="search-suggestions"
            aria-activedescendant={
              activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
            }
            autoComplete="off"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Location Button */}
        <button
          onClick={requestLocation}
          disabled={geoLoading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          aria-label="Use my current location"
          title="Use my current location"
        >
          {geoLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </button>

        {/* Discover Button */}
        <button
          onClick={handleSubmit}
          disabled={isSearching || searchQuery.trim().length < 2}
          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Discover</span>
        </button>
      </div>

      {/* Error Message */}
      {searchError && (
        <p className="mt-2 text-center text-xs text-error">{searchError}</p>
      )}

      {/* Dropdown */}
      {dropdownVisible && (
        <div
          ref={dropdownRef}
          id="search-suggestions"
          className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
          role="listbox"
          aria-label="Search suggestions"
        >
          {/* Recent Searches */}
          {showRecent &&
            recentSearches.map((area, index) => (
              <button
                key={`recent-${area}`}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                onClick={() => handleSelectRecent(area)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                  activeIndex === index ? "bg-muted" : ""
                }`}
              >
                <Clock className="h-4 w-4 shrink-0 text-text-muted" />
                <span className="truncate text-text-primary">{area}</span>
              </button>
            ))}

          {/* Autocomplete Suggestions */}
          {showDropdown &&
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion.placeId}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                  activeIndex === index ? "bg-muted" : ""
                }`}
              >
                <MapPin className="h-4 w-4 shrink-0 text-text-muted" />
                <div className="min-w-0">
                  <span className="font-medium text-text-primary">
                    {suggestion.mainText}
                  </span>
                  <span className="ml-1 text-text-secondary">
                    {suggestion.secondaryText}
                  </span>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
