import { NextRequest, NextResponse } from "next/server";
import { discoverRequestSchema } from "@/lib/validators/schemas";
import { discoverServices } from "@/lib/tomtom/places";
import { CATEGORY_MAP } from "@/lib/constants/categories";
import { cacheGet, cacheSet, discoverKey, CACHE_CONFIG } from "@/lib/cache/redis";
import { logSearch } from "@/lib/db/prisma";
import type { ServiceResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = discoverRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { lat, lng, category, radius, sort } = parsed.data;

    if (!CATEGORY_MAP.has(category)) {
      return NextResponse.json(
        { error: `Unknown category: ${category}` },
        { status: 400 }
      );
    }

    const cacheK = discoverKey(lat, lng, category, radius);

    // Check cache first
    const cached = await cacheGet<ServiceResult[]>(cacheK);
    if (cached) {
      return NextResponse.json({
        results: cached,
        meta: {
          area: "",
          category,
          radius,
          totalResults: cached.length,
          cached: true,
        },
      });
    }

    // Call Google API
    const results = await discoverServices(lat, lng, category, radius, sort);

    // Store in cache
    await cacheSet(cacheK, results, CACHE_CONFIG.discoverTtl);

    // Log search for analytics (non-blocking)
    const userAgent = request.headers.get("user-agent") ?? "";
    void logSearch({
      areaText: "",
      lat,
      lng,
      category,
      resultsCount: results.length,
      userAgent,
    });

    return NextResponse.json({
      results,
      meta: {
        area: "",
        category,
        radius,
        totalResults: results.length,
        cached: false,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Discovery failed";

    if (message.includes("rate limit")) {
      return NextResponse.json({ error: message }, { status: 429 });
    }

    if (message.includes("not configured")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    console.error("[/api/discover] Error:", message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
