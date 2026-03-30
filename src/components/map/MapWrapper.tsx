"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapContainer = dynamic(
  () =>
    import("@/components/map/MapContainer").then((mod) => ({
      default: mod.MapContainer,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
    ),
  }
);

export function MapWrapper() {
  return <MapContainer />;
}
