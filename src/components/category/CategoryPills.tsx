"use client";

import { useRef, useCallback } from "react";
import {
  Wrench,
  Zap,
  Car,
  Pill,
  ShoppingCart,
  Stethoscope,
  Scissors,
  Shirt,
  UtensilsCrossed,
  Dumbbell,
  Fuel,
  Landmark,
  Hammer,
  Paintbrush,
  Bug,
  Snowflake,
  SmilePlus,
  PawPrint,
  HardHat,
  Monitor,
  GraduationCap,
  Package,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/constants/categories";
import { useAppStore } from "@/store/useAppStore";

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Car,
  Pill,
  ShoppingCart,
  Stethoscope,
  Scissors,
  Shirt,
  UtensilsCrossed,
  Dumbbell,
  Fuel,
  Landmark,
  Hammer,
  Paintbrush,
  Bug,
  Snowflake,
  SmilePlus,
  PawPrint,
  HardHat,
  Monitor,
  GraduationCap,
  Package,
  Ruler,
};

export function CategoryPills() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);
  const setResults = useAppStore((s) => s.setResults);
  const setIsDiscovering = useAppStore((s) => s.setIsDiscovering);
  const setDiscoverError = useAppStore((s) => s.setDiscoverError);
  const filters = useAppStore((s) => s.filters);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSelectCategory = useCallback(async (categoryId: string) => {
    if (!selectedLocation) return;

    // Cancel any in-flight request to prevent race conditions
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSelectedCategory(categoryId);
    setIsDiscovering(true);
    setDiscoverError(null);

    try {
      const response = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          category: categoryId,
          radius: filters.radius,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error);
      }

      const data = (await response.json()) as {
        results: import("@/types").ServiceResult[];
      };

      setResults(data.results);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const message =
        error instanceof Error
          ? error.message
          : "Failed to discover services. Please try again.";
      setDiscoverError(message);
      setResults([]);
    } finally {
      if (!controller.signal.aborted) {
        setIsDiscovering(false);
      }
    }
  }, [selectedLocation, filters.radius, setSelectedCategory, setIsDiscovering, setDiscoverError, setResults]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center border-b border-border bg-background px-2">
      {/* Left scroll button */}
      <button
        onClick={() => scroll("left")}
        className="hidden shrink-0 items-center justify-center rounded-full p-1 text-text-muted hover:bg-muted hover:text-text-primary lg:flex"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Scrollable pills */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto px-2 py-2 scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon];
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => void handleSelectCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary"
              }`}
              aria-pressed={isActive}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll("right")}
        className="hidden shrink-0 items-center justify-center rounded-full p-1 text-text-muted hover:bg-muted hover:text-text-primary lg:flex"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
