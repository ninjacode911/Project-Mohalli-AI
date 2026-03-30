import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  // --- Home & Repair ---
  {
    id: "plumber",
    name: "Plumber",
    icon: "Wrench",
    googleTypes: ["plumber"],
    fallbackKeyword: "plumber plumbing services",
  },
  {
    id: "electrician",
    name: "Electrician",
    icon: "Zap",
    googleTypes: ["electrician"],
    fallbackKeyword: "electrician electrical repair",
  },
  {
    id: "carpenter",
    name: "Carpenter",
    icon: "Hammer",
    googleTypes: ["carpenter"],
    fallbackKeyword: "carpenter furniture woodwork",
  },
  {
    id: "painter",
    name: "Painter",
    icon: "Paintbrush",
    googleTypes: ["painter"],
    fallbackKeyword: "painter house painting contractor",
  },
  {
    id: "pest-control",
    name: "Pest Control",
    icon: "Bug",
    googleTypes: ["pest_control"],
    fallbackKeyword: "pest control termite cockroach",
  },
  {
    id: "ac-repair",
    name: "AC Repair",
    icon: "Snowflake",
    googleTypes: ["ac_repair"],
    fallbackKeyword: "air conditioner repair cooling service appliance repair",
  },

  // --- Auto ---
  {
    id: "mechanic",
    name: "Mechanic",
    icon: "Car",
    googleTypes: ["car_repair"],
    fallbackKeyword: "car mechanic auto repair garage",
  },
  {
    id: "petrol-pump",
    name: "Petrol Pump",
    icon: "Fuel",
    googleTypes: ["gas_station"],
    fallbackKeyword: "petrol pump gas station",
  },

  // --- Health ---
  {
    id: "doctor",
    name: "Doctor",
    icon: "Stethoscope",
    googleTypes: ["hospital", "doctor"],
    fallbackKeyword: "doctor clinic hospital",
  },
  {
    id: "dentist",
    name: "Dentist",
    icon: "SmilePlus",
    googleTypes: ["dentist"],
    fallbackKeyword: "dentist dental clinic",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: "Pill",
    googleTypes: ["pharmacy", "drugstore"],
    fallbackKeyword: "pharmacy medical store chemist",
  },
  {
    id: "veterinary",
    name: "Pet / Vet",
    icon: "PawPrint",
    googleTypes: ["veterinary_care", "pet_store"],
    fallbackKeyword: "veterinary pet shop vet clinic",
  },

  // --- Daily Essentials ---
  {
    id: "grocery",
    name: "Grocery",
    icon: "ShoppingCart",
    googleTypes: ["supermarket", "grocery_or_supermarket"],
    fallbackKeyword: "grocery supermarket kirana store",
  },
  {
    id: "hardware",
    name: "Hardware",
    icon: "HardHat",
    googleTypes: ["hardware_store"],
    fallbackKeyword: "hardware store building materials",
  },
  {
    id: "atm-bank",
    name: "ATM / Bank",
    icon: "Landmark",
    googleTypes: ["atm", "bank"],
    fallbackKeyword: "ATM bank branch",
  },

  // --- Lifestyle ---
  {
    id: "salon",
    name: "Salon",
    icon: "Scissors",
    googleTypes: ["hair_care", "beauty_salon"],
    fallbackKeyword: "salon beauty parlour haircut",
  },
  {
    id: "gym",
    name: "Gym",
    icon: "Dumbbell",
    googleTypes: ["gym"],
    fallbackKeyword: "gym fitness center",
  },
  {
    id: "laundry",
    name: "Laundry",
    icon: "Shirt",
    googleTypes: ["laundry"],
    fallbackKeyword: "laundry dry cleaning ironing",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: "UtensilsCrossed",
    googleTypes: ["restaurant"],
    fallbackKeyword: "restaurant food dining",
  },

  // --- Services ---
  {
    id: "computer-repair",
    name: "Computer / Phone",
    icon: "Monitor",
    googleTypes: ["electronics_store"],
    fallbackKeyword: "computer repair mobile phone service laptop",
  },
  {
    id: "tuition",
    name: "Tuition",
    icon: "GraduationCap",
    googleTypes: ["school"],
    fallbackKeyword: "tuition coaching classes academy",
  },
  {
    id: "courier",
    name: "Courier",
    icon: "Package",
    googleTypes: ["post_office"],
    fallbackKeyword: "courier delivery DTDC Blue Dart",
  },
  {
    id: "tailor",
    name: "Tailor",
    icon: "Ruler",
    googleTypes: ["tailor"],
    fallbackKeyword: "tailor stitching alteration",
  },
];

export const CATEGORY_MAP = new Map(
  CATEGORIES.map((cat) => [cat.id, cat])
);
