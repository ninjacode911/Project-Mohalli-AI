import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/constants/categories";

export function GET() {
  const categories = CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
  }));

  return NextResponse.json(
    { categories },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    }
  );
}
