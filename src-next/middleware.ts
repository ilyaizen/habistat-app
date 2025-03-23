import createMiddleware from "next-intl/middleware";

// Define the supported locales for the application
const locales = ["en", "he"];

// Create the middleware with the configuration
export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // The default locale for users visiting without specific locale preference
  defaultLocale: "en",
  // Locale detection settings
  localeDetection: true,
  // Files or URLs to exclude from internationalization
  localePrefix: "as-needed",
});

// Matcher configuration to exclude specific paths from the middleware
export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
