"use client";

import { MapWrapper } from "@/components/map/MapWrapper";
import { MobileBottomSheet } from "@/components/layout/MobileBottomSheet";
import { useAppStore } from "@/store/useAppStore";
import { Loader2 } from "lucide-react";

interface DiscoverLayoutProps {
  sidebar: React.ReactNode;
}

/**
 * Split-panel layout:
 * - Desktop (lg+): sidebar (370px left) + map (remaining right)
 * - Mobile (<lg): fullscreen map + bottom sheet overlay
 */
export function DiscoverLayout({ sidebar }: DiscoverLayoutProps) {
  const isDiscovering = useAppStore((s) => s.isDiscovering);
  const discoverError = useAppStore((s) => s.discoverError);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-[370px] shrink-0 flex-col border-r border-border bg-background lg:flex">
        {isDiscovering && (
          <div className="flex items-center justify-center gap-2 border-b border-border bg-surface px-4 py-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs text-text-secondary">
              Searching nearby services...
            </span>
          </div>
        )}

        {discoverError && (
          <div className="border-b border-error/20 bg-error/5 px-4 py-3">
            <p className="text-xs text-error">{discoverError}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{sidebar}</div>
      </aside>

      {/* Map panel */}
      <div className="relative flex-1">
        <MapWrapper />

        {/* Mobile: discovering indicator overlay */}
        {isDiscovering && (
          <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-4 py-2 shadow-md backdrop-blur lg:hidden">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs text-text-secondary">Searching...</span>
          </div>
        )}

        {/* Mobile: error banner */}
        {discoverError && (
          <div className="absolute left-4 right-4 top-4 z-10 rounded-lg border border-error/20 bg-error/10 px-4 py-2 backdrop-blur lg:hidden">
            <p className="text-xs text-error">{discoverError}</p>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <MobileBottomSheet />
    </div>
  );
}
