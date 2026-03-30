"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useMapSync } from "@/hooks/useMapSync";
import { ResultCard } from "./ResultCard";
import { CardDetail } from "./CardDetail";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { SortDropdown } from "@/components/filters/SortDropdown";
import { applyFilters } from "@/lib/utils/filters";
import { CATEGORY_MAP } from "@/lib/constants/categories";

export function Sidebar() {
  const results = useAppStore((s) => s.results);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const isDiscovering = useAppStore((s) => s.isDiscovering);
  const activeMarkerId = useAppStore((s) => s.activeMarkerId);
  const filters = useAppStore((s) => s.filters);
  const sortBy = useAppStore((s) => s.sortBy);

  const [detailPlaceId, setDetailPlaceId] = useState<string | null>(null);
  const { handleCardHover, handleCardClick } = useMapSync();

  // Apply client-side filters and sorting
  const filteredResults = useMemo(
    () => applyFilters(results, filters, sortBy),
    [results, filters, sortBy]
  );

  // Detail view
  if (detailPlaceId) {
    return (
      <CardDetail
        placeId={detailPlaceId}
        onBack={() => setDetailPlaceId(null)}
      />
    );
  }

  // No category selected
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

  // Loading
  if (isDiscovering) {
    return <LoadingState />;
  }

  const categoryName =
    CATEGORY_MAP.get(selectedCategory)?.name ?? selectedCategory;
  const areaName = selectedLocation?.formattedAddress ?? "";

  // No results at all
  if (results.length === 0) {
    return <EmptyState category={categoryName} />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Results header */}
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-text-primary">
          {categoryName} near {areaName.split(",")[0]}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">
          {filteredResults.length} of {results.length} result
          {results.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <FilterPanel />

      {/* Sort */}
      <SortDropdown />

      {/* Result cards */}
      {filteredResults.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <div>
            <p className="text-sm font-medium text-text-primary">
              No results match your filters
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Try adjusting your filters to see more results
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredResults.map((result, index) => (
            <ResultCard
              key={result.placeId}
              result={result}
              index={index}
              isActive={activeMarkerId === result.placeId}
              onHover={handleCardHover}
              onClick={handleCardClick}
              onViewDetails={setDetailPlaceId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
