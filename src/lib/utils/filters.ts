import type { ServiceResult, Filters, SortOption } from "@/types";

/**
 * Apply filters and sorting to a list of results.
 * Returns a new array — never mutates the original.
 */
export function applyFilters(
  results: ServiceResult[],
  filters: Filters,
  sortBy: SortOption
): ServiceResult[] {
  let filtered = [...results];

  // Open now filter
  if (filters.openNow) {
    filtered = filtered.filter((r) => r.isOpen);
  }

  // Minimum rating filter
  if (filters.minRating > 0) {
    filtered = filtered.filter((r) => r.rating >= filters.minRating);
  }

  // Sort
  switch (sortBy) {
    case "rating":
      filtered.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
      break;
    case "reviews":
      filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "distance":
    default:
      filtered.sort((a, b) => a.distance - b.distance);
      break;
  }

  return filtered;
}
