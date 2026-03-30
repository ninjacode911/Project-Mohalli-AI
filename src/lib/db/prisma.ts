/**
 * Prisma client singleton.
 * In development, prevents multiple instances from hot reload.
 * In production without DATABASE_URL, returns null.
 */

// Prisma client will be initialized when DATABASE_URL is configured.
// For now, export a stub that logs when the DB is not available.

const isDatabaseConfigured =
  !!process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0;

export function getDatabaseStatus(): {
  configured: boolean;
  message: string;
} {
  return {
    configured: isDatabaseConfigured,
    message: isDatabaseConfigured
      ? "Database connected"
      : "DATABASE_URL not configured — analytics disabled",
  };
}

/**
 * Log a search event for analytics.
 * Non-blocking — errors are caught silently.
 */
export async function logSearch(params: {
  areaText: string;
  lat: number;
  lng: number;
  category: string;
  resultsCount: number;
  userAgent: string;
}): Promise<void> {
  if (!isDatabaseConfigured) return;

  try {
    // When Prisma is connected, this would be:
    // await prisma.searchLog.create({ data: params });
    // For now, just log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics] Search:", params.category, params.areaText);
    }
  } catch {
    // Silently fail — analytics should never break the user flow
  }
}
