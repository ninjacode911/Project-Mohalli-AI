import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("renders the landing page with brand name", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Mohalla AI" })
    ).toBeVisible();
  });

  test("shows search bar with placeholder", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(
      "Enter your area, society, or PIN code..."
    );
    await expect(searchInput).toBeVisible();
  });

  test("shows popular areas", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Wakad, Pune")).toBeVisible();
    await expect(page.getByText("Baner, Pune")).toBeVisible();
  });

  test("shows category preview", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("12 Service Categories")).toBeVisible();
  });

  test("has theme toggle button", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /theme/i });
    await expect(toggle).toBeVisible();
  });
});

test.describe("API Health", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.name).toBe("Mohalla AI");
  });

  test("categories endpoint returns 12+ categories", async ({ request }) => {
    const response = await request.get("/api/categories");
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data.categories.length).toBeGreaterThanOrEqual(12);
  });
});

test.describe("API Validation", () => {
  test("geocode rejects empty area", async ({ request }) => {
    const response = await request.post("/api/geocode", {
      data: { area: "" },
    });
    expect(response.status()).toBe(400);
  });

  test("discover rejects unknown category", async ({ request }) => {
    const response = await request.post("/api/discover", {
      data: { lat: 18.59, lng: 73.77, category: "fake" },
    });
    expect(response.status()).toBe(400);
  });

  test("autocomplete rejects short input", async ({ request }) => {
    const response = await request.post("/api/autocomplete", {
      data: { input: "W" },
    });
    expect(response.status()).toBe(400);
  });
});

test.describe("SEO", () => {
  test("sitemap.xml is accessible", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain("<urlset");
  });

  test("robots.txt is accessible", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBe(true);
    const text = await response.text();
    expect(text).toContain("User-Agent");
    expect(text).toContain("sitemap");
  });
});
