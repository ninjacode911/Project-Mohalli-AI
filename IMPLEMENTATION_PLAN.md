# Mohalla AI — End-to-End Implementation Plan

> **Version**: 1.0
> **Created**: 2026-03-30
> **Developer**: Navnit
> **Status**: Awaiting Approval
> **Reference**: `HelpNear_Project_Plan_v1.0.pdf`

---

## Table of Contents

1. [Plan Overview & Development Philosophy](#1-plan-overview--development-philosophy)
2. [Safety & Data Protection Protocol](#2-safety--data-protection-protocol)
3. [Phase 0 — Foundation & Project Scaffolding](#3-phase-0--foundation--project-scaffolding)
4. [Phase 1A — Search & Geocoding](#4-phase-1a--search--geocoding)
5. [Phase 1B — Map Integration & Service Discovery](#5-phase-1b--map-integration--service-discovery)
6. [Phase 1C — Sidebar, Cards & Card-Map Sync](#6-phase-1c--sidebar-cards--card-map-sync)
7. [Phase 1D — Filters, Sorting & Polish](#7-phase-1d--filters-sorting--polish)
8. [Phase 2A — Mobile Responsive Layout](#8-phase-2a--mobile-responsive-layout)
9. [Phase 2B — PWA, SEO & Dark Mode](#9-phase-2b--pwa-seo--dark-mode)
10. [Phase 2C — Performance & Caching Layer](#10-phase-2c--performance--caching-layer)
11. [Phase 3A — E2E Testing & Quality Assurance](#11-phase-3a--e2e-testing--quality-assurance)
12. [Phase 3B — CI/CD Pipeline & Deployment](#12-phase-3b--cicd-pipeline--deployment)
13. [Phase 3C — Launch Preparation & Go-Live](#13-phase-3c--launch-preparation--go-live)
14. [Documentation Protocol](#14-documentation-protocol)
15. [Progress Tracker](#15-progress-tracker)

---

## 1. Plan Overview & Development Philosophy

### Approach
Every phase follows a strict **Implement → Test → Document** cycle:

```
┌─────────────┐     ┌──────────┐     ┌────────────┐     ┌────────────┐
│  Plan Phase  │────>│  Build   │────>│   Test     │────>│  Document  │
│  (review)    │     │  (code)  │     │  (verify)  │     │  (record)  │
└─────────────┘     └──────────┘     └────────────┘     └────────────┘
       │                                                       │
       └───────────── Next Phase ◄─────────────────────────────┘
```

### Key Principles
- **No phase begins until the previous phase passes all tests**
- **No code is written without reading existing code first** — prevents overwrites
- **Every file write is intentional** — no bulk operations, no wildcard deletions
- **Git commits are atomic** — one logical change per commit, clear messages
- **All API keys stay server-side** — never exposed to client bundle
- **No shortcuts** — every component is production-quality from day one

### Technology Versions (Locked)
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ LTS | Runtime |
| Next.js | 14.x (App Router) | Framework |
| React | 18.x | UI Library |
| TypeScript | 5.x (strict mode) | Type Safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | latest | Component Library |
| Prisma | 5.x | ORM |
| Vitest | 1.x | Unit/Integration Tests |
| Playwright | 1.x | E2E Tests |
| pnpm | 8.x+ | Package Manager |

---

## 2. Safety & Data Protection Protocol

### Before Every Phase
- [ ] Verify working directory is `c:\Projects\Project-Helpnear` — never touch other project directories
- [ ] Run `git status` to confirm clean state before starting
- [ ] Ensure `.env` files are in `.gitignore` before any commit
- [ ] Read any file before editing it — never blind-write

### During Development
- [ ] No `rm -rf`, `git reset --hard`, or `git clean -f` without explicit approval
- [ ] No modifications to files outside `c:\Projects\Project-Helpnear`
- [ ] All destructive operations require user confirmation
- [ ] Environment variables stored only in `.env.local` (git-ignored)
- [ ] No API keys, secrets, or credentials in any committed file

### Before Every Commit
- [ ] Run `git diff` to review all changes
- [ ] Verify no `.env`, credential, or secret files are staged
- [ ] Ensure commit message is clear and atomic
- [ ] Run linting + type-check before committing

### Rollback Strategy
- Every phase starts with a git tag (`phase-X-start`) so we can safely rollback
- Feature branches for each phase, merged to `main` only after tests pass

---

## 3. Phase 0 — Foundation & Project Scaffolding

### Objective
Set up the complete project infrastructure: Next.js app, TypeScript config, Tailwind + shadcn/ui, linting, Git, folder structure, environment management, and design system tokens.

### Pre-Conditions
- Node.js 20+ installed
- pnpm installed globally
- Git initialized

### Step-by-Step Implementation

#### 0.1 — Initialize Next.js Project
```
Tasks:
1. Create Next.js 14 app with TypeScript, Tailwind CSS, App Router, ESLint
2. Configure pnpm as the package manager
3. Verify the dev server starts successfully on localhost:3000
```

**Command**: `pnpm create next-app@latest helpnear --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`

**Expected Output**: A working Next.js app at `c:\Projects\Project-Helpnear\helpnear\` (or at the root if scaffolded directly)

#### 0.2 — TypeScript Strict Configuration
```
File: tsconfig.json
Changes:
  - "strict": true
  - "noUncheckedIndexedAccess": true
  - "forceConsistentCasingInFileNames": true
  - Path aliases: "@/*" → "src/*"
```

#### 0.3 — Project Folder Structure
```
src/
├── app/                      # Next.js App Router pages & layouts
│   ├── layout.tsx            # Root layout (fonts, metadata, providers)
│   ├── page.tsx              # Landing / search page
│   ├── [area]/               # Dynamic area routes (SEO)
│   │   └── [category]/
│   │       └── page.tsx      # e.g., /wakad-pune/plumber
│   ├── api/                  # API route handlers
│   │   ├── geocode/
│   │   │   └── route.ts
│   │   ├── discover/
│   │   │   └── route.ts
│   │   ├── details/
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── autocomplete/
│   │   │   └── route.ts
│   │   ├── categories/
│   │   │   └── route.ts
│   │   └── health/
│   │       └── route.ts
│   └── globals.css           # Tailwind directives + custom CSS variables
├── components/               # Reusable UI components
│   ├── ui/                   # shadcn/ui primitives (button, card, input, etc.)
│   ├── search/               # SearchBar, Autocomplete, LocationButton
│   ├── map/                  # MapContainer, MapMarker, InfoWindow
│   ├── sidebar/              # Sidebar, ResultCard, CardDetail
│   ├── category/             # CategoryPills, CategoryGrid
│   ├── filters/              # FilterPanel, SortDropdown, RadiusSlider
│   └── layout/               # TopBar, MobileBottomSheet, ThemeToggle
├── lib/                      # Core utilities & business logic
│   ├── google/               # Google API client wrappers
│   │   ├── geocode.ts
│   │   ├── places.ts
│   │   └── autocomplete.ts
│   ├── cache/                # Redis cache helpers
│   │   └── redis.ts
│   ├── db/                   # Database client & queries
│   │   └── prisma.ts
│   ├── validators/           # Zod schemas for API request/response
│   │   └── schemas.ts
│   ├── constants/            # Categories, config values, design tokens
│   │   ├── categories.ts
│   │   └── config.ts
│   └── utils/                # Pure utility functions (distance calc, formatting)
│       └── index.ts
├── hooks/                    # Custom React hooks
│   ├── useGeolocation.ts
│   ├── useMapSync.ts
│   └── useDebounce.ts
├── store/                    # Zustand state management
│   └── useAppStore.ts
├── types/                    # TypeScript type definitions
│   └── index.ts
└── __tests__/                # Test files (mirrors src structure)
    ├── api/
    ├── components/
    ├── lib/
    └── e2e/
```

#### 0.4 — Install Core Dependencies
```
Production:
  - @googlemaps/js-api-loader     # Google Maps loader
  - zustand                        # State management
  - zod                            # Runtime validation
  - @prisma/client                 # Database ORM
  - ioredis / @upstash/redis       # Redis client
  - next-themes                    # Dark/light mode

Dev:
  - prisma                         # Prisma CLI
  - vitest                         # Test runner
  - @testing-library/react         # Component testing
  - @testing-library/jest-dom      # DOM matchers
  - @playwright/test               # E2E testing
  - @types/google.maps             # Google Maps types
  - jsdom                          # Test DOM environment
```

#### 0.5 — Environment Configuration
```
File: .env.local (git-ignored)
  GOOGLE_MAPS_API_KEY=<server-side key>
  NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY=<client-side key with referrer restrictions>
  REDIS_URL=<upstash redis URL>
  DATABASE_URL=<postgresql connection string>
  NEXT_PUBLIC_APP_URL=http://localhost:3000

File: .env.example (committed — no real values)
  GOOGLE_MAPS_API_KEY=your_server_side_key_here
  NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_KEY=your_client_side_key_here
  REDIS_URL=redis://localhost:6379
  DATABASE_URL=postgresql://user:password@localhost:5432/helpnear
  NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 0.6 — ESLint & Prettier Configuration
```
- ESLint: Next.js recommended + TypeScript strict rules
- Prettier: single quotes, trailing commas, 2-space indent, 80 char line width
- Lint-staged + Husky: pre-commit hooks for lint + type-check
```

#### 0.7 — Design System Foundation
```
File: src/app/globals.css
  - CSS custom properties for all design tokens (colors, typography, spacing)
  - Dark mode tokens under [data-theme="dark"] / .dark
  - Tailwind @layer base, components, utilities

File: tailwind.config.ts
  - Extend theme with HelpNear brand colors:
    - Primary/Accent: #D4541B (burnt orange)
    - Background dark: #0F1117, light: #FAF9F6
    - Surface dark: #1A1C28, light: #FFFFFF
    - Success: #22C55E, Error: #EF4444
  - Typography: Plus Jakarta Sans, Space Grotesk, Playfair Display, JetBrains Mono
  - Custom breakpoints if needed for sidebar layout

File: shadcn/ui initialization
  - Run: pnpm dlx shadcn-ui@latest init
  - Install base primitives: button, card, input, badge, skeleton, dialog, dropdown-menu, tooltip
```

#### 0.8 — Git Initialization & Safety Setup
```
1. git init (if not already)
2. Create .gitignore:
   - node_modules/
   - .next/
   - .env
   - .env.local
   - .env.*.local
   - *.log
   - dist/
   - coverage/
   - .vercel/
   - prisma/*.db
3. Initial commit: "chore: initialize HelpNear project with Next.js 14, TypeScript, Tailwind"
4. Create tag: git tag phase-0-start
```

#### 0.9 — Prisma Schema (Initial)
```
File: prisma/schema.prisma
Models:
  - GeocodeCache: id, areaText, lat, lng, formattedAddress, createdAt, expiresAt
  - SearchLog: id, areaText, lat, lng, category, resultsCount, timestamp, userAgent
  - PopularArea: id, areaName, city, state, lat, lng, searchCount, lastSearched
```

#### 0.10 — Vitest Configuration
```
File: vitest.config.ts
  - Environment: jsdom (for component tests)
  - Path aliases matching tsconfig
  - Coverage provider: v8
  - Setup files for testing-library matchers
```

### Phase 0 — Testing Checklist
| # | Test | Pass Criteria |
|---|------|---------------|
| T0.1 | `pnpm dev` starts without errors | Dev server runs on localhost:3000 |
| T0.2 | `pnpm build` completes | Production build succeeds with zero errors |
| T0.3 | `pnpm lint` passes | Zero ESLint errors |
| T0.4 | TypeScript strict mode compiles | `pnpm tsc --noEmit` passes |
| T0.5 | Tailwind classes render correctly | Visit localhost:3000, verify styled content |
| T0.6 | shadcn/ui Button renders | Import and render a Button component |
| T0.7 | `.env.local` is git-ignored | `git status` does not show .env files |
| T0.8 | Prisma schema validates | `pnpm prisma validate` passes |
| T0.9 | Vitest runs | `pnpm vitest run` executes (even with 0 tests) |
| T0.10 | Design tokens applied | Dark/light CSS variables present in globals.css |

### Phase 0 — Documentation Deliverable
> **File**: `docs/phase-0-foundation.md`
> **Contents**:
> - Project architecture diagram (folder structure)
> - Tech stack justification (why each tool was chosen)
> - Environment setup guide (how to clone & run)
> - Design system reference (colors, fonts, tokens)
> - Configuration decisions (strict TS, ESLint rules, path aliases)
> - How to add new shadcn/ui components
> - Git workflow (branching, commit conventions)

---

## 4. Phase 1A — Search & Geocoding

### Objective
Build the search bar with Google Places Autocomplete, geocoding API integration, "Use my current location" button, and recent searches (localStorage).

### Pre-Conditions
- Phase 0 complete and all tests passing
- Google Cloud Platform account with Maps API enabled
- API keys provisioned and restricted

### Step-by-Step Implementation

#### 1A.1 — Types & Schemas
```
File: src/types/index.ts
  Define TypeScript interfaces:
  - GeocodeRequest: { area: string }
  - GeocodeResponse: { lat: number; lng: number; formattedAddress: string; cached: boolean }
  - AutocompleteRequest: { input: string; location?: { lat: number; lng: number } }
  - AutocompleteSuggestion: { placeId: string; description: string; mainText: string; secondaryText: string }

File: src/lib/validators/schemas.ts
  Zod schemas for runtime validation of all above types
```

#### 1A.2 — Google Geocoding Service
```
File: src/lib/google/geocode.ts
  - Function: geocodeArea(area: string): Promise<GeocodeResponse>
  - Makes server-side HTTP call to Google Geocoding API
  - Parses response, extracts lat/lng and formatted address
  - Error handling: invalid area, API failure, rate limit
  - Input sanitization: trim, normalize whitespace
```

#### 1A.3 — Google Autocomplete Service
```
File: src/lib/google/autocomplete.ts
  - Function: getAutocompleteSuggestions(input: string, location?: LatLng): Promise<AutocompleteSuggestion[]>
  - Server-side call to Google Places Autocomplete API
  - Filters to Indian regions (components=country:in)
  - Returns top 5 suggestions with structured formatting
```

#### 1A.4 — API Route: /api/geocode
```
File: src/app/api/geocode/route.ts
  - POST handler
  - Validates request body with Zod schema
  - Calls geocodeArea() service
  - Returns JSON response with lat/lng
  - Error responses: 400 (invalid input), 500 (API failure), 429 (rate limited)
```

#### 1A.5 — API Route: /api/autocomplete
```
File: src/app/api/autocomplete/route.ts
  - POST handler
  - Validates { input: string } with minimum 2 characters
  - Calls getAutocompleteSuggestions()
  - Returns array of suggestions
  - Debounce hint in response headers
```

#### 1A.6 — Custom Hooks
```
File: src/hooks/useDebounce.ts
  - Generic debounce hook: useDebounce<T>(value: T, delay: number): T
  - Used to debounce autocomplete API calls (300ms)

File: src/hooks/useGeolocation.ts
  - Hook: useGeolocation()
  - Returns: { lat, lng, loading, error, requestLocation }
  - Uses browser's navigator.geolocation.getCurrentPosition
  - Handles permission denied, timeout, unavailable errors
```

#### 1A.7 — Zustand Store (Search State)
```
File: src/store/useAppStore.ts
  State:
  - searchQuery: string
  - selectedLocation: { lat: number; lng: number; formattedAddress: string } | null
  - recentSearches: string[] (persisted to localStorage)
  - isSearching: boolean
  - searchError: string | null

  Actions:
  - setSearchQuery(query: string)
  - setSelectedLocation(location: ...)
  - addRecentSearch(area: string)
  - clearSearch()
```

#### 1A.8 — SearchBar Component
```
File: src/components/search/SearchBar.tsx
  Features:
  - Text input with placeholder "Enter your area, society, or PIN code..."
  - Autocomplete dropdown appears after 2+ characters (debounced 300ms)
  - Each suggestion shows mainText (bold) + secondaryText (grey)
  - Keyboard navigation: arrow keys to navigate, Enter to select, Escape to close
  - "Use my current location" button with GPS icon
  - "Discover" button (primary CTA) — triggers geocoding
  - Recent searches dropdown (from localStorage) when input focused and empty
  - Loading spinner during geocoding
  - Error toast on failure

  Accessibility:
  - aria-label on input
  - aria-expanded on dropdown
  - role="listbox" on suggestions
  - aria-activedescendant for keyboard nav
```

#### 1A.9 — TopBar Layout Component
```
File: src/components/layout/TopBar.tsx
  - Fixed top bar (56px height)
  - Left: HelpNear logo (Plus Jakarta Sans, ExtraBold, #D4541B accent)
  - Center: SearchBar component (expands to fill)
  - Right: Settings icon (placeholder for Phase 2)
  - Responsive: on mobile, search bar takes full width below logo
```

#### 1A.10 — Landing Page Integration
```
File: src/app/page.tsx
  - Renders TopBar with SearchBar
  - Before search: shows a hero section with:
    - Tagline: "Find trusted services in your neighbourhood"
    - Subtitle: "Plumbers, pharmacies, mechanics & more — one search away"
    - Popular areas quick-links (Wakad, Baner, Kothrud, Hinjewadi, Viman Nagar)
  - After search (location selected): transitions to map view (Phase 1B)
```

### Phase 1A — Testing Checklist
| # | Test | Type | Pass Criteria |
|---|------|------|---------------|
| T1A.1 | Geocode API returns valid lat/lng for "Wakad, Pune" | Integration | Response has lat ~18.59, lng ~73.77 |
| T1A.2 | Geocode API returns 400 for empty input | Integration | Status 400 with error message |
| T1A.3 | Autocomplete returns suggestions for "Wak" | Integration | Array of 3+ suggestions containing "Wakad" |
| T1A.4 | Zod schema rejects malformed geocode request | Unit | Validation error thrown |
| T1A.5 | useDebounce delays value updates | Unit | Value updates after specified delay |
| T1A.6 | SearchBar renders with placeholder | Component | Input element with correct placeholder text |
| T1A.7 | SearchBar shows autocomplete dropdown | Component | Dropdown appears after typing 2+ chars |
| T1A.8 | Keyboard navigation works in dropdown | Component | Arrow keys move selection, Enter selects |
| T1A.9 | "Use my location" triggers geolocation | Component | Hook called on button click |
| T1A.10 | Recent searches stored in localStorage | Integration | After search, area appears in recent list |
| T1A.11 | TopBar renders logo and search | Component | Logo text and search input visible |
| T1A.12 | Landing page shows hero before search | Component | Tagline and popular areas visible |

### Phase 1A — Documentation Deliverable
> **File**: `docs/phase-1a-search-geocoding.md`
> **Contents**:
> - Search flow diagram (user types → autocomplete → select → geocode → coordinates)
> - API endpoint documentation (/api/geocode, /api/autocomplete) with request/response examples
> - Google API integration details (which APIs, how called, error handling)
> - Component hierarchy (TopBar → SearchBar → Autocomplete dropdown)
> - State management design (Zustand store shape and actions)
> - Accessibility decisions (ARIA attributes, keyboard nav)
> - How debouncing works and why 300ms was chosen
> - Edge cases handled (empty input, API failure, no results, GPS denied)

---

## 5. Phase 1B — Map Integration & Service Discovery

### Objective
Embed Google Maps as the central panel, integrate Places Nearby Search API, build category pills for 12+ service types, and render results as map markers.

### Pre-Conditions
- Phase 1A complete and all tests passing
- Google Maps JavaScript API enabled
- Google Places API (New) enabled

### Step-by-Step Implementation

#### 1B.1 — Additional Types
```
File: src/types/index.ts (extend)
  - Category: { id: string; name: string; icon: string; googleTypes: string[]; fallbackKeyword: string }
  - DiscoverRequest: { lat: number; lng: number; category: string; radius?: number; sort?: 'distance' | 'rating' | 'reviews' }
  - ServiceResult: { placeId: string; name: string; rating: number; reviewCount: number; distance: number; distanceUnit: string; address: string; isOpen: boolean; hours: string; phone: string; lat: number; lng: number; photoRef: string | null }
  - DiscoverResponse: { results: ServiceResult[]; meta: { area: string; category: string; radius: number; totalResults: number; cached: boolean; cacheAge?: string } }
```

#### 1B.2 — Categories Configuration
```
File: src/lib/constants/categories.ts
  Export CATEGORIES array with all 12+ categories:
  - Plumber → types: ['plumber'], fallback: 'plumbing services', icon: Wrench
  - Electrician → types: ['electrician'], fallback: 'electrical services', icon: Zap
  - Mechanic → types: ['car_repair'], fallback: 'car mechanic auto repair', icon: Car
  - Pharmacy → types: ['pharmacy', 'drugstore'], fallback: 'medical store', icon: Pill
  - Grocery → types: ['supermarket', 'grocery_or_supermarket'], fallback: 'grocery store', icon: ShoppingCart
  - Doctor → types: ['hospital', 'doctor'], fallback: 'clinic doctor', icon: Stethoscope
  - Salon → types: ['hair_care', 'beauty_salon'], fallback: 'salon haircut', icon: Scissors
  - Laundry → types: ['laundry'], fallback: 'dry cleaning', icon: Shirt
  - Restaurant → types: ['restaurant'], fallback: 'restaurant food', icon: UtensilsCrossed
  - Gym → types: ['gym'], fallback: 'fitness center', icon: Dumbbell
  - Petrol Pump → types: ['gas_station'], fallback: 'petrol pump', icon: Fuel
  - ATM/Bank → types: ['atm', 'bank'], fallback: 'ATM bank', icon: Landmark
```

#### 1B.3 — Google Places Nearby Search Service
```
File: src/lib/google/places.ts
  - Function: discoverServices(lat, lng, category, radius, sort): Promise<ServiceResult[]>
  - Server-side call to Google Places Nearby Search API
  - Maps category to Google types using CATEGORIES config
  - Calculates distance from search center to each result
  - Sorts results by distance (default), rating, or review count
  - Handles pagination (up to 20 results per page, max 60)
  - Returns normalized ServiceResult array
```

#### 1B.4 — API Route: /api/discover
```
File: src/app/api/discover/route.ts
  - POST handler
  - Validates DiscoverRequest with Zod
  - Calls discoverServices()
  - Returns DiscoverResponse with results and metadata
  - Error handling: invalid category, no results, API failure
```

#### 1B.5 — API Route: /api/categories
```
File: src/app/api/categories/route.ts
  - GET handler
  - Returns CATEGORIES array (id, name, icon name)
  - Static response, highly cacheable (Cache-Control: max-age=86400)
```

#### 1B.6 — Map Container Component
```
File: src/components/map/MapContainer.tsx
  Features:
  - Loads Google Maps JS API via @googlemaps/js-api-loader
  - Full-width map panel (60-70% of viewport)
  - Auto-centers on selectedLocation from store
  - Zoom level: 14-15 for neighbourhood view
  - Search location marked with distinct pin (HelpNear branded)
  - Radius circle overlay showing search area boundary
  - Smooth pan/zoom transitions when location changes
  - Map controls: zoom, fullscreen, map/satellite toggle

  Performance:
  - Lazy-load map only after first search
  - Loading skeleton while map initializes
```

#### 1B.7 — Map Markers
```
File: src/components/map/MapMarker.tsx
  - Numbered markers (1, 2, 3...) matching sidebar card numbers
  - Custom marker styling with HelpNear accent color
  - Click → opens InfoWindow with name, rating, quick-action buttons
  - Active state (scaled up, different color) when corresponding card is hovered
  - MarkerClusterer for dense results (lazy-loaded)
```

#### 1B.8 — Category Pills Component
```
File: src/components/category/CategoryPills.tsx
  - Horizontal scrollable row of category pills (below TopBar, 48px height)
  - Each pill: icon + category name
  - Active state: filled background with accent color
  - Only appears after location is selected
  - Clicking a pill triggers service discovery for that category
  - Scroll arrows on desktop, touch scroll on mobile
  - Animated entrance (slide down)
```

#### 1B.9 — Zustand Store Extensions
```
File: src/store/useAppStore.ts (extend)
  Additional state:
  - selectedCategory: string | null
  - results: ServiceResult[]
  - isDiscovering: boolean
  - discoverError: string | null
  - mapCenter: { lat: number; lng: number } | null
  - mapZoom: number
  - activeMarkerId: string | null (for hover sync)

  Additional actions:
  - setSelectedCategory(category: string)
  - setResults(results: ServiceResult[])
  - setActiveMarker(placeId: string | null)
  - discoverServices(lat, lng, category, radius)  // async action
```

#### 1B.10 — Main Page Layout (Split Panel)
```
File: src/app/page.tsx (update)
  After search:
  - TopBar (fixed, 56px)
  - CategoryPills (fixed, 48px, below TopBar)
  - Content area (remaining height):
    - Left: Sidebar (370px) — placeholder for Phase 1C
    - Right: MapContainer (remaining width)
  - Flexbox/Grid layout with proper z-index stacking
```

### Phase 1B — Testing Checklist
| # | Test | Type | Pass Criteria |
|---|------|------|---------------|
| T1B.1 | Discover API returns results for "plumber" near Wakad | Integration | 1+ results with valid placeId, name, rating |
| T1B.2 | Discover API validates radius range (100-50000) | Unit | Rejects radius < 100 or > 50000 |
| T1B.3 | Discover API returns 400 for invalid category | Integration | Status 400 with error message |
| T1B.4 | Categories endpoint returns all 12 categories | Integration | Array length >= 12, each has id/name/icon |
| T1B.5 | Distance calculation is accurate | Unit | Known coordinates → expected distance ±50m |
| T1B.6 | Map renders centered on selected location | Component | Map div present, center matches coordinates |
| T1B.7 | Map markers appear for results | Component | Marker count matches results count |
| T1B.8 | Category pills render all 12 categories | Component | 12 pill elements visible |
| T1B.9 | Clicking category triggers discovery | Integration | Results populate after category click |
| T1B.10 | Results sort correctly by distance | Unit | Results ordered by ascending distance |
| T1B.11 | Results sort correctly by rating | Unit | Results ordered by descending rating |
| T1B.12 | Split-panel layout renders correctly | Component | Sidebar and map panels visible side-by-side |

### Phase 1B — Documentation Deliverable
> **File**: `docs/phase-1b-map-discovery.md`
> **Contents**:
> - Discovery flow diagram (location + category → API → results → map markers)
> - API endpoint documentation (/api/discover, /api/categories) with examples
> - Google Places API integration (types mapping, search radius, pagination)
> - Category configuration (complete mapping table with types and fallbacks)
> - Map integration architecture (loader, markers, InfoWindows, clustering)
> - State management additions (new store slices and actions)
> - Distance calculation formula and accuracy
> - Split-panel layout CSS architecture

---

## 6. Phase 1C — Sidebar, Cards & Card-Map Sync

### Objective
Build the sidebar with numbered result cards, expandable detail views, tap-to-call, directions, and bidirectional card-map hover/click synchronization.

### Pre-Conditions
- Phase 1B complete and all tests passing

### Step-by-Step Implementation

#### 1C.1 — Place Details Service
```
File: src/lib/google/places.ts (extend)
  - Function: getPlaceDetails(placeId: string): Promise<PlaceDetail>
  - PlaceDetail type: extends ServiceResult with:
    - website: string | null
    - weekdayHours: string[] (Mon-Sun)
    - reviews: { author: string; rating: number; text: string; time: string }[] (up to 3)
    - photos: string[] (up to 3 photo URLs)
    - formattedPhone: string
  - Server-side call to Google Place Details API
  - Requests only needed fields (to minimize cost): name, formatted_phone_number,
    opening_hours, reviews, photos, website, formatted_address, geometry, rating, user_ratings_total
```

#### 1C.2 — API Route: /api/details/[id]
```
File: src/app/api/details/[id]/route.ts
  - GET handler with placeId from URL params
  - Validates placeId format
  - Calls getPlaceDetails()
  - Returns full PlaceDetail JSON
  - Error handling: invalid placeId, not found, API failure
```

#### 1C.3 — Sidebar Container
```
File: src/components/sidebar/Sidebar.tsx
  - 370px width panel, left side
  - Collapsible via toggle button (chevron icon)
  - Header: "Results for [Category] near [Area]" with count badge
  - Scrollable results area
  - Collapse animation (smooth width transition)
  - On collapse: map expands to full width
```

#### 1C.4 — Result Card Component
```
File: src/components/sidebar/ResultCard.tsx
  Props: result: ServiceResult, index: number, isActive: boolean

  Collapsed state (default):
  - Number badge (matches map marker number)
  - Service name (bold, truncated)
  - Star rating display (filled/empty stars) + review count
  - Distance badge ("0.8 km")
  - Open/Closed indicator: green pulse dot + "Open" or red dot + "Closed"
  - Operating hours summary ("Open 24 hours" or "Closes at 9 PM")

  Expanded state (on click):
  - All of the above, plus:
  - Full address
  - Phone number (formatted)
  - Action buttons row:
    - "Call Now" (tel: link, phone icon, primary style)
    - "Directions" (opens Google Maps with destination, map-pin icon)
    - "View Details" (opens detail modal — triggers /api/details call)

  Interactions:
  - Click to expand/collapse
  - Hover highlights corresponding map marker
  - Hover state: subtle background color change + left border accent

  Accessibility:
  - role="article"
  - aria-expanded for expand/collapse
  - Tab-focusable with keyboard expand/collapse
```

#### 1C.5 — Detail Modal/Panel
```
File: src/components/sidebar/CardDetail.tsx
  - Triggered by "View Details" button
  - Slides in as a panel (replaces sidebar content) or opens as a modal
  - Shows full PlaceDetail data:
    - Name, rating, review count, address
    - Phone (tap-to-call)
    - Website link (external, opens new tab)
    - Operating hours (all 7 days, current day highlighted)
    - Up to 3 user reviews (author, rating, text, relative time)
    - Up to 3 photos (lazy-loaded, click to enlarge)
  - Action buttons: Call, Directions, Share (copies shareable URL), Save (bookmarks to localStorage)
  - Back button to return to results list
  - Loading skeleton while details fetch
```

#### 1C.6 — Card-Map Synchronization
```
File: src/hooks/useMapSync.ts
  Implements bidirectional sync:

  Sidebar → Map:
  - Hovering a card sets activeMarkerId in store
  - MapMarker component reads activeMarkerId, scales up + shows tooltip for matching marker
  - Clicking a card pans map to that marker's location

  Map → Sidebar:
  - Clicking a map marker sets activeMarkerId in store
  - Sidebar scrolls to the corresponding card (scrollIntoView with smooth behavior)
  - Card auto-expands when its marker is clicked

  Performance:
  - Debounce hover events (100ms) to prevent excessive updates
  - Use requestAnimationFrame for smooth scroll
```

#### 1C.7 — Empty & Loading States
```
File: src/components/sidebar/EmptyState.tsx
  - Friendly illustration + message: "No [category] found near [area]"
  - Suggestion: "Try expanding your search radius or searching a different area"

File: src/components/sidebar/LoadingState.tsx
  - Shimmer skeleton cards (3-4 skeleton cards)
  - Pulsing map indicator
  - Matches exact card layout dimensions
```

### Phase 1C — Testing Checklist
| # | Test | Type | Pass Criteria |
|---|------|------|---------------|
| T1C.1 | Details API returns full data for a valid placeId | Integration | Response includes hours, reviews, photos |
| T1C.2 | Details API returns 400 for invalid placeId | Integration | Status 400 |
| T1C.3 | Sidebar renders with correct result count | Component | "X results" matches data length |
| T1C.4 | Result card shows name, rating, distance, status | Component | All fields rendered correctly |
| T1C.5 | Card expands on click showing address and buttons | Component | Expanded section visible with actions |
| T1C.6 | "Call Now" generates correct tel: link | Component | href starts with "tel:+91" |
| T1C.7 | "Directions" generates correct Google Maps link | Component | href contains google.com/maps/dir |
| T1C.8 | Card hover highlights map marker | Integration | activeMarkerId updated on hover |
| T1C.9 | Map marker click scrolls sidebar to card | Integration | Card scrolled into view and expanded |
| T1C.10 | Detail modal loads and shows full place data | Integration | All detail fields render after API call |
| T1C.11 | Sidebar collapses/expands correctly | Component | Width transitions, map resizes |
| T1C.12 | Empty state shows when no results | Component | Empty message visible when results=[] |
| T1C.13 | Loading skeletons show during fetch | Component | Skeleton cards visible while isDiscovering=true |
| T1C.14 | Keyboard navigation works on cards | Component | Tab focuses cards, Enter expands |

### Phase 1C — Documentation Deliverable
> **File**: `docs/phase-1c-sidebar-cards.md`
> **Contents**:
> - Sidebar architecture and layout specifications
> - Result card anatomy (visual diagram of collapsed/expanded states)
> - Card-Map sync mechanism (bidirectional flow diagram)
> - Place Details API integration and field mapping
> - Component API reference (props, state, events)
> - Interaction design (hover, click, keyboard patterns)
> - Loading and empty state design decisions
> - Accessibility implementation (ARIA, keyboard, focus management)

---

## 7. Phase 1D — Filters, Sorting & Polish

### Objective
Add filter controls (open now, rating, radius), sorting options, error handling, and UI polish (animations, transitions, edge cases).

### Pre-Conditions
- Phase 1C complete and all tests passing

### Step-by-Step Implementation

#### 1D.1 — Filter State in Store
```
File: src/store/useAppStore.ts (extend)
  Additional state:
  - filters: {
      openNow: boolean (default: false)
      minRating: number (default: 0, options: 0/3.0/3.5/4.0/4.5)
      radius: number (default: 3000, options: 1000/2000/3000/5000)
    }
  - sortBy: 'distance' | 'rating' | 'reviews' (default: 'distance')

  Actions:
  - setFilter(key, value) — updates filter and re-fetches results
  - setSortBy(sort) — updates sort and re-orders results
  - resetFilters() — clears all filters to defaults
```

#### 1D.2 — Filter Panel Component
```
File: src/components/filters/FilterPanel.tsx
  - Positioned at top of sidebar, below results header
  - Compact horizontal layout with:
    - "Open Now" toggle switch (green when active)
    - Rating filter: dropdown/segmented control (Any / 3.0+ / 3.5+ / 4.0+ / 4.5+)
    - Radius: dropdown/segmented control (1 km / 2 km / 3 km / 5 km)
  - Active filter count badge
  - "Clear all" button when any filter is active
  - Filters apply immediately (no "Apply" button needed)
```

#### 1D.3 — Sort Dropdown
```
File: src/components/filters/SortDropdown.tsx
  - "Sort by" dropdown in sidebar header area
  - Options: Nearest first (default), Highest rated, Most reviewed
  - Selected option shown inline
  - Changing sort re-orders existing results (client-side, no API call)
```

#### 1D.4 — Client-Side Filtering Logic
```
File: src/lib/utils/filters.ts
  - Function: applyFilters(results: ServiceResult[], filters, sortBy): ServiceResult[]
  - Filters:
    - openNow: filter where isOpen === true
    - minRating: filter where rating >= minRating
    - radius: already handled by API param (re-fetch with new radius)
  - Sort:
    - distance: ascending by distance
    - rating: descending by rating, then by reviewCount
    - reviews: descending by reviewCount
  - Returns new filtered + sorted array (never mutates original)
```

#### 1D.5 — Radius Circle Update
```
File: src/components/map/MapContainer.tsx (update)
  - When radius filter changes, update the circle overlay diameter
  - Smooth animation for circle resize
  - Re-fetch results with new radius (API call)
```

#### 1D.6 — Error Handling & Toasts
```
File: src/components/ui/Toast.tsx (or use shadcn/ui toast)
  Error scenarios handled:
  - API failure: "Something went wrong. Please try again."
  - No results: triggers empty state (already built)
  - Rate limited: "Too many requests. Please wait a moment."
  - Geolocation denied: "Location access denied. Please type your area instead."
  - Network offline: "You appear to be offline. Showing cached results."

  Toast behavior:
  - Auto-dismiss after 5 seconds
  - Dismissible manually
  - Stacked if multiple
  - Positioned top-right on desktop, bottom-center on mobile
```

#### 1D.7 — UI Polish & Animations
```
Additions across components:
  - Page transition: search → results view (fade + slide)
  - Category pills: staggered entrance animation
  - Result cards: staggered entrance animation (50ms delay each)
  - Card expand/collapse: height animation (CSS transition)
  - Map marker drop: bounce animation
  - Hover effects: subtle scale + shadow on cards
  - Focus indicators: visible focus ring on all interactive elements
  - Scroll shadows: top/bottom shadows on sidebar when scrollable
```

#### 1D.8 — Open/Closed Status Logic
```
File: src/lib/utils/status.ts
  - Function: getOpenStatus(hours: string, weekdayHours: string[]): { isOpen: boolean; statusText: string; nextChange: string }
  - Parses Google's opening_hours to determine:
    - Currently open/closed
    - "Open 24 hours" / "Closes at 9 PM" / "Opens at 8 AM tomorrow"
  - Handles timezone (IST for India)
  - Green pulse dot for open, red dot for closed (in card component)
```

#### 1D.9 — API Route: /api/health
```
File: src/app/api/health/route.ts
  - GET handler
  - Returns: { status: 'ok', timestamp: ISO string, version: '1.0.0' }
  - Used for uptime monitoring
```

### Phase 1D — Testing Checklist
| # | Test | Type | Pass Criteria |
|---|------|------|---------------|
| T1D.1 | "Open Now" filter removes closed services | Unit | Only isOpen=true results remain |
| T1D.2 | Rating filter (4.0+) removes low-rated | Unit | All results have rating >= 4.0 |
| T1D.3 | Sort by rating orders correctly | Unit | Descending rating order |
| T1D.4 | Sort by reviews orders correctly | Unit | Descending reviewCount order |
| T1D.5 | Radius change triggers API re-fetch | Integration | New API call with updated radius |
| T1D.6 | "Clear all" resets filters to defaults | Component | All filters at default values |
| T1D.7 | Active filter count badge is accurate | Component | Badge shows correct count |
| T1D.8 | Error toast appears on API failure | Component | Toast visible with error message |
| T1D.9 | Health endpoint returns OK | Integration | Status 200 with status: 'ok' |
| T1D.10 | Open/closed status is accurate | Unit | Known hours → correct isOpen value |
| T1D.11 | Animations don't cause layout shift | Visual | CLS = 0 during animations |
| T1D.12 | All interactive elements have focus indicators | Accessibility | Visible focus ring on tab |

### Phase 1D — Documentation Deliverable
> **File**: `docs/phase-1d-filters-polish.md`
> **Contents**:
> - Filter system design (state management, client-side vs server-side filtering)
> - Sorting implementation and comparison logic
> - Error handling strategy (every error scenario and user-facing message)
> - Animation/transition inventory (what animates, duration, easing)
> - Open/closed status calculation logic
> - Health endpoint specification
> - Complete UI state machine (search → loading → results → filtered → detail)

---

## 8. Phase 2A — Mobile Responsive Layout

### Objective
Transform the desktop split-panel layout into a mobile-first responsive experience with bottom sheet pattern, touch-optimized interactions, and adaptive breakpoints.

### Pre-Conditions
- Phase 1D complete and all tests passing
- All desktop functionality working

### Step-by-Step Implementation

#### 2A.1 — Responsive Breakpoints
```
File: tailwind.config.ts (update)
  Breakpoints:
  - sm: 640px (large phones)
  - md: 768px (tablets)
  - lg: 1024px (desktop — sidebar appears)
  - xl: 1280px (wide desktop)

  Layout behavior:
  - < 1024px: Mobile layout (map fullscreen + bottom sheet)
  - >= 1024px: Desktop layout (sidebar + map split)
```

#### 2A.2 — Mobile Bottom Sheet
```
File: src/components/layout/MobileBottomSheet.tsx
  Features:
  - Swipe-up sheet overlaying full-screen map (like Google Maps mobile)
  - Three snap positions:
    - Collapsed: only header visible (~80px, showing result count)
    - Half: shows 2-3 cards (~50% viewport)
    - Expanded: full list (~85% viewport)
  - Swipe gesture handling (touch-action: pan-y)
  - Header: drag handle bar + result count + category name
  - Contains same ResultCard components as desktop sidebar
  - Backdrop: semi-transparent overlay when expanded
  - Performance: virtualized list for many results
```

#### 2A.3 — Mobile TopBar Adaptation
```
File: src/components/layout/TopBar.tsx (update)
  Mobile (< 1024px):
  - Logo condensed to icon only
  - Search bar takes full width
  - Category pills scroll horizontally with momentum
  - Sticky positioning
```

#### 2A.4 — Touch-Optimized Cards
```
File: src/components/sidebar/ResultCard.tsx (update)
  Mobile adaptations:
  - Larger tap targets (minimum 44x44px per WCAG)
  - "Call Now" and "Directions" as full-width buttons
  - Swipe-left on card to reveal quick actions (optional, progressive enhancement)
  - Card detail opens as full-screen overlay on mobile
```

#### 2A.5 — Responsive Map
```
File: src/components/map/MapContainer.tsx (update)
  Mobile:
  - Map takes 100% of viewport (behind bottom sheet)
  - Map controls repositioned to not conflict with bottom sheet
  - Reduced marker info window size
  - Tap marker → bottom sheet scrolls to that card
```

### Phase 2A — Testing Checklist
| # | Test | Type | Pass Criteria |
|---|------|------|---------------|
| T2A.1 | Bottom sheet renders on mobile viewport (375px) | Component | Sheet visible with drag handle |
| T2A.2 | Bottom sheet snaps to 3 positions | E2E | Swipe gestures snap correctly |
| T2A.3 | Map is fullscreen on mobile | Visual | Map fills viewport behind sheet |
| T2A.4 | Cards have 44px+ tap targets | Accessibility | All interactive areas >= 44x44px |
| T2A.5 | Category pills scroll horizontally on mobile | Component | Horizontal scroll works with touch |
| T2A.6 | Desktop layout unchanged at 1024px+ | Visual | Sidebar + map split-panel intact |
| T2A.7 | Detail view is fullscreen on mobile | Component | Overlay covers viewport |
| T2A.8 | Lighthouse mobile score > 90 | Performance | Lighthouse mobile audit passes |

### Phase 2A — Documentation Deliverable
> **File**: `docs/phase-2a-mobile-responsive.md`
> **Contents**:
> - Responsive layout strategy (breakpoints, layout switching)
> - Bottom sheet implementation (snap positions, gesture handling, virtualization)
> - Mobile interaction patterns vs desktop patterns
> - Touch target compliance (WCAG 2.1 AA)
> - Performance considerations for mobile (lazy loading, reduced animations)
> - Screenshots/diagrams of mobile layouts at different viewports

---

## 9. Phase 2B — PWA, SEO & Dark Mode

### Objective
Make the app installable as a PWA, optimize for search engines with SSG area pages, and implement dark/light mode toggle.

### Pre-Conditions
- Phase 2A complete and all tests passing

### Step-by-Step Implementation

#### 2B.1 — PWA Setup
```
File: public/manifest.json
  - name: "HelpNear — Find Services Near You"
  - short_name: "HelpNear"
  - start_url: "/"
  - display: "standalone"
  - theme_color: "#D4541B"
  - background_color: "#0F1117"
  - Icons: 192x192, 512x512 (PNG + maskable)

File: src/app/layout.tsx (update)
  - Add <link rel="manifest"> and meta tags for PWA
  - Add apple-touch-icon, mobile-web-app-capable

Service Worker (via next-pwa or manual):
  - Cache static assets (JS, CSS, fonts, images)
  - Cache recent search results for limited offline access
  - Network-first strategy for API calls, cache fallback
  - Install prompt handling
```

#### 2B.2 — SEO-Friendly Area Pages
```
File: src/app/[area]/[category]/page.tsx
  - Dynamic routes like /wakad-pune/plumber
  - SSG with generateStaticParams for popular areas
  - Server-side data fetching for initial results
  - Rich metadata:
    - Title: "Best Plumbers near Wakad, Pune | HelpNear"
    - Description: "Find top-rated plumbers near Wakad, Pune. Ratings, reviews, phone numbers, and directions. Open now indicators."
  - Structured data (JSON-LD): LocalBusiness schema
  - OpenGraph tags for social sharing
  - Canonical URLs

File: src/app/sitemap.ts
  - Dynamic sitemap generation for all area+category combinations

File: src/app/robots.ts
  - Allow all crawlers, point to sitemap
```

#### 2B.3 — Dark Mode Toggle
```
File: src/components/layout/ThemeToggle.tsx
  - Sun/Moon icon toggle button
  - Three modes: light / dark / system (auto-detect)
  - Uses next-themes for SSR-safe theme switching
  - Theme persisted in localStorage
  - Smooth color transition (CSS transition on background-color, color)
  - Positioned in TopBar (right side)

File: tailwind.config.ts (update)
  - darkMode: 'class'

File: src/app/globals.css (update)
  - All CSS variables switch between light/dark under .dark class
  - Map tiles: Google Maps dark mode styling (via map styles)
```

#### 2B.4 — Shareable URLs
```
  - When user searches and selects a category, URL updates to /[area-slug]/[category]
  - Sharing this URL takes another user directly to results
  - Share button on detail modal copies URL to clipboard with toast confirmation
```

### Phase 2B — Testing Checklist
| # | Test | Type | Pass Criteria |
|---|------|------|---------------|
| T2B.1 | manifest.json is valid | Unit | All required PWA fields present |
| T2B.2 | Service worker registers | E2E | SW registered in browser devtools |
| T2B.3 | App installable on mobile | Manual | Install prompt appears |
| T2B.4 | Area page renders with SSG | Integration | /wakad-pune/plumber returns HTML with results |
| T2B.5 | Meta tags are correct per page | Unit | Title, description, OG tags match expected |
| T2B.6 | Structured data is valid | Unit | JSON-LD validates against schema.org |
| T2B.7 | Sitemap generates valid XML | Integration | /sitemap.xml returns valid sitemap |
| T2B.8 | Dark mode toggle switches themes | Component | Body class toggles between light/dark |
| T2B.9 | Dark mode persists on refresh | E2E | Theme restored from localStorage |
| T2B.10 | Map applies dark styles in dark mode | Visual | Map tiles change to dark style |
| T2B.11 | Shareable URL loads correct results | E2E | Shared URL shows same area+category results |
| T2B.12 | Lighthouse SEO score > 90 | Performance | Lighthouse SEO audit passes |
| T2B.13 | Lighthouse PWA score > 90 | Performance | Lighthouse PWA audit passes |

### Phase 2B — Documentation Deliverable
> **File**: `docs/phase-2b-pwa-seo-darkmode.md`
> **Contents**:
> - PWA implementation (manifest, service worker, caching strategy, install flow)
> - SEO strategy (SSG, metadata, structured data, sitemap, robots)
> - URL architecture (/[area-slug]/[category] pattern)
> - Dark mode implementation (theme switching, CSS variables, map styling)
> - Share functionality design
> - Lighthouse audit results and optimization steps taken

---

## 10. Phase 2C — Performance & Caching Layer

### Objective
Implement Redis caching for all Google API calls, optimize bundle size, add image lazy loading, and ensure sub-2-second page loads.

### Pre-Conditions
- Phase 2B complete and all tests passing
- Redis (Upstash) provisioned
- PostgreSQL (Supabase/Neon) provisioned

### Step-by-Step Implementation

#### 2C.1 — Redis Cache Client
```
File: src/lib/cache/redis.ts
  - Initialize Upstash Redis client (or ioredis for self-hosted)
  - Generic cache functions:
    - get<T>(key: string): Promise<T | null>
    - set<T>(key: string, value: T, ttlSeconds: number): Promise<void>
    - del(key: string): Promise<void>
  - Key generation helpers:
    - geocodeKey(area: string): string → "geocode:{md5(area)}"
    - discoverKey(lat, lng, category, radius): string → "discover:{lat}:{lng}:{category}:{radius}"
    - detailsKey(placeId: string): string → "details:{placeId}"
    - popularKey(): string → "popular:suggestions"
```

#### 2C.2 — Cache Integration in API Routes
```
Update all API route handlers:

/api/geocode:
  - Before calling Google: check Redis cache (TTL: 30 days)
  - After Google response: store in Redis
  - Response includes "cached: true/false" and "cacheAge"

/api/discover:
  - Before calling Google: check Redis cache (TTL: 24 hours)
  - After Google response: store in Redis
  - Response includes cache metadata

/api/details/[id]:
  - Before calling Google: check Redis cache (TTL: 24 hours)
  - After Google response: store in Redis
```

#### 2C.3 — Database Integration (Search Analytics)
```
File: src/lib/db/prisma.ts
  - Prisma client singleton (prevent multiple instances in dev)

File: src/lib/db/analytics.ts
  - logSearch(area, lat, lng, category, resultsCount, userAgent): Promise<void>
  - Called after every successful discover request
  - Non-blocking (fire-and-forget, errors caught silently)

File: src/lib/db/popular.ts
  - getPopularAreas(limit: number): Promise<PopularArea[]>
  - Updates popular_areas table from search_log (aggregate query)
  - Cached in Redis (TTL: 1 hour)
  - Powers landing page "Popular areas" suggestions
```

#### 2C.4 — Prisma Migration
```
Run: pnpm prisma migrate dev --name init
  - Creates geocode_cache, search_log, popular_areas tables
  - Generates Prisma client
```

#### 2C.5 — Performance Optimizations
```
Bundle:
  - Analyze bundle with @next/bundle-analyzer
  - Dynamic import for Google Maps (loaded only after first search)
  - Dynamic import for MarkerClusterer (loaded only when needed)
  - Tree-shake unused shadcn/ui components

Images:
  - Google Place photos loaded via next/image with lazy loading
  - Responsive srcset for different viewports
  - Blur placeholder during load
  - WebP format preferred

Fonts:
  - next/font for Plus Jakarta Sans, Space Grotesk (subset: latin)
  - Font display: swap (prevent FOIT)
  - Preload critical fonts

API:
  - Response compression (gzip/brotli via Vercel)
  - API response time logging
  - Connection pooling for database
```

### Phase 2C — Testing Checklist
| # | Test | Type | Pass Criteria |
|---|------|------|---------------|
| T2C.1 | Redis caches geocode result | Integration | Second call returns cached: true |
| T2C.2 | Redis caches discover results | Integration | Second call returns cached: true |
| T2C.3 | Redis cache expires after TTL | Integration | Result returns null after TTL |
| T2C.4 | Search log written to database | Integration | Row exists in search_log table |
| T2C.5 | Popular areas aggregation works | Integration | Returns top areas by search count |
| T2C.6 | Prisma client is singleton in dev | Unit | Same instance across imports |
| T2C.7 | Google Maps loads lazily | Performance | Not in initial bundle, loaded on demand |
| T2C.8 | Images lazy-load below fold | Performance | No image requests until scroll |
| T2C.9 | Fonts don't cause FOIT | Performance | Text visible immediately (font-display: swap) |
| T2C.10 | LCP < 2 seconds | Performance | Lighthouse LCP metric passes |
| T2C.11 | Bundle size < 200KB (first load JS) | Performance | next build output shows < 200KB |
| T2C.12 | Cache hit rate > 70% on repeated searches | Integration | Monitoring shows expected hit rate |

### Phase 2C — Documentation Deliverable
> **File**: `docs/phase-2c-performance-caching.md`
> **Contents**:
> - Caching architecture (Redis key structure, TTLs, cache flow diagrams)
> - Database schema and migration details
> - Analytics pipeline (search logging, popular areas aggregation)
> - Performance optimization inventory (lazy loading, bundle splitting, fonts)
> - Bundle analysis results (before/after sizes)
> - Lighthouse performance audit results
> - API response time benchmarks (with and without cache)

---

## 11. Phase 3A — E2E Testing & Quality Assurance

### Objective
Comprehensive end-to-end testing with Playwright, visual regression testing, accessibility audits, cross-browser testing, and load testing.

### Pre-Conditions
- Phase 2C complete and all tests passing
- All features implemented and functional

### Step-by-Step Implementation

#### 3A.1 — Playwright E2E Test Suites
```
File: src/__tests__/e2e/search.spec.ts
  Tests:
  - Complete search flow: type area → select suggestion → see map + categories
  - Search with "Use my location" button
  - Recent searches appear on revisit
  - Search with invalid area shows error

File: src/__tests__/e2e/discovery.spec.ts
  Tests:
  - Select category → results appear in sidebar + map markers
  - Card shows correct name, rating, distance
  - Card expand shows phone and action buttons
  - "Call Now" has correct tel: href
  - "Directions" opens Google Maps link
  - Switch category → results refresh

File: src/__tests__/e2e/filters.spec.ts
  Tests:
  - "Open Now" filter reduces results
  - Rating filter works at each threshold
  - Radius change updates results and map circle
  - Sort by rating reorders cards
  - Clear filters resets to defaults

File: src/__tests__/e2e/details.spec.ts
  Tests:
  - "View Details" opens detail panel with full info
  - Operating hours display all 7 days
  - Reviews and photos load
  - Back button returns to results list

File: src/__tests__/e2e/mobile.spec.ts
  Tests (viewport: 375x812):
  - Bottom sheet renders with drag handle
  - Category pills scroll horizontally
  - Card tap opens detail in fullscreen overlay
  - Map markers respond to tap

File: src/__tests__/e2e/pwa-seo.spec.ts
  Tests:
  - Area page (/wakad-pune/plumber) renders with results
  - Meta tags present and correct
  - Dark mode toggle works
  - Theme persists after page reload
```

#### 3A.2 — Locality Coverage Testing
```
Test across 5+ Pune localities to verify data quality:
  - Wakad
  - Baner
  - Kothrud
  - Hinjewadi
  - Viman Nagar

For each: verify all 12 categories return results with valid data
```

#### 3A.3 — Accessibility Audit
```
Tools: axe-core + manual testing
  Checklist:
  - All images have alt text
  - All form inputs have labels
  - Color contrast ratios meet WCAG 2.1 AA (4.5:1 for text, 3:1 for large text)
  - Keyboard navigation: Tab through all interactive elements
  - Screen reader: test with NVDA (Windows) or VoiceOver (Mac)
  - Focus management: focus moves logically, no focus traps
  - Reduced motion: animations respect prefers-reduced-motion
```

#### 3A.4 — Cross-Browser Testing
```
Browsers (latest 2 versions):
  - Chrome (desktop + mobile)
  - Safari (desktop + iOS)
  - Firefox (desktop)
  - Edge (desktop)

Test critical flows in each browser
```

#### 3A.5 — Visual Regression Snapshots
```
Playwright screenshot comparisons:
  - Landing page (light + dark)
  - Results view desktop (light + dark)
  - Results view mobile (light + dark)
  - Card expanded state
  - Detail modal/panel
  - Empty state
  - Loading state
  - Filter panel active
```

### Phase 3A — Testing Checklist
| # | Test | Pass Criteria |
|---|------|---------------|
| T3A.1 | All E2E test suites pass | 100% pass rate |
| T3A.2 | 5 Pune localities return valid results | All 12 categories have 1+ result per locality |
| T3A.3 | axe-core reports zero critical/serious issues | Zero violations at "serious" or "critical" level |
| T3A.4 | Keyboard navigation complete | Every interactive element reachable + operable |
| T3A.5 | Chrome, Safari, Firefox, Edge work | No layout breaks or functional failures |
| T3A.6 | Visual regression baselines established | Screenshots saved, no unexpected diffs |
| T3A.7 | Lighthouse accessibility score > 90 | Lighthouse audit passes |
| T3A.8 | All unit + integration tests pass | `pnpm vitest run` — 100% pass |
| T3A.9 | Code coverage > 80% on API routes | Coverage report meets threshold |

### Phase 3A — Documentation Deliverable
> **File**: `docs/phase-3a-testing-qa.md`
> **Contents**:
> - Complete test inventory (every test, what it verifies, pass criteria)
> - E2E test architecture (Playwright config, test helpers, fixtures)
> - Locality coverage matrix (area × category results table)
> - Accessibility audit report (findings, fixes applied)
> - Cross-browser compatibility matrix
> - Visual regression baseline screenshots
> - Code coverage report summary
> - Known issues and their severity

---

## 12. Phase 3B — CI/CD Pipeline & Deployment

### Objective
Set up GitHub Actions CI pipeline, Vercel deployment, environment strategy, monitoring, and automated quality gates.

### Pre-Conditions
- Phase 3A complete and all tests passing
- GitHub repository created
- Vercel account linked

### Step-by-Step Implementation

#### 3B.1 — GitHub Repository Setup
```
1. Create repo: helpnear (private initially)
2. Branch protection on main:
   - Require PR reviews
   - Require status checks (CI must pass)
   - No direct pushes to main
3. Branch strategy:
   - main: production
   - develop: integration
   - feature/*: per-feature branches
   - hotfix/*: urgent fixes
```

#### 3B.2 — GitHub Actions CI Workflow
```
File: .github/workflows/ci.yml
  Triggers: push to main/develop, PR to main/develop

  Jobs:
  1. lint-and-typecheck:
     - Checkout code
     - Setup Node.js 20 + pnpm
     - Install dependencies (pnpm install --frozen-lockfile)
     - Run ESLint (pnpm lint)
     - Run TypeScript check (pnpm tsc --noEmit)

  2. unit-and-integration-tests:
     - Same setup
     - Run Vitest (pnpm vitest run --coverage)
     - Upload coverage report as artifact

  3. build:
     - Same setup
     - Run next build
     - Verify build succeeds

  4. e2e-tests (on PR only):
     - Same setup + install Playwright browsers
     - Run Playwright tests against Vercel preview URL
     - Upload test report + screenshots as artifacts

  5. lighthouse (on PR only):
     - Run Lighthouse CI against preview URL
     - Fail if any score < 90
```

#### 3B.3 — Vercel Deployment Configuration
```
File: vercel.json
  - Framework: Next.js (auto-detected)
  - Build command: pnpm build
  - Environment variables configured in Vercel dashboard (never in code)
  - Preview deployments for every PR
  - Production deployment on merge to main
  - Edge functions for API routes where beneficial

Environment strategy:
  - Development: localhost:3000 (dev API keys)
  - Preview: *.vercel.app (dev API keys)
  - Production: helpnear.in (prod API keys, restricted by referrer)
```

#### 3B.4 — Monitoring Setup
```
Sentry:
  - Install @sentry/nextjs
  - Configure for both client and server
  - Source maps uploaded during build
  - Error grouping and alert rules

Vercel Analytics:
  - Enable Web Vitals tracking
  - Custom events: search, category_select, call_tap, directions_tap

Health monitoring:
  - /api/health endpoint (already built)
  - UptimeRobot / Vercel cron pinging every 60 seconds
```

#### 3B.5 — Pre-GitHub Security Audit
```
Checklist (per CLAUDE.md):
  - [ ] No API keys in any committed file (grep for key patterns)
  - [ ] .env.local in .gitignore
  - [ ] .env.example has placeholder values only
  - [ ] No PII stored server-side beyond analytics
  - [ ] HTTPS enforced (Vercel default)
  - [ ] API keys restricted by referrer in Google Cloud Console
  - [ ] No unused dependencies with known vulnerabilities (pnpm audit)
  - [ ] CSP headers configured (Content-Security-Policy)
```

### Phase 3B — Testing Checklist
| # | Test | Pass Criteria |
|---|------|---------------|
| T3B.1 | CI pipeline runs successfully | All jobs pass (lint, test, build) |
| T3B.2 | Preview deployment works | PR creates working preview URL |
| T3B.3 | Production deployment works | Merge to main deploys successfully |
| T3B.4 | Environment variables are secure | No secrets in code, only in Vercel dashboard |
| T3B.5 | Sentry captures errors | Test error appears in Sentry dashboard |
| T3B.6 | Health endpoint responds | /api/health returns 200 |
| T3B.7 | Security audit passes | Zero critical findings |
| T3B.8 | pnpm audit clean | No high/critical vulnerabilities |

### Phase 3B — Documentation Deliverable
> **File**: `docs/phase-3b-cicd-deployment.md`
> **Contents**:
> - CI/CD pipeline architecture (workflow diagram, job dependencies)
> - GitHub Actions configuration explained (each job, triggers, artifacts)
> - Vercel deployment setup (environment strategy, custom domain)
> - Monitoring and alerting setup (Sentry, Vercel Analytics, health checks)
> - Security audit report and checklist
> - Environment variable management guide
> - How to deploy (manual and automated flows)
> - Rollback procedure

---

## 13. Phase 3C — Launch Preparation & Go-Live

### Objective
Final pre-launch checklist, domain setup, beta testing with real users, feedback collection, and public launch.

### Pre-Conditions
- Phase 3B complete and all tests passing
- Domain registered (helpnear.in or helpnear.com)

### Step-by-Step Implementation

#### 3C.1 — Domain & DNS Setup
```
- Register domain
- Configure DNS in Vercel
- SSL certificate (auto via Vercel/Let's Encrypt)
- Redirect www → apex (or vice versa)
- Verify domain in Google Search Console
```

#### 3C.2 — Pre-Launch Lighthouse Audit
```
Run Lighthouse on production URL for:
  - Performance: target > 90
  - Accessibility: target > 90
  - Best Practices: target > 90
  - SEO: target > 90
  - PWA: target > 90

Fix any issues found until all scores meet targets
```

#### 3C.3 — Beta Testing
```
- Share with 3-5 Pune housing societies
- Collect feedback via:
  - In-app feedback widget (simple form: rating + text)
  - Google Form for structured feedback
- Monitor:
  - Error rates in Sentry
  - API usage in Google Cloud Console
  - Search patterns in search_log table
- Duration: 1-2 weeks
```

#### 3C.4 — Bug Fixes & Iteration
```
- Triage beta feedback
- Fix critical and high-priority bugs
- Implement quick-win suggestions
- Re-run E2E tests after fixes
```

#### 3C.5 — Public Launch
```
- Remove any beta banners/flags
- Submit sitemap to Google Search Console
- Social media announcement
- Share in relevant Pune communities
- Monitor real-time metrics for first 48 hours
```

### Phase 3C — Testing Checklist
| # | Test | Pass Criteria |
|---|------|---------------|
| T3C.1 | Domain resolves correctly | https://helpnear.in loads the app |
| T3C.2 | SSL certificate valid | HTTPS lock icon, no mixed content warnings |
| T3C.3 | All Lighthouse scores > 90 | Audit report shows all green |
| T3C.4 | Beta feedback collected | At least 10 responses with actionable insights |
| T3C.5 | Zero critical bugs at launch | Sentry shows no critical/high errors |
| T3C.6 | Search Console indexed | Area pages appearing in Google Search |
| T3C.7 | API costs within budget | Google Cloud Console shows < $200/month |

### Phase 3C — Documentation Deliverable
> **File**: `docs/phase-3c-launch.md`
> **Contents**:
> - Domain and DNS configuration
> - Final Lighthouse audit report (screenshots of all scores)
> - Beta testing summary (feedback themes, metrics, changes made)
> - Launch checklist (everything verified before go-live)
> - Post-launch monitoring plan
> - Known limitations and planned improvements
> - Incident response procedure

---

## 14. Documentation Protocol

### Per-Phase Documentation Structure
Each phase document (`docs/phase-X-*.md`) follows this template:

```markdown
# Phase X — [Phase Name]

## Overview
- What was built in this phase
- Why it was needed (business/technical justification)
- Key decisions made

## Architecture
- System design for this phase's features
- Diagrams (component hierarchy, data flow, state)
- How this integrates with previous phases

## Implementation Details
- File-by-file breakdown of what was created/modified
- Code patterns used and why
- Third-party libraries added and justification

## API Reference (if applicable)
- Endpoint specifications with request/response examples
- Error codes and messages
- Rate limiting and caching behavior

## Testing
- Tests written and their purpose
- Test results summary
- Coverage metrics

## Challenges & Solutions
- Problems encountered during implementation
- How they were solved
- Alternative approaches considered and why they were rejected

## Interview-Ready Talking Points
- 3-5 bullet points suitable for discussing this phase in a technical interview
- Key technical decisions and their trade-offs
- What you would do differently with hindsight
```

### Master Documentation Index
```
File: docs/README.md
  - Project overview with architecture diagram
  - Links to all phase documents
  - Quick-start guide for new developers
  - Links to external resources (APIs, design system, etc.)
```

---

## 15. Progress Tracker

| Phase | Description | Status | Tests | Docs |
|-------|-------------|--------|-------|------|
| **Phase 0** | Foundation & Scaffolding | Not Started | -- | -- |
| **Phase 1A** | Search & Geocoding | Not Started | -- | -- |
| **Phase 1B** | Map & Service Discovery | Not Started | -- | -- |
| **Phase 1C** | Sidebar, Cards & Sync | Not Started | -- | -- |
| **Phase 1D** | Filters, Sorting & Polish | Not Started | -- | -- |
| **Phase 2A** | Mobile Responsive | Not Started | -- | -- |
| **Phase 2B** | PWA, SEO & Dark Mode | Not Started | -- | -- |
| **Phase 2C** | Performance & Caching | Not Started | -- | -- |
| **Phase 3A** | E2E Testing & QA | Not Started | -- | -- |
| **Phase 3B** | CI/CD & Deployment | Not Started | -- | -- |
| **Phase 3C** | Launch Preparation | Not Started | -- | -- |

**Legend**: Not Started | In Progress | Complete | Blocked

---

> **Next Step**: Review this plan and approve to begin Phase 0 implementation.
