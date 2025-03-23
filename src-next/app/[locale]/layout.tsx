import { Providers } from "@/app/providers";
import { RootWrapper } from "@/components/root-wrapper";
import i18nMetadata from "@/i18n/metadata";
import { Locale, defaultLocale, locales } from "@/i18n/settings";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

/**
 * Root layout component for locale-specific routes
 * Handles internationalization setup, font loading, and base layout structure
 */

// Define RTL locales
const rtlLocales: Locale[] = ["he"];

/**
 * Generate static paths for non-default locales at build time
 * Improves performance by pre-rendering locale-specific pages
 */
export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

/**
 * Layout component that wraps all pages within a locale segment
 * Handles:
 * - Locale validation and setup
 * - Message loading for translations
 * - RTL support
 */
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const locale = (await params).locale;

  // Validate requested locale against supported ones
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Configure locale for the current request and load translations
  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(error);
    notFound();
  }

  // Determine text direction based on locale
  const isRtl = rtlLocales.includes(locale as Locale);

  return (
    <Providers locale={locale} messages={messages}>
      <RootWrapper>
        <div dir={isRtl ? "rtl" : "ltr"}>{children}</div>
      </RootWrapper>
    </Providers>
  );
}

/**
 * Generate metadata for the page based on the locale
 */
type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale;
  const metadata = i18nMetadata[locale as keyof typeof i18nMetadata] || i18nMetadata.en;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(", "),
  };
}
