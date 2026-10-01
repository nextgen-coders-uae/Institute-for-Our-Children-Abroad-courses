import type { CurrencyCode, Locale } from "./types";

/** Arabic UI but Latin digits (the common convention in the UAE). */
export const intlLocale = (locale: Locale) => (locale === "ar" ? "ar-AE-u-nu-latn" : "en-GB");

export function formatNumber(n: number, locale: Locale, maxFraction = 0) {
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: maxFraction }).format(n);
}

const CURRENCY_LABEL: Record<CurrencyCode, { ar: string; en: string }> = {
  AED: { ar: "درهم", en: "AED" },
  EGP: { ar: "ج.م", en: "EGP" },
};

export function currencyLabel(code: CurrencyCode, locale: Locale) {
  return CURRENCY_LABEL[code][locale];
}

/** Format an AED amount, optionally converted to another currency with `rate` (units per 1 AED). */
export function formatMoney(aed: number, locale: Locale, currency: CurrencyCode = "AED", rate = 1) {
  const value = aed * rate;
  // Round converted prices to a friendly precision
  const rounded = currency === "EGP" ? Math.round(value / 10) * 10 : Math.round(value);
  return `${formatNumber(rounded, locale)} ${currencyLabel(currency, locale)}`;
}

export function formatDate(iso: string, locale: Locale, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat(intlLocale(locale), { timeZone: "Asia/Dubai", ...opts }).format(new Date(iso));
}
