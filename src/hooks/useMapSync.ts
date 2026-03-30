"use client";

import { useCallback, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

/**
 * Bidirectional card-map sync hook.
 * Debounces hover events to avoid excessive store updates.
 */
export function useMapSync() {
  const setActiveMarker = useAppStore((s) => s.setActiveMarker);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCardHover = useCallback(
    (placeId: string | null) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      hoverTimerRef.current = setTimeout(() => {
        setActiveMarker(placeId);
      }, 50);
    },
    [setActiveMarker]
  );

  const handleCardClick = useCallback(
    (placeId: string) => {
      setActiveMarker(placeId);
    },
    [setActiveMarker]
  );

  const scrollToCard = useCallback((placeId: string) => {
    const card = document.getElementById(`result-card-${placeId}`);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return { handleCardHover, handleCardClick, scrollToCard };
}
