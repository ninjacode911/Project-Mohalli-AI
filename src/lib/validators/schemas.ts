import { z } from "zod/v4";

// --- Geocode ---
export const geocodeRequestSchema = z.object({
  area: z
    .string()
    .min(2, "Area name must be at least 2 characters")
    .max(200, "Area name too long")
    .transform((val) => val.trim()),
});

export type GeocodeRequestInput = z.input<typeof geocodeRequestSchema>;

export const geocodeResponseSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  formattedAddress: z.string(),
  cached: z.boolean(),
});

// --- Autocomplete ---
export const autocompleteRequestSchema = z.object({
  input: z
    .string()
    .min(2, "Input must be at least 2 characters")
    .max(200, "Input too long")
    .transform((val) => val.trim()),
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

export type AutocompleteRequestInput = z.input<
  typeof autocompleteRequestSchema
>;

// --- Discover ---
export const discoverRequestSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  category: z.string().min(1, "Category is required"),
  radius: z.number().min(100).max(50000).optional().default(3000),
  sort: z.enum(["distance", "rating", "reviews"]).optional().default("distance"),
});

export type DiscoverRequestInput = z.input<typeof discoverRequestSchema>;

// --- Place Details ---
export const placeIdSchema = z
  .string()
  .min(1, "Place ID is required")
  .max(300, "Invalid place ID");
