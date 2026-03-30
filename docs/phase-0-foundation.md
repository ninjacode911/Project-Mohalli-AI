# Phase 0: Foundation

**Status:** Complete
**Timeline:** Week 1-2
**Objective:** Set up the entire project infrastructure, toolchain, design system, CI/CD pipeline, and foundational architecture before any feature development begins.

---

## What Was Built

### 1. Project Scaffold

- **Framework:** Next.js 16.2.1 with App Router, React 19, TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 with PostCSS, `tw-animate-css` for animations
- **UI Components:** shadcn/ui (button, badge, card, dialog, dropdown-menu, input, skeleton, tooltip)
- **Package Manager:** pnpm with lockfile
- **Monorepo Config:** `pnpm-workspace.yaml` with build dependency exclusions

### 2. TypeScript Configuration (`tsconfig.json`)

| Setting | Value | Why |
|---------|-------|-----|
| `strict` | `true` | Enforces type safety across the entire codebase |
| `noUncheckedIndexedAccess` | `true` | Prevents undefined access on arrays/objects |
| `module` | `esnext` | ES Modules — no CommonJS |
| `moduleResolution` | `bundler` | Works with Next.js Turbopack |
| Path alias `@/*` | `./src/*` | Clean imports like `@/lib/utils` |

### 3. ESLint & Prettier

**ESLint** (`eslint.config.mjs`):
- `eslint-config-next/core-web-vitals` — Next.js recommended rules
- `eslint-config-next/typescript` — TypeScript-specific rules
- `@typescript-eslint/no-explicit-any: "error"` — **Enforced zero `any` types**

**Prettier** (`.prettierrc`):
- Consistent formatting with Tailwind CSS plugin for class sorting

### 4. Design System (`src/app/globals.css`)

Brand colors from the HelpNear project plan, applied as CSS custom properties:

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--primary` | `#D4541B` (brand orange) | `#D4541B` |
| `--background` | `#FAF9F6` (warm white) | `#0F1117` (dark navy) |
| `--surface` | `#FFFFFF` | `#1A1C28` |
| `--text-primary` | `#1A1A1A` | `#E4E4E7` |
| `--text-secondary` | `#4A4A4A` | `#8A8D9A` |

**Typography:**
| Usage | Font | CSS Variable |
|-------|------|-------------|
| Headings | Plus Jakarta Sans | `--font-heading` |
| Body | Space Grotesk | `--font-sans` |
| Data/Code | JetBrains Mono | `--font-mono` |

**Theme Support:** `next-themes` with system/light/dark modes. `ThemeToggle` component cycles between all three.

### 5. Database Schema (`prisma/schema.prisma`)

Three MVP tables using Prisma ORM with PostgreSQL:

```
GeocodeCache   — Persistent geocoding results (30-day TTL)
  Fields: id, areaText, lat, lng, formattedAddress, createdAt, expiresAt

SearchLog      — Analytics for every search performed
  Fields: id, areaText, lat, lng, category, resultsCount, userAgent, timestamp

PopularArea    — Auto-populated "Popular Areas" suggestions
  Fields: id, areaName, city, state, lat, lng, searchCount, lastSearched
```

**Note:** Database is optional for MVP. When `DATABASE_URL` is not set, analytics are disabled gracefully — the app still works fully.

### 6. Caching Layer (`src/lib/cache/redis.ts`)

- **In-memory Map-based cache** for development and when Redis isn't configured
- **TTL-based expiration** — entries auto-expire
- **Cache key generators:** `geocodeKey()`, `discoverKey()`, `detailsKey()`
- **Ready for upgrade** to Upstash Redis when `REDIS_URL` is configured (TODO comments in place)

Cache TTLs:
| Data | TTL |
|------|-----|
| Geocode results | 30 days |
| Discover results | 24 hours |
| Place details | 24 hours |
| Popular areas | 1 hour |

### 7. CI/CD Pipeline (`.github/workflows/ci.yml`)

Four sequential jobs triggered on push/PR to `main` or `develop`:

```
lint-and-typecheck → test → build → e2e (PRs only)
```

| Job | What it does |
|-----|-------------|
| `lint-and-typecheck` | ESLint + TypeScript strict check |
| `test` | Vitest unit/integration tests with coverage upload |
| `build` | Next.js production build (catches SSR/build errors) |
| `e2e` | Playwright browser tests (only on pull requests) |

**Tooling:** pnpm v10, Node.js 20, actions/checkout@v4, pnpm/action-setup@v4

### 8. Environment Configuration

**`.env.example`** — Template with all required variables:
| Variable | Scope | Purpose |
|----------|-------|---------|
| `TOMTOM_API_KEY` | Server | Geocoding, search, place details |
| `NEXT_PUBLIC_TOMTOM_API_KEY` | Client | Map tile rendering |
| `REDIS_URL` | Server | Cache (optional) |
| `DATABASE_URL` | Server | Analytics (optional) |
| `NEXT_PUBLIC_APP_URL` | Client | App URL for sitemap/robots |
| `SENTRY_DSN` | Server | Error monitoring (optional) |

**`.env.local`** — Git-ignored, developer fills in real keys.

### 9. Security Headers (`vercel.json`)

Production security headers applied to all routes:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` |
| `X-DNS-Prefetch-Control` | `on` |

### 10. Testing Framework

**Vitest** (`vitest.config.ts`):
- jsdom environment for React component testing
- Coverage via V8 provider (text, HTML, LCOV reporters)
- Path aliases matching `tsconfig.json`
- Setup file at `src/__tests__/setup.ts`

**Playwright** (`playwright.config.ts`):
- E2E browser tests for Chrome
- Configured for CI with retries

### 11. SEO & PWA

| File | Purpose |
|------|---------|
| `src/app/robots.ts` | Allows all crawlers, blocks `/api/` routes |
| `src/app/sitemap.ts` | Generates area+category combination URLs for indexing |
| `public/manifest.json` | PWA installability (standalone, portrait, brand colors) |
| `layout.tsx` metadata | OpenGraph tags, Apple Web App config, manifest link |

### 12. `.gitignore`

Comprehensive coverage:
- `node_modules/`, `.next/`, `build/`, `dist/`
- All `.env` variants (`.env`, `.env.local`, `.env.*.local`)
- `coverage/`, `playwright-report/`, `test-results/`
- `*.pem`, `*.tsbuildinfo`, IDE files

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **TomTom over Google Maps** | Free tier more generous, single API key for all services, no billing required for development |
| **Leaflet for map rendering** | Open-source, no API key needed for basic tiles, SSR-compatible with dynamic import |
| **In-memory cache first** | Zero infrastructure needed to start — upgrade to Redis later without code changes |
| **Database optional** | App works fully without PostgreSQL — analytics are a non-blocking enhancement |
| **pnpm over npm/yarn** | Faster installs, strict dependency resolution, native workspace support |
| **Tailwind v4** | Latest version with native CSS variables, no `tailwind.config.js` needed |

---

## File Structure

```
Project-Helpnear/
  .github/workflows/ci.yml    — CI/CD pipeline
  prisma/schema.prisma         — Database schema (3 models)
  public/manifest.json         — PWA manifest
  src/
    app/
      globals.css              — Design tokens + base styles
      layout.tsx               — Root layout (fonts, theme, metadata)
      page.tsx                 — Landing page / discover view
      robots.ts                — SEO robots.txt
      sitemap.ts               — SEO sitemap.xml
      api/health/route.ts      — Health check endpoint
    lib/
      cache/redis.ts           — Cache layer (in-memory + Redis-ready)
      constants/config.ts      — App, search, map, cache configuration
      constants/categories.ts  — 22 service categories with TomTom mappings
      db/prisma.ts             — Database client (optional)
      utils.ts                 — shadcn cn() utility
      utils/index.ts           — Haversine, formatDistance, slugify
      validators/schemas.ts    — Zod input validation schemas
    components/ui/             — shadcn/ui base components (7 files)
    types/index.ts             — All TypeScript interfaces
    __tests__/setup.ts         — Test environment setup
  .env.example                 — Environment template
  .gitignore                   — Comprehensive ignore rules
  eslint.config.mjs            — ESLint with no-explicit-any
  next.config.ts               — Next.js configuration
  tsconfig.json                — TypeScript strict config
  vitest.config.ts             — Test runner config
  vercel.json                  — Deployment + security headers
```

---

## Verification

All Phase 0 quality gates passed:

| Gate | Result |
|------|--------|
| `pnpm lint` | 0 errors |
| `pnpm typecheck` | 0 errors |
| `pnpm test` | 88/88 pass |
| `pnpm build` | Success (11 routes) |
| Zero `any` types | Confirmed |
| No secrets in source | Confirmed |
| `.env.local` gitignored | Confirmed |
| Security headers configured | Confirmed |
