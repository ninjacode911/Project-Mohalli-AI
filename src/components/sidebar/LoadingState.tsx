"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border px-4 py-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-1 h-3 w-24" />
      </div>

      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex gap-3 border-b border-border px-4 py-3">
          <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
