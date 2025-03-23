export const locales = ["en", "he"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Define the pathnames for your routes
export const pathnames = {
  // Add your routes here with their translations
  "/": "/",
  "/settings": "/settings",
  "/start": "/start",
  "/about": "/about",
  "/contact": "/contact",
} as const;

export type Pathnames = typeof pathnames;
