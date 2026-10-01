import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import type { Locale } from "./types";
import { SITE_URL } from "./utils";

/**
 * Build per-page metadata with canonical URL + hreflang alternates
 * (ar / en / x-default) and Open Graph / Twitter tags.
 * `path` is the locale-less path, e.g. "/courses/ielts-preparation".
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
  type = "website",
  noIndex,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      type,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      alternateLocale: locale === "ar" ? ["en_AE"] : ["ar_AE"],
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const absoluteUrl = (locale: Locale, path = "") => `${SITE_URL}/${locale}${path}`;
