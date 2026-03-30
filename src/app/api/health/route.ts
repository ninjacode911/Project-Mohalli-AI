import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/lib/constants/config";

export function GET() {
  return NextResponse.json({
    status: "ok",
    name: APP_CONFIG.name,
    version: APP_CONFIG.version,
    timestamp: new Date().toISOString(),
  });
}
