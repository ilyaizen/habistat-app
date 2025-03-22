import { createNavigation } from "next-intl/navigation";
import { getRequestConfig } from "next-intl/server";

import { locales, pathnames } from "./settings";

export default getRequestConfig(async ({ locale }) => ({
  locale: locale as string,
  messages: (await import(`../messages/${locale}.json`)).default,
}));

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  pathnames,
  localePrefix: "always",
});
