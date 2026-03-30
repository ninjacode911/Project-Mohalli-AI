import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "plumber",
    name: "Plumber",
    icon: "Wrench",
    googleTypes: ["plumber"],
    fallbackKeyword: "plumbing services",
  },
  {
    id: "electrician",
    name: "Electrician",
    icon: "Zap",
    googleTypes: ["electrician"],
    fallbackKeyword: "electrical services",
  },
  {
    id: "mechanic",
    name: "Mechanic",
    icon: "Car",
    googleTypes: ["car_repair"],
    fallbackKeyword: "car mechanic auto repair",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: "Pill",
    googleTypes: ["pharmacy", "drugstore"],
    fallbackKeyword: "medical store",
  },
  {
    id: "grocery",
    name: "Grocery",
    icon: "ShoppingCart",
    googleTypes: ["supermarket", "grocery_or_supermarket"],
    fallbackKeyword: "grocery store",
  },
  {
    id: "doctor",
    name: "Doctor",
    icon: "Stethoscope",
    googleTypes: ["hospital", "doctor"],
    fallbackKeyword: "clinic doctor",
  },
  {
    id: "salon",
    name: "Salon",
    icon: "Scissors",
    googleTypes: ["hair_care", "beauty_salon"],
    fallbackKeyword: "salon haircut",
  },
  {
    id: "laundry",
    name: "Laundry",
    icon: "Shirt",
    googleTypes: ["laundry"],
    fallbackKeyword: "dry cleaning",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: "UtensilsCrossed",
    googleTypes: ["restaurant"],
    fallbackKeyword: "restaurant food",
  },
  {
    id: "gym",
    name: "Gym",
    icon: "Dumbbell",
    googleTypes: ["gym"],
    fallbackKeyword: "fitness center",
  },
  {
    id: "petrol-pump",
    name: "Petrol Pump",
    icon: "Fuel",
    googleTypes: ["gas_station"],
    fallbackKeyword: "petrol pump",
  },
  {
    id: "atm-bank",
    name: "ATM / Bank",
    icon: "Landmark",
    googleTypes: ["atm", "bank"],
    fallbackKeyword: "ATM bank",
  },
];

export const CATEGORY_MAP = new Map(
  CATEGORIES.map((cat) => [cat.id, cat])
);
