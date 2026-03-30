import { APP_CONFIG, POPULAR_AREAS } from "@/lib/constants/config";
import { CATEGORIES } from "@/lib/constants/categories";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
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

        {/* Search placeholder (Phase 1A) */}
        <div className="w-full max-w-lg">
          <div className="flex h-12 items-center rounded-full border border-border bg-surface px-4 text-text-muted shadow-sm">
            <svg
              className="mr-3 h-5 w-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-sm">
              Enter your area, society, or PIN code...
            </span>
          </div>
        </div>

        {/* Popular Areas */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Popular Areas
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_AREAS.map((area) => (
              <span
                key={area.name}
                className="cursor-pointer rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
              >
                {area.name}, {area.city}
              </span>
            ))}
          </div>
        </div>

        {/* Category Preview */}
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
