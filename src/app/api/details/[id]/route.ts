import { NextRequest, NextResponse } from "next/server";
import { placeIdSchema } from "@/lib/validators/schemas";
import { getPlaceDetails } from "@/lib/tomtom/places";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = placeIdSchema.safeParse(id);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid place ID" },
        { status: 400 }
      );
    }

    const details = await getPlaceDetails(parsed.data);
    return NextResponse.json(details);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get place details";

    if (message.includes("Place not found")) {
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

    console.error("[/api/details] Error:", message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
