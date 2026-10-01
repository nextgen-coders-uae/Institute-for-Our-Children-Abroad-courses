import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBlogPosts, getCourses, LEGAL_PAGES } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";

/** sitemap.xml with hreflang alternates for every page in both languages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" = "weekly", lastModified: Date = now) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
      },
    }));

  return [
    ...entry("", 1, "daily"),
    ...entry("/courses", 0.9, "daily"),
    ...getCourses("ar").flatMap((c) => entry(`/courses/${c.slug}`, 0.8)),
    ...entry("/packages", 0.8),
    ...entry("/placement-test", 0.8, "monthly"),
    ...entry("/instructors", 0.6, "monthly"),
    ...entry("/about", 0.5, "monthly"),
    ...entry("/blog", 0.7),
    ...getBlogPosts("ar").flatMap((p) => entry(`/blog/${p.slug}`, 0.6, "monthly", new Date(p.date))),
    ...entry("/faq", 0.5, "monthly"),
    ...entry("/contact", 0.5, "monthly"),
    ...entry("/verify-certificate", 0.4, "monthly"),
    ...LEGAL_PAGES.flatMap((p) => entry(`/policies/${p}`, 0.2, "monthly")),
  ];
}
