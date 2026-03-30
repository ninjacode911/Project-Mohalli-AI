"use client";

import Link from "next/link";
import { SearchBar } from "@/components/search/SearchBar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAppStore } from "@/store/useAppStore";
import { APP_CONFIG } from "@/lib/constants/config";

export function TopBar() {
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const clearSearch = useAppStore((s) => s.clearSearch);

  const handleLogoClick = () => {
    clearSearch();
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo — resets to home */}
      <Link
        href="/"
        onClick={handleLogoClick}
        className="flex shrink-0 items-center gap-1.5"
        aria-label={`${APP_CONFIG.name} home`}
      >
        <span className="font-heading text-lg font-extrabold tracking-tight text-primary">
          {APP_CONFIG.name}
        </span>
      </Link>

      {/* Search Bar */}
      <div className="flex flex-1 justify-center">
        <SearchBar />
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-2">
        {selectedLocation && (
          <span className="hidden max-w-[180px] truncate text-xs text-text-secondary sm:block">
            {selectedLocation.formattedAddress}
          </span>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
