# Mohalla AI

**Neighbourhood Service Discovery Platform**

Mohalla AI helps residents of Indian cities instantly find trusted local services — plumbers, electricians, pharmacies, dentists, mechanics, and 23 categories — simply by entering their area or locality name. The platform delivers real-time, location-aware results with phone numbers, addresses, distance, and open/closed status on an interactive map.

> *"Make every neighbourhood instantly navigable — so no one ever feels like a stranger where they live."*

![Landing Page](Screenshots/1.png)

---

## Features

- **One-search discovery** — Type your area name, get categorized service results instantly
- **23 service categories** — Plumber, Electrician, Carpenter, Painter, Pest Control, AC Repair, Mechanic, Doctor, Dentist, Pharmacy, Pet/Vet, Grocery, Hardware, ATM/Bank, Salon, Gym, Laundry, Restaurant, Computer/Phone Repair, Tuition, Courier, Tailor, Petrol Pump
- **Interactive map** — Leaflet-powered map with numbered markers synced to sidebar results
- **Smart search** — Autocomplete suggestions as you type, powered by TomTom Fuzzy Search
- **GPS location** — "Use my current location" button for instant area detection
- **Auto-expanding radius** — Never shows "no results" — automatically widens search up to 50km to find the nearest facility
- **Real-time data** — Phone numbers, addresses, and distance from TomTom's verified POI database
- **Filters & sorting** — Filter by "Open Now", minimum rating, search radius. Sort by distance, rating, or reviews
- **Dark mode** — Full dark/light/system theme support
- **Mobile responsive** — Bottom sheet pattern on mobile, split-panel on desktop
- **Card-map sync** — Hover a card to highlight its map pin and vice versa
- **PWA ready** — Installable as a Progressive Web App
- **SEO optimized** — Dynamic sitemap, robots.txt, OpenGraph tags, structured metadata
- **Cached API calls** — In-memory cache with TTL to minimize API usage (Redis-ready)
- **100% free** — Uses TomTom's free tier (2,500 requests/day, no credit card required)

---

## Screenshots

### Landing Page — Search & Popular Areas
![Landing Page](Screenshots/1.png)

### Autocomplete — Live Search Suggestions
![Autocomplete](Screenshots/2.png)

### Results View — Split Panel with Map (Light Mode)
![Results Light](Screenshots/3.png)

### Results View — Dark Mode
![Results Dark](Screenshots/4.png)

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | SSR, API routes, file-based routing |
| **Language** | TypeScript 5 (strict mode) | Type safety across the entire codebase |
| **UI** | React 19 | Component-based UI |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with pre-built components |
| **Maps** | Leaflet + OpenStreetMap tiles | Interactive map display (free, no API key) |
| **Geocoding & Search** | TomTom Search API | Geocoding, autocomplete, POI nearby search |
| **State** | Zustand | Lightweight global state management |
| **Validation** | Zod v4 | Runtime schema validation for all API inputs |
| **Testing** | Vitest + Playwright | 88 unit/integration tests + 12 E2E tests |
| **ORM** | Prisma v7 | PostgreSQL schema (analytics, caching) |
| **Cache** | In-memory (Redis-ready) | TTL-based caching for API responses |
| **CI/CD** | GitHub Actions + Vercel | Automated lint, test, build, deploy pipeline |
| **Package Manager** | pnpm | Fast, disk-efficient dependency management |

---

## Architecture

```
Client (Browser)
├── React Frontend (Next.js App Router)
├── Leaflet Map (OpenStreetMap tiles)
└── Zustand Store (search, discovery, filters)
        │
        │ REST API calls
        ▼
API Layer (Next.js API Routes)
├── POST /api/geocode        → TomTom Geocoding API
├── POST /api/autocomplete   → TomTom Fuzzy Search API
├── POST /api/discover       → TomTom POI Search API
├── GET  /api/details/[id]   → TomTom Place Details API
├── GET  /api/categories     → Static category list
└── GET  /api/health         → Health check
        │
        ▼
Cache Layer (In-memory / Redis)
├── Geocode cache (30-day TTL)
├── Discover cache (24-hour TTL)
└── Details cache (24-hour TTL)
```

---

## Project Structure

```
src/
├── app/                    # Next.js pages & API routes
│   ├── api/                # REST API endpoints
│   │   ├── geocode/        # Area → coordinates
│   │   ├── autocomplete/   # Search suggestions
│   │   ├── discover/       # Nearby service search
│   │   ├── details/[id]/   # Place details
│   │   ├── categories/     # Category list
│   │   └── health/         # Health check
│   ├── layout.tsx          # Root layout (fonts, theme, metadata)
│   ├── page.tsx            # Landing + discover page
│   ├── sitemap.ts          # Dynamic sitemap generation
│   └── robots.ts           # Crawler rules
├── components/
│   ├── search/             # SearchBar with autocomplete
│   ├── map/                # MapContainer (Leaflet), MapWrapper
│   ├── sidebar/            # Sidebar, ResultCard, CardDetail, EmptyState
│   ├── category/           # CategoryPills (23 categories)
│   ├── filters/            # FilterPanel, SortDropdown
│   ├── layout/             # TopBar, DiscoverLayout, MobileBottomSheet, ThemeToggle
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── tomtom/             # TomTom API clients (geocode, autocomplete, places)
│   ├── cache/              # Redis/in-memory cache layer
│   ├── db/                 # Prisma client & analytics
│   ├── validators/         # Zod schemas
│   ├── constants/          # Categories, config, design tokens
│   └── utils/              # Haversine distance, slugify, filters
├── hooks/                  # useDebounce, useGeolocation, useMapSync
├── store/                  # Zustand store (search, discovery, map, filters)
├── types/                  # TypeScript interfaces
└── __tests__/              # 88 unit + 12 E2E tests
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/ninjacode911/Project-Mohalli-AI.git
cd Project-Mohalli-AI

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and add your TomTom API key
# Get a free key at https://developer.tomtom.com (no credit card needed)

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TOMTOM_API_KEY` | Yes | Server-side TomTom API key |
| `NEXT_PUBLIC_TOMTOM_API_KEY` | Yes | Client-side TomTom API key (for map tiles) |
| `REDIS_URL` | No | Redis connection URL (uses in-memory fallback) |
| `DATABASE_URL` | No | PostgreSQL connection URL (analytics disabled without it) |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | TypeScript strict mode check |
| `pnpm test` | Run unit & integration tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm format` | Format code with Prettier |

---

## Testing

The project has comprehensive test coverage:

- **88 unit/integration tests** covering API services, validators, store, hooks, cache, filters, and utilities
- **12 E2E tests** covering homepage rendering, API endpoints, validation, and SEO

```bash
# Run all unit/integration tests
pnpm test

# Run E2E tests (requires Playwright browsers)
pnpm exec playwright install chromium
pnpm test:e2e
```

---

## API Documentation

### POST /api/geocode
Converts an area name to coordinates.
```json
// Request
{ "area": "Wakad, Pune" }

// Response
{ "lat": 18.5649, "lng": 73.8132, "formattedAddress": "Wakad, Pune, Maharashtra", "cached": false }
```

### POST /api/discover
Finds services near a location by category.
```json
// Request
{ "lat": 18.59, "lng": 73.77, "category": "plumber", "radius": 5000 }

// Response
{
  "results": [
    { "placeId": "...", "name": "Bhagyashree Services", "distance": 0.5, "phone": "+91 90964 50265", "address": "..." }
  ],
  "meta": { "category": "plumber", "totalResults": 9, "cached": false }
}
```

### POST /api/autocomplete
Returns search suggestions as user types.
```json
// Request
{ "input": "Wakad" }

// Response
{ "suggestions": [{ "placeId": "...", "mainText": "Wakad", "secondaryText": "Pimpri Chinchwad, Maharashtra" }] }
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com)
3. Add environment variables (`TOMTOM_API_KEY`, `NEXT_PUBLIC_TOMTOM_API_KEY`)
4. Deploy — Vercel auto-detects Next.js and handles everything

### CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on every push:
- ESLint + TypeScript check
- Unit & integration tests with coverage
- Production build verification
- E2E tests on pull requests

---

## Service Categories (23)

| Category | Search Query | Icon |
|----------|-------------|------|
| Plumber | plumber plumbing services | Wrench |
| Electrician | electrician electrical repair | Zap |
| Carpenter | carpenter furniture woodwork | Hammer |
| Painter | painter house painting contractor | Paintbrush |
| Pest Control | pest control termite cockroach | Bug |
| AC Repair | air conditioner repair | Snowflake |
| Mechanic | car mechanic auto repair | Car |
| Petrol Pump | petrol pump gas station | Fuel |
| Doctor | doctor clinic hospital | Stethoscope |
| Dentist | dentist dental clinic | SmilePlus |
| Pharmacy | pharmacy medical store chemist | Pill |
| Pet / Vet | veterinary pet shop vet clinic | PawPrint |
| Grocery | grocery supermarket kirana | ShoppingCart |
| Hardware | hardware store building materials | HardHat |
| ATM / Bank | ATM bank branch | Landmark |
| Salon | salon beauty parlour haircut | Scissors |
| Gym | gym fitness center | Dumbbell |
| Laundry | laundry dry cleaning ironing | Shirt |
| Restaurant | restaurant food dining | UtensilsCrossed |
| Computer / Phone | computer repair mobile phone | Monitor |
| Tuition | tuition coaching classes academy | GraduationCap |
| Courier | courier delivery DTDC Blue Dart | Package |
| Tailor | tailor stitching alteration | Ruler |

---

## Cost

**$0/month** — The entire platform runs on free tiers:

| Service | Free Tier |
|---------|-----------|
| TomTom APIs | 2,500 requests/day (no credit card) |
| Vercel Hosting | Free for hobby projects |
| OpenStreetMap Tiles | Unlimited (open source) |
| Upstash Redis | 10K commands/day free |
| Supabase PostgreSQL | 500MB free |

---

## Roadmap

- [ ] User accounts & saved places (NextAuth.js)
- [ ] Community reviews & tips
- [ ] Hindi language support
- [ ] Push notifications for deals
- [ ] Service provider dashboard
- [ ] Multi-city expansion beyond Pune

---

## License

This project is private and proprietary.

---

## Author

**Navnit** — [@ninjacode911](https://github.com/ninjacode911)
