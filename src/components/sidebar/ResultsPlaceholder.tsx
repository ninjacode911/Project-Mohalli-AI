"use client";

import { useAppStore } from "@/store/useAppStore";
import { MapPin, Star, Phone } from "lucide-react";

/**
 * Temporary results list for Phase 1B.
 * Will be replaced by full ResultCard component in Phase 1C.
 */
export function ResultsPlaceholder() {
  const results = useAppStore((s) => s.results);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const activeMarkerId = useAppStore((s) => s.activeMarkerId);
  const setActiveMarker = useAppStore((s) => s.setActiveMarker);

  if (!selectedCategory) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Select a category
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Choose a service category above to discover nearby options
          </p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <div>
          <p className="text-sm font-medium text-text-primary">
            No results found
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Try expanding your search radius or searching a different area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Results header */}
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-medium text-text-secondary">
          {results.length} result{results.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Result cards */}
      <div className="flex flex-col">
        {results.map((result, index) => (
          <button
            key={result.placeId}
            onClick={() => setActiveMarker(result.placeId)}
            onMouseEnter={() => setActiveMarker(result.placeId)}
            onMouseLeave={() => setActiveMarker(null)}
            className={`flex items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted ${
              activeMarkerId === result.placeId ? "bg-muted" : ""
            }`}
          >
            {/* Number badge */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              {/* Name */}
              <p className="truncate text-sm font-medium text-text-primary">
                {result.name}
              </p>

              {/* Rating + reviews */}
              <div className="mt-0.5 flex items-center gap-2">
                {result.rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-text-primary">
                      {result.rating}
                    </span>
                    <span className="text-xs text-text-muted">
                      ({result.reviewCount})
                    </span>
                  </div>
                )}

                {/* Distance */}
                <span className="text-xs text-text-muted">
                  {result.distance} {result.distanceUnit}
                </span>
              </div>

              {/* Address */}
              <div className="mt-1 flex items-start gap-1">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-text-muted" />
                <p className="truncate text-xs text-text-secondary">
                  {result.address}
                </p>
              </div>

              {/* Open/Closed indicator */}
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    result.isOpen ? "bg-success" : "bg-error"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    result.isOpen ? "text-success" : "text-error"
                  }`}
                >
                  {result.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              {/* Phone (if available) */}
              {result.phone && (
                <a
                  href={`tel:${result.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  {result.phone}
                </a>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
