"use client";

import { TopBar } from "@/components/layout/TopBar";
import { CategoryPills } from "@/components/category/CategoryPills";
import { DiscoverLayout } from "@/components/layout/DiscoverLayout";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useAppStore } from "@/store/useAppStore";
import { APP_CONFIG, POPULAR_AREAS } from "@/lib/constants/config";
import { CATEGORIES } from "@/lib/constants/categories";

export default function Home() {
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);

  // After search: show map + category discovery view
  if (selectedLocation) {
    return (
      <div className="flex h-screen flex-col">
        <TopBar />
        <CategoryPills />
        <DiscoverLayout sidebar={<Sidebar />} />
      </div>
    );
  }

  // Before search: landing page with hero
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-16">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            {APP_CONFIG.name}
          </h1>
          <p className="text-lg font-medium text-text-primary sm:text-xl">
            {APP_CONFIG.tagline}
          </p>
          <p className="max-w-md text-sm text-text-secondary">
            {APP_CONFIG.subtitle}
          </p>
        </div>

        {/* Popular Areas */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Popular Areas
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_AREAS.map((area) => (
              <button
                key={area.name}
                onClick={() =>
                  setSearchQuery(`${area.name}, ${area.city}`)
                }
                className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
              >
                {area.name}, {area.city}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Preview */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {CATEGORIES.length} Service Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <span
                key={cat.id}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary"
              >
                {cat.name}
              </span>
            ))}
            <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-muted">
              +{CATEGORIES.length - 6} more
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
