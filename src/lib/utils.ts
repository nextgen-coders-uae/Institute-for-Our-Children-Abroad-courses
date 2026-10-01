/** Join class names, skipping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Normalise text for fuzzy Arabic/English search:
 * lower-case, strip Arabic diacritics & tatweel, unify alef/yaa/taa-marbuta forms.
 */
export function normalizeSearch(text: string) {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .trim();
}

/** True if every word of the query appears somewhere in the haystack. */
export function matchesQuery(haystack: string, query: string) {
  const h = normalizeSearch(haystack);
  return normalizeSearch(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => h.includes(w));
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://courses.abnaona-academy.com").replace(/\/$/, "");
