"use client";

import { useAppStore } from "@/store/useAppStore";
import { SORT_OPTIONS } from "@/lib/constants/config";
import { ArrowUpDown } from "lucide-react";

export function SortDropdown() {
  const sortBy = useAppStore((s) => s.sortBy);
  const setSortBy = useAppStore((s) => s.setSortBy);

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
      <ArrowUpDown className="h-3.5 w-3.5 text-text-muted" />
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        className="bg-transparent text-xs font-medium text-text-secondary focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
