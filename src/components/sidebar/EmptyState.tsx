"use client";

import { SearchX } from "lucide-react";

interface EmptyStateProps {
  category: string;
}

export function EmptyState({ category }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <SearchX className="h-10 w-10 text-text-muted" />
      <div>
        <p className="text-sm font-medium text-text-primary">
          No {category.toLowerCase()} found in this region
        </p>
        <p className="mt-1 text-xs text-text-muted">
          We searched up to 50 km. Try a different area or category.
        </p>
      </div>
    </div>
  );
}
