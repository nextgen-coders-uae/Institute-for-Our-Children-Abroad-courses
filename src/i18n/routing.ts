import { defineRouting } from "next-intl/routing";

/** Supported locales. Arabic is the default and is served under /ar, English under /en. */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  // Always land on Arabic at "/" (the default), instead of guessing from the browser language
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
