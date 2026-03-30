import { NextRequest, NextResponse } from "next/server";
import { geocodeRequestSchema } from "@/lib/validators/schemas";
import { geocodeArea } from "@/lib/tomtom/geocode";
import { cacheGet, cacheSet, geocodeKey, CACHE_CONFIG } from "@/lib/cache/redis";
import type { GeocodeResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = geocodeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { area } = parsed.data;
    const cacheK = geocodeKey(area);

    // Check cache first
    const cached = await cacheGet<GeocodeResponse>(cacheK);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // Call Google API
    const result = await geocodeArea(area);

    // Store in cache
    await cacheSet(cacheK, result, CACHE_CONFIG.geocodeTtl);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Geocoding failed";

    if (message.includes("No results found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    if (message.includes("rate limit")) {
      return NextResponse.json({ error: message }, { status: 429 });
    }

    if (message.includes("not configured")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    console.error("[/api/geocode] Error:", message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
