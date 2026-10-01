/**
 * Data-access layer
 * ---------------------------------------------------------------
 * Every page reads content ONLY through these functions. Today they
 * read local JSON files in `src/data`; in phase 2 you can swap the
 * implementation for a CMS / database (Sanity, Strapi, Supabase…)
 * without touching any page or component.
 */

import type {
  Category,
  Course,
  CourseSummary,
  Instructor,
  L10n,
  Locale,
  Mode,
  Package,
  RawCategory,
  RawCourse,
  RawInstructor,
  RawPackage,
  SearchItem,
  IconName,
} from "./types";

import siteRaw from "@/data/site.json";
import categoriesRaw from "@/data/categories.json";
import coursesRaw from "@/data/courses.json";
import instructorsRaw from "@/data/instructors.json";
import packagesRaw from "@/data/packages.json";
import testimonialsRaw from "@/data/testimonials.json";
import blogRaw from "@/data/blog.json";
import faqRaw from "@/data/faq.json";
import legalRaw from "@/data/legal.json";

const categories = categoriesRaw as RawCategory[];
const courses = coursesRaw as unknown as RawCourse[];
const instructors = instructorsRaw as RawInstructor[];
const packages = packagesRaw as RawPackage[];

/** Pick the string for the current locale (falls back to Arabic). */
export function tr(value: L10n | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] ?? value.ar;
}

/* ───────────────────────────── Site ───────────────────────────── */

export function getSite(locale: Locale) {
  const s = siteRaw;
  return {
    name: tr(s.name, locale),
    shortName: tr(s.shortName, locale),
    parent: { name: tr(s.parentInstitute.name, locale), url: s.parentInstitute.url },
    contact: {
      ...s.contact,
      address: tr(s.contact.address, locale),
      workingHours: tr(s.contact.workingHours, locale),
    },
    social: s.social,
    booking: s.booking,
    discounts: s.discounts,
    currencies: s.currencies as unknown as Record<string, number>,
    announcement: {
      enabled: s.announcement.enabled,
      text: tr(s.announcement.text, locale),
      href: s.announcement.href,
    },
    offer: {
      title: tr(s.offer.title, locale),
      text: tr(s.offer.text, locale),
      endsAt: s.offer.endsAt,
      coupon: s.offer.coupon,
    },
    stats: s.stats.map((st) => ({ value: st.value, suffix: st.suffix, label: tr(st.label, locale) })),
  };
}

export type Site = ReturnType<typeof getSite>;

/* ─────────────────────────── Categories ─────────────────────────── */

export function getCategories(locale: Locale): Category[] {
  return categories.map((c) => ({
    id: c.id,
    icon: c.icon,
    name: tr(c.name, locale),
    description: tr(c.description, locale),
    featured: !!c.featured,
    theme: c.theme,
    count: courses.filter((co) => co.category === c.id).length,
  }));
}

export function getCategory(id: string, locale: Locale) {
  return getCategories(locale).find((c) => c.id === id);
}

/* ─────────────────────────── Instructors ─────────────────────────── */

function localizeInstructor(i: RawInstructor, locale: Locale): Instructor {
  return {
    id: i.id,
    name: tr(i.name, locale),
    title: tr(i.title, locale),
    bio: tr(i.bio, locale),
    photo: i.photo,
    specialties: i.specialties.map((s) => tr(s, locale)),
    certifications: i.certifications,
    languages: i.languages.map((l) => tr(l, locale)),
    yearsExperience: i.yearsExperience,
    featured: !!i.featured,
  };
}

export function getInstructors(locale: Locale): Instructor[] {
  return instructors.map((i) => localizeInstructor(i, locale));
}

export function getInstructor(id: string, locale: Locale): Instructor | undefined {
  const i = instructors.find((x) => x.id === id);
  return i ? localizeInstructor(i, locale) : undefined;
}

/* ───────────────────────────── Courses ───────────────────────────── */

const MODE_ORDER: Mode[] = ["in-person", "online", "recorded"];

function toSummary(c: RawCourse, locale: Locale): CourseSummary {
  const cat = categories.find((x) => x.id === c.category);
  const modes = MODE_ORDER.filter((m) => c.prices[m]);
  // Cheapest mode determines the "from" price shown on cards
  const cheapest = modes
    .map((m) => c.prices[m]!)
    .sort((a, b) => a.price - b.price)[0] ?? { price: 0 };
  const inst = instructors.find((i) => i.id === c.instructorId);
  return {
    id: c.id,
    slug: c.slug,
    categoryId: c.category,
    categoryName: cat ? tr(cat.name, locale) : "",
    icon: (cat?.icon ?? "papyrus") as IconName,
    theme: cat?.theme ?? "lapis",
    language: c.language,
    title: tr(c.title, locale),
    subtitle: tr(c.subtitle, locale),
    image: c.image,
    instructorId: c.instructorId,
    instructorName: inst ? tr(inst.name, locale) : "",
    level: c.level,
    cefr: c.cefr || undefined,
    ageGroups: c.ageGroups,
    modes,
    prices: c.prices,
    fromPrice: cheapest.price,
    fromOldPrice: cheapest.oldPrice,
    durationWeeks: c.durationWeeks,
    sessionsCount: c.sessionsCount,
    sessionMinutes: c.sessionMinutes,
    rating: c.rating,
    reviewsCount: c.reviews.length,
    studentsCount: c.studentsCount,
    manualBadges: c.badges,
    groups: c.groups.map((g) => ({ ...g, days: tr(g.days, locale) })),
    publishedAt: c.publishedAt,
    popularity: c.popularity,
  };
}

export function getCourses(locale: Locale): CourseSummary[] {
  return courses.map((c) => toSummary(c, locale));
}

export function getCourseSlugs(): string[] {
  return courses.map((c) => c.slug);
}

export function getCourse(slug: string, locale: Locale): Course | undefined {
  const c = courses.find((x) => x.slug === slug);
  if (!c) return undefined;
  return {
    ...toSummary(c, locale),
    description: tr(c.description, locale),
    youtubeId: c.youtubeId,
    outcomes: c.outcomes.map((o) => tr(o, locale)),
    audience: c.audience.map((o) => tr(o, locale)),
    requirements: c.requirements.map((o) => tr(o, locale)),
    curriculum: c.curriculum.map((m) => ({
      title: tr(m.title, locale),
      lessons: m.lessons.map((l) => tr(l, locale)),
    })),
    faq: c.faq.map((f) => ({ q: tr(f.q, locale), a: tr(f.a, locale) })),
    reviews: c.reviews.map((r) => ({ ...r, text: tr(r.text, locale) })),
    certificate: c.certificate,
  };
}

export function getCourseById(id: string, locale: Locale): CourseSummary | undefined {
  const c = courses.find((x) => x.id === id);
  return c ? toSummary(c, locale) : undefined;
}

export function getCoursesByInstructor(instructorId: string, locale: Locale) {
  return getCourses(locale).filter((c) => c.instructorId === instructorId);
}

/** Same category first, then same language, excluding the course itself. */
export function getSimilarCourses(course: CourseSummary, locale: Locale, limit = 3) {
  const all = getCourses(locale).filter((c) => c.id !== course.id);
  const score = (c: CourseSummary) =>
    (c.categoryId === course.categoryId ? 2 : 0) +
    (course.language && c.language === course.language ? 2 : 0) +
    (c.ageGroups.some((a) => course.ageGroups.includes(a)) ? 1 : 0);
  return all.sort((a, b) => score(b) - score(a) || b.popularity - a.popularity).slice(0, limit);
}

export function getPopularCourses(locale: Locale, limit = 6) {
  return [...getCourses(locale)].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getNewestCourses(locale: Locale, limit = 3) {
  return [...getCourses(locale)]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Minimal index for the header's instant search. */
export function getSearchIndex(locale: Locale): SearchItem[] {
  return getCourses(locale).map((c) => ({
    slug: c.slug,
    title: c.title,
    subtitle: c.subtitle,
    category: c.categoryName,
    instructor: c.instructorName,
    icon: c.icon,
    fromPrice: c.fromPrice,
  }));
}

/* ───────────────────────────── Packages ───────────────────────────── */

export function getPackages(locale: Locale): Package[] {
  return packages.map((p) => {
    const cs = p.courseIds.map((id) => courses.find((c) => c.id === id)).filter(Boolean) as RawCourse[];
    return {
      id: p.id,
      slug: p.slug,
      title: tr(p.title, locale),
      description: tr(p.description, locale),
      courseIds: p.courseIds,
      courseTitles: cs.map((c) => tr(c.title, locale)),
      modes: p.modes as Mode[],
      price: p.price,
      oldPrice: p.oldPrice,
      highlight: !!p.highlight,
      icon: p.icon,
      categoryIds: Array.from(new Set(cs.map((c) => c.category))),
    };
  });
}

/* ─────────────────────────── Other content ─────────────────────────── */

export function getTestimonials(locale: Locale) {
  return testimonialsRaw.map((t) => ({
    name: tr(t.name, locale),
    role: tr(t.role, locale),
    rating: t.rating,
    text: tr(t.text, locale),
    courseTitle: tr(courses.find((c) => c.id === t.course)?.title, locale),
  }));
}

export type BlockContent =
  | { type: "p" | "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  category: string;
  icon: IconName;
  date: string;
  readMinutes: number;
  author: Instructor | undefined;
  title: string;
  excerpt: string;
  content: BlockContent[];
}

export function getBlogPosts(locale: Locale): BlogPost[] {
  return blogRaw
    .map((p) => ({
      slug: p.slug,
      category: tr(p.category, locale),
      icon: p.icon as IconName,
      date: p.date,
      readMinutes: p.readMinutes,
      author: getInstructor(p.author, locale),
      title: tr(p.title, locale),
      excerpt: tr(p.excerpt, locale),
      content: p.content.map((b) =>
        b.type === "ul"
          ? { type: "ul" as const, items: (b.items ?? []).map((i) => tr(i, locale)) }
          : { type: b.type as "p" | "h2", text: tr(b.text, locale) }
      ),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getBlogPost(slug: string, locale: Locale) {
  return getBlogPosts(locale).find((p) => p.slug === slug);
}

export function getFaq(locale: Locale) {
  return faqRaw.map((g) => ({
    group: tr(g.group, locale),
    items: g.items.map((i) => ({ q: tr(i.q, locale), a: tr(i.a, locale) })),
  }));
}

export type LegalPage = "privacy" | "terms" | "refund";
export const LEGAL_PAGES: LegalPage[] = ["privacy", "terms", "refund"];

export function getLegal(page: LegalPage, locale: Locale) {
  const l = legalRaw[page];
  return {
    title: tr(l.title, locale),
    updated: l.updated,
    sections: l.sections.map((s) => ({ h: tr(s.h, locale), p: tr(s.p, locale) })),
  };
}
