import createNextIntlPlugin from "next-intl/plugin";

const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

const withNextIntl = createNextIntlPlugin("./i18n/routing.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Can't use output: export with middleware
  // output: "export",
  distDir: isProd ? ".next" : "out", // Use .next for production builds
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  // Configure assetPrefix or else the server won't properly resolve your assets.
  assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,
};

export default withNextIntl(nextConfig);
