import { cn } from "@/lib/utils";
import { Noto_Sans } from "next/font/google";

import "./globals.css";

/**
 * Root layout that only imports global CSS and passes children through
 * The actual HTML structure is handled by src/app/[locale]/layout.tsx
 */

// Font definitions
const fontSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#1F2937" />
      </head>
      <body
        className={cn(
          "bg-background relative min-h-screen font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        {/* GridBackground */}
        {/* <div className="grid-background"></div> */}
        {/* Gradation Background */}
        {/* <div className="gradation-background"></div> */}
        {children}
      </body>
    </html>
  );
}
