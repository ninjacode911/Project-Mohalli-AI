# Phase 1: Core MVP

**Status:** Complete
**Timeline:** Week 3-6
**Objective:** Build the complete service discovery experience — from searching an area, to viewing categorized results on a map, to calling a service provider.

---

## What Was Built

### 1. Search & Geocoding

**SearchBar** (`src/components/search/SearchBar.tsx`)
The primary user interaction point. Features:

- **Text input** with debounced autocomplete (300ms delay)
- **Autocomplete dropdown** powered by TomTom Fuzzy Search API
- **Geolocation button** — browser GPS with PERMISSION_DENIED / TIMEOUT handling
- **Recent searches** — stored in Zustand, shown on empty focus
- **Keyboard navigation** — Arrow up/down, Enter to select, Escape to close
- **ARIA compliance** — `role="combobox"`, `aria-expanded`, `aria-activedescendant`
- **Loading states** — spinner during geocoding, disabled button while searching
- **Error display** — inline error message below the search bar

**Flow:** User types area name -> debounced autocomplete suggestions appear -> user selects or presses Enter -> `/api/geocode` resolves to lat/lng -> map centers on location.

**API Route: `/api/geocode`** (`src/app/api/geocode/route.ts`)
- Validates input via `geocodeRequestSchema` (min 2 chars, max 200, trimmed)
- Checks in-memory cache first (30-day TTL)
- Calls TomTom Geocoding API with `countrySet=IN`
- Caches result and returns `{ lat, lng, formattedAddress }`
- Error responses: 400 (validation), 404 (not found), 429 (rate limit), 503 (not configured), 500 (unexpected)

**API Route: `/api/autocomplete`** (`src/app/api/autocomplete/route.ts`)
- Validates via `autocompleteRequestSchema`
- Calls TomTom Fuzzy Search with `typeahead=true`
- Returns up to 5 suggestions with `mainText` and `secondaryText` for display

### 2. Category-Based Service Discovery

**22 Service Categories** (`src/lib/constants/categories.ts`)

Organized into groups:
| Group | Categories |
|-------|-----------|
| Home & Repair | Plumber, Electrician, Carpenter, Painter, Pest Control, AC Repair |
| Auto | Mechanic, Petrol Pump |
| Health | Doctor, Dentist, Pharmacy, Pet/Vet |
| Daily Essentials | Grocery, Hardware, ATM/Bank |
| Lifestyle | Salon, Gym, Laundry, Restaurant |
| Services | Computer/Phone, Tuition, Courier, Tailor |

Each category maps to TomTom POI types and a fallback keyword for search.

**CategoryPills** (`src/components/category/CategoryPills.tsx`)
- Horizontally scrollable pill buttons with Lucide icons
- Active state highlights selected category in primary color
- **AbortController pattern** — cancels in-flight requests when rapidly switching categories
- Scroll buttons visible on desktop (`lg:flex`)

**API Route: `/api/discover`** (`src/app/api/discover/route.ts`)
- Validates via `discoverRequestSchema` (lat/lng bounds, radius 100-50000m)
- Validates category exists in `CATEGORY_MAP`
- Checks cache (24-hour TTL, keyed by rounded lat/lng + category + radius)
- Calls TomTom POI Search API
- **Auto-expanding radius:** If no results at the user's radius, progressively tries 5km, 10km, 25km, 50km
- Logs search for analytics (non-blocking `void logSearch()`)
- Returns sorted results with distance calculated via Haversine formula

**API Route: `/api/details/:id`** (`src/app/api/details/[id]/route.ts`)
- Validates placeId via `placeIdSchema` (1-300 chars)
- Calls TomTom Place by ID API
- Returns full `PlaceDetail` with phone, website, hours, address

**API Route: `/api/categories`** (`src/app/api/categories/route.ts`)
- Static endpoint returning all 22 categories
- `Cache-Control: public, max-age=86400` — cached for 24 hours

### 3. Map Display & Interaction

**MapContainer** (`src/components/map/MapContainer.tsx`)
Built with **Leaflet** via `react-leaflet`, dynamically imported (SSR disabled via `MapWrapper`).

Features:
- **TomTom tile layer** when API key configured, falls back to OpenStreetMap
- **Search marker** — orange dot at the searched location
- **Radius circle** — subtle overlay showing the search radius
- **Numbered result markers** — 1-20 with orange circles
- **Active marker scaling** — clicked/hovered marker grows larger
- **Popup on click** — shows name, rating, distance, phone with tap-to-call
- **Map-sidebar sync** — clicking a marker scrolls the sidebar to that card

**MapWrapper** (`src/components/map/MapWrapper.tsx`)
- `next/dynamic` with `ssr: false` — Leaflet requires the DOM
- Shows skeleton loading state while the map loads

### 4. Results Display — Sidebar

**Sidebar** (`src/components/sidebar/Sidebar.tsx`)
Master component managing the sidebar state machine:
1. **No category:** "Select a category" prompt
2. **Loading:** Skeleton loading state
3. **No results:** Empty state with message
4. **Results:** Filtered/sorted result cards
5. **Detail view:** Full place detail panel

**ResultCard** (`src/components/sidebar/ResultCard.tsx`)
Expandable card for each result:
- **Collapsed:** Number badge, name, rating stars, distance, open/closed indicator, address
- **Expanded:** Full address, hours, action buttons (Call Now, Directions, Details)
- **Hover sync:** `onMouseEnter`/`onMouseLeave` highlights the corresponding map marker
- **Keyboard accessible:** `tabIndex`, `onKeyDown` for Enter/Space
- **Open/Closed indicator:** Green pulse for open, red dot for closed, gray for "Hours N/A"

**CardDetail** (`src/components/sidebar/CardDetail.tsx`)
Full detail view for a single place:
- Back button to return to results
- Name, rating, open/closed status
- Full address, phone number, website link
- Action buttons: Call, Directions, Share (copies URL to clipboard)
- Operating hours (7-day schedule with today highlighted)
- User reviews (up to 3, with star ratings)
- Loading skeleton and error state handling
- **Cancellation pattern:** `cancelled` flag prevents state updates after unmount

### 5. Filtering & Sorting

**FilterPanel** (`src/components/filters/FilterPanel.tsx`)
- **Open Now toggle** — green highlighted when active
- **Rating filter** — dropdown: Any, 3.0+, 3.5+, 4.0+, 4.5+
- **Radius filter** — dropdown: 1km, 2km, 3km, 5km
- **Clear all** — button with active filter count, resets to defaults

**SortDropdown** (`src/components/filters/SortDropdown.tsx`)
- Three options: Nearest first, Highest rated, Most reviewed
- Sorting applied client-side via `applyFilters()` utility

**applyFilters** (`src/lib/utils/filters.ts`)
- Pure function — returns new array, never mutates
- Applies: openNow filter, minRating filter, then sort

### 6. Responsive Layout

**DiscoverLayout** (`src/components/layout/DiscoverLayout.tsx`)
Split-panel responsive design:
- **Desktop (lg+):** 370px sidebar left + remaining map right
- **Mobile (<lg):** Full-screen map + bottom sheet overlay
- Loading indicator and error banner for both layouts

**MobileBottomSheet** (`src/components/layout/MobileBottomSheet.tsx`)
- Three snap positions: collapsed (80px), half (50vh), expanded (85vh)
- **Touch gestures:** Swipe up/down with 50px threshold
- Drag handle + tap to cycle through positions
- `overscroll-contain` prevents body scroll interference

**TopBar** (`src/components/layout/TopBar.tsx`)
- Sticky header (z-40) with backdrop blur
- Logo (links to home), SearchBar (centered), ThemeToggle + location display

### 7. State Management

**Zustand Store** (`src/store/useAppStore.ts`)
Single store with four state domains:

| Domain | State Fields | Key Actions |
|--------|-------------|-------------|
| Search | `searchQuery`, `selectedLocation`, `recentSearches`, `isSearching`, `searchError` | `setSearchQuery`, `setSelectedLocation`, `addRecentSearch`, `clearSearch` |
| Discovery | `selectedCategory`, `results`, `isDiscovering`, `discoverError`, `activeMarkerId` | `setSelectedCategory`, `setResults`, `setActiveMarker` |
| Map | `mapCenter`, `mapZoom` | `setMapCenter`, `setMapZoom` |
| Filters | `filters` (openNow, minRating, radius), `sortBy` | `setFilter`, `setSortBy`, `resetFilters` |

### 8. Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useDebounce<T>` | `src/hooks/useDebounce.ts` | Debounces a value by specified delay |
| `useGeolocation` | `src/hooks/useGeolocation.ts` | Browser geolocation with error handling |
| `useMapSync` | `src/hooks/useMapSync.ts` | Bidirectional card-map hover/click sync with debounce |

### 9. TomTom API Integration

Three server-side wrappers in `src/lib/tomtom/`:

| File | API | Purpose |
|------|-----|---------|
| `geocode.ts` | TomTom Geocoding | Area name to lat/lng |
| `autocomplete.ts` | TomTom Fuzzy Search | Typeahead suggestions |
| `places.ts` | TomTom POI Search + Place by ID | Discover services + get details |

All wrappers:
- Use `TOMTOM_API_KEY` (server-side only, never exposed to client)
- Handle HTTP errors (403, 429, generic)
- Return typed responses matching the `@/types` interfaces

**Auto-expanding radius** in `places.ts`: If no results at the user's requested radius, it progressively tries 5km, 10km, 25km, 50km — ensuring users always see results.

---

## Data Flow

```
User types "Wakad, Pune"
  -> debounce (300ms)
  -> POST /api/autocomplete { input: "Wakad, Pune" }
  -> TomTom Fuzzy Search API
  -> Dropdown: ["Wakad, Pimpri-Chinchwad, MH", ...]

User clicks suggestion
  -> POST /api/geocode { area: "Wakad, Pimpri-Chinchwad, MH" }
  -> Check cache -> miss -> TomTom Geocoding API
  -> Store: { lat: 18.5943, lng: 73.7735, formattedAddress: "..." }
  -> Map centers on location

User clicks "Plumber" category
  -> POST /api/discover { lat: 18.5943, lng: 73.7735, category: "plumber", radius: 3000 }
  -> Check cache -> miss -> TomTom POI Search (keyword: "plumber plumbing services")
  -> Results sorted by distance -> cached (24h) -> returned
  -> Store: results[] -> Sidebar renders cards, Map renders markers

User clicks result card
  -> Card expands in-place (phone, address, directions)
  -> Map marker scales up

User clicks "Details"
  -> GET /api/details/[placeId]
  -> TomTom Place by ID API
  -> Full detail panel: hours, reviews, photos, website
```

---

## Testing Coverage

**13 test files, 88 tests — all passing:**

| Test File | What It Tests | # Tests |
|-----------|--------------|---------|
| `validators.test.ts` | Zod schemas (geocode, autocomplete, discover, placeId) | ~20 |
| `google-geocode.test.ts` | TomTom geocode wrapper (success, errors, missing key) | ~8 |
| `google-autocomplete.test.ts` | TomTom autocomplete wrapper | ~8 |
| `google-places.test.ts` | TomTom places wrapper (discover + details) | ~12 |
| `store.test.ts` | Zustand store actions and state transitions | ~10 |
| `utils.test.ts` | Haversine, formatDistance, slugify | ~8 |
| `config.test.ts` | Configuration constants | ~5 |
| `categories.test.ts` | Category map, validation | ~5 |
| `filters.test.ts` | Filter/sort logic (openNow, rating, distance/rating/reviews sort) | ~6 |
| `cache.test.ts` | In-memory cache get/set/TTL | ~3 |
| `useDebounce.test.ts` | Debounce hook timing | ~3 |
| `useMapSync.test.ts` | Map sync hover/click | ~2 |
| `discover.test.ts` | Discover API route integration | ~4 |

**Note:** Test files are named `google-*.test.ts` from the original Google Maps implementation but now test the TomTom wrappers.

---

## Component Tree

```
Home (page.tsx)
  |-- [No location] Landing Page
  |     |-- TopBar
  |     |     |-- Logo (Link)
  |     |     |-- SearchBar
  |     |     |-- ThemeToggle
  |     |-- Hero (app name, tagline)
  |     |-- Popular Areas (clickable pills)
  |     |-- Categories Preview (first 6)
  |
  |-- [Location selected] Discover View
        |-- TopBar (same)
        |-- CategoryPills (22 scrollable pills)
        |-- DiscoverLayout
              |-- Desktop Sidebar (370px)
              |     |-- Sidebar
              |           |-- [No category] "Select a category"
              |           |-- [Loading] LoadingState (skeletons)
              |           |-- [No results] EmptyState
              |           |-- [Results] FilterPanel + SortDropdown + ResultCards
              |           |-- [Detail] CardDetail
              |
              |-- MapWrapper -> MapContainer (Leaflet)
              |     |-- TileLayer (TomTom or OSM)
              |     |-- Search Marker
              |     |-- Radius Circle
              |     |-- Numbered Result Markers with Popups
              |
              |-- MobileBottomSheet (swipeable, 3 snap positions)
                    |-- Sidebar (same as desktop)
```

---

## API Endpoints Summary

| Method | Endpoint | Input | Output | Cache |
|--------|----------|-------|--------|-------|
| `POST` | `/api/geocode` | `{ area: string }` | `{ lat, lng, formattedAddress, cached }` | 30 days |
| `POST` | `/api/autocomplete` | `{ input: string, location? }` | `{ suggestions: [...] }` | None |
| `POST` | `/api/discover` | `{ lat, lng, category, radius?, sort? }` | `{ results: [...], meta: {...} }` | 24 hours |
| `GET` | `/api/details/:id` | Path param: placeId | `PlaceDetail` object | None |
| `GET` | `/api/categories` | None | `{ categories: [...] }` | 24h (HTTP) |
| `GET` | `/api/health` | None | `{ status, name, version, timestamp }` | None |

---

## Security Measures

| Area | Implementation |
|------|---------------|
| API keys | `TOMTOM_API_KEY` server-side only; `NEXT_PUBLIC_TOMTOM_API_KEY` for tiles (restricted) |
| Input validation | Zod schemas on all API endpoints with length/range bounds |
| XSS prevention | No `dangerouslySetInnerHTML` with user input; React auto-escaping |
| Error sanitization | User-facing errors are generic; details logged server-side only |
| Race conditions | AbortController in CategoryPills; `cancelled` flag in SearchBar/CardDetail |
| CORS | Same-origin via Next.js API routes |
| Headers | HSTS, X-Frame-Options DENY, CSP-adjacent protections in vercel.json |

---

## Known Limitations (MVP)

1. **No user accounts** — planned for Phase 2
2. **No saved/bookmarked places** — planned for Phase 2
3. **No real-time reviews** — TomTom doesn't provide user reviews (empty array returned)
4. **Rating is estimated** — TomTom provides a `score`, mapped to 0-5 scale
5. **Photos not available** — TomTom free tier doesn't include place photos
6. **Dead code:** `src/lib/google/` directory contains unused Google API wrappers from original implementation. Safe to remove in cleanup.

---

## Verification

| Gate | Result |
|------|--------|
| `pnpm lint` | 0 errors |
| `pnpm typecheck` | 0 errors |
| `pnpm test` | 88/88 pass |
| `pnpm build` | Success (11 routes, 3.5s compile) |
| Zero `any` types | Confirmed via ESLint + grep |
| No secrets in source | Confirmed via grep audit |
| API keys server-side | Confirmed — `TOMTOM_API_KEY` only in `src/lib/tomtom/*` |
