"use client";

import { useAppStore } from "@/store/useAppStore";
import { RATING_OPTIONS, SEARCH_CONFIG } from "@/lib/constants/config";
import { X } from "lucide-react";

export function FilterPanel() {
  const filters = useAppStore((s) => s.filters);
  const setFilter = useAppStore((s) => s.setFilter);
  const resetFilters = useAppStore((s) => s.resetFilters);

  const activeCount =
    (filters.openNow ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.radius !== SEARCH_CONFIG.defaultRadius ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2">
      {/* Open Now toggle */}
      <button
        onClick={() => setFilter("openNow", !filters.openNow)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          filters.openNow
            ? "bg-success/10 text-success border border-success/30"
            : "border border-border text-text-secondary hover:border-primary hover:text-primary"
        }`}
      >
        Open Now
      </button>

      {/* Rating filter */}
      <select
        value={filters.minRating}
        onChange={(e) => setFilter("minRating", Number(e.target.value))}
        className="rounded-full border border-border bg-transparent px-3 py-1 text-xs font-medium text-text-secondary focus:border-primary focus:outline-none"
      >
        <option value={0}>Any Rating</option>
        {RATING_OPTIONS.filter((r) => r > 0).map((rating) => (
          <option key={rating} value={rating}>
            {rating}+ Stars
          </option>
        ))}
      </select>

      {/* Radius filter */}
      <select
        value={filters.radius}
        onChange={(e) => setFilter("radius", Number(e.target.value))}
        className="rounded-full border border-border bg-transparent px-3 py-1 text-xs font-medium text-text-secondary focus:border-primary focus:outline-none"
      >
        {SEARCH_CONFIG.radiusOptions.map((r) => (
          <option key={r} value={r}>
            {r >= 1000 ? `${r / 1000} km` : `${r}m`}
          </option>
        ))}
      </select>

      {/* Clear all */}
      {activeCount > 0 && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-text-muted hover:text-error"
        >
          <X className="h-3 w-3" />
          Clear ({activeCount})
        </button>
      )}
    </div>
  );
}
