import type { MetadataRoute } from "next";
import { POPULAR_AREAS } from "@/lib/constants/config";
import { CATEGORIES } from "@/lib/constants/categories";
import { slugify } from "@/lib/utils/index";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://mohalla.ai";

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Generate area + category combination pages
  for (const area of POPULAR_AREAS) {
    const areaSlug = slugify(`${area.name} ${area.city}`);

    for (const category of CATEGORIES) {
      routes.push({
        url: `${baseUrl}/${areaSlug}/${category.id}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  return routes;
}
