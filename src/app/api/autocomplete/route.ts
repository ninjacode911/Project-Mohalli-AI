import { NextRequest, NextResponse } from "next/server";
import { autocompleteRequestSchema } from "@/lib/validators/schemas";
import { getAutocompleteSuggestions } from "@/lib/tomtom/autocomplete";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = autocompleteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { input, location } = parsed.data;
    const suggestions = await getAutocompleteSuggestions(input, location);

    return NextResponse.json({ suggestions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Autocomplete failed";

    if (message.includes("rate limit")) {
      return NextResponse.json({ error: message }, { status: 429 });
    }

    if (message.includes("not configured")) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    console.error("[/api/autocomplete] Error:", message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
