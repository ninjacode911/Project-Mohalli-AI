"use client";

import { useState, useRef, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChevronUp } from "lucide-react";

type SnapPosition = "collapsed" | "half" | "expanded";

const SNAP_HEIGHTS: Record<SnapPosition, string> = {
  collapsed: "80px",
  half: "50vh",
  expanded: "85vh",
};

export function MobileBottomSheet() {
  const [snap, setSnap] = useState<SnapPosition>("collapsed");
  const results = useAppStore((s) => s.results);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const touchStartY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartY.current = touch.clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaY = touchStartY.current - touch.clientY;
      const threshold = 50;

      if (deltaY > threshold) {
        // Swipe up
        if (snap === "collapsed") setSnap("half");
        else if (snap === "half") setSnap("expanded");
      } else if (deltaY < -threshold) {
        // Swipe down
        if (snap === "expanded") setSnap("half");
        else if (snap === "half") setSnap("collapsed");
      }
    },
    [snap]
  );

  const toggleSnap = () => {
    if (snap === "collapsed") setSnap("half");
    else if (snap === "half") setSnap("expanded");
    else setSnap("collapsed");
  };

  const resultCount = results.length;

  return (
    <div
      ref={sheetRef}
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col rounded-t-2xl border-t border-border bg-background shadow-2xl transition-all duration-300 ease-out lg:hidden"
      style={{ height: SNAP_HEIGHTS[snap] }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drag handle + header */}
      <button
        onClick={toggleSnap}
        className="flex w-full flex-col items-center gap-1 px-4 pb-2 pt-3"
        aria-label="Toggle results panel"
      >
        <div className="h-1 w-8 rounded-full bg-text-muted/40" />
        <div className="flex w-full items-center justify-between">
          <span className="text-xs font-semibold text-text-primary">
            {selectedCategory
              ? `${resultCount} result${resultCount !== 1 ? "s" : ""}`
              : "Select a category"}
          </span>
          <ChevronUp
            className={`h-4 w-4 text-text-muted transition-transform ${
              snap === "expanded" ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <Sidebar />
      </div>
    </div>
  );
}
