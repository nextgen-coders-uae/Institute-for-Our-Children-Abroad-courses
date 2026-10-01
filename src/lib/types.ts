/**
 * Core domain types.
 * ---------------------------------------------------------------
 * Raw data (src/data/*.json) stores every human-readable text as
 * `{ ar, en }` (type `L10n`). Pages call the helpers in `lib/data.ts`
 * to turn raw records into "localized" view-models with plain strings.
 *
 * Phase-2 types (Student, Enrollment, Invoice…) are declared at the
 * bottom so a dashboard / payment gateway can be plugged in later
 * without reshaping the existing data.
 */

import type { AppLocale } from "@/i18n/routing";

export type Locale = AppLocale;
export type L10n = { ar: string; en: string };

export type Mode = "in-person" | "online" | "recorded";
export type Level = "beginner" | "intermediate" | "advanced" | "all-levels";
export type AgeGroup = "kids" | "teens" | "adults";
export type LanguageKey = "english" | "french" | "german" | "arabic";
export type ManualBadge = "new" | "bestseller";
export type Badge = ManualBadge | "limited" | "starting-soon" | "full";
export type CurrencyCode = "AED" | "EGP";

/* ─────────────────────────── Raw data ─────────────────────────── */

export interface RawCategory {
  id: string;
  icon: IconName;
  name: L10n;
  description: L10n;
  /** Main category is highlighted (Languages) */
  featured?: boolean;
  /** Tailwind gradient used for generated course covers */
  theme: CoverTheme;
}

export type CoverTheme = "lapis" | "royal" | "copper" | "gold" | "pharaoh" | "nile";

export type IconName =
  | "papyrus"
  | "ankh"
  | "pyramid"
  | "eye"
  | "lotus"
  | "harp"
  | "obelisk"
  | "palette"
  | "scarab"
  | "djed"
  | "sun";

export interface PriceOption {
  /** Price in AED per trainee */
  price: number;
  /** Price before discount (shown struck-through) */
  oldPrice?: number;
}

export interface RawGroup {
  id: string;
  mode: Exclude<Mode, "recorded">;
  days: L10n;
  /** e.g. "17:00 – 18:30" (UAE time) */
  time: string;
  /** ISO date */
  startDate: string;
  seatsTotal: number;
  seatsLeft: number;
  /** ISO date — booking before it gets the early-bird discount */
  earlyBirdUntil?: string;
}

export interface RawReview {
  name: string;
  rating: number;
  date: string;
  text: L10n;
}

export interface RawFaq {
  q: L10n;
  a: L10n;
}

export interface RawCourse {
  id: string;
  /** URL slug — keep it lowercase-latin with dashes */
  slug: string;
  category: string;
  language?: LanguageKey;
  title: L10n;
  subtitle: L10n;
  description: L10n;
  /** Optional real image (put it in /public/images/courses). Falls back to a generated cover. */
  image?: string;
  /** Optional YouTube video id for the intro video */
  youtubeId?: string;
  instructorId: string;
  level: Level;
  /** CEFR range e.g. "A1 – A2" */
  cefr?: string;
  ageGroups: AgeGroup[];
  prices: Partial<Record<Mode, PriceOption>>;
  durationWeeks: number;
  sessionsCount: number;
  sessionMinutes: number;
  outcomes: L10n[];
  audience: L10n[];
  requirements: L10n[];
  curriculum: { title: L10n; lessons: L10n[] }[];
  groups: RawGroup[];
  faq: RawFaq[];
  reviews: RawReview[];
  rating: number;
  studentsCount: number;
  badges: ManualBadge[];
  certificate: boolean;
  publishedAt: string;
  /** Popularity score used for "most requested" sorting */
  popularity: number;
}

export interface RawInstructor {
  id: string;
  name: L10n;
  title: L10n;
  bio: L10n;
  photo?: string;
  specialties: L10n[];
  certifications: string[];
  languages: L10n[];
  yearsExperience: number;
  featured?: boolean;
}

export interface RawPackage {
  id: string;
  slug: string;
  title: L10n;
  description: L10n;
  courseIds: string[];
  modes: Mode[];
  price: number;
  oldPrice: number;
  highlight?: boolean;
  icon: IconName;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  description: L10n;
  /** Shown publicly on the offers page */
  public?: boolean;
  minSubtotal?: number;
  /** ISO date (inclusive) */
  expiresAt?: string;
  /** Restrict to categories (ids). Empty = whole cart */
  categories?: string[];
}

/* ─────────────────────── Localized view-models ─────────────────────── */

export interface Category {
  id: string;
  icon: IconName;
  name: string;
  description: string;
  featured: boolean;
  theme: CoverTheme;
  count: number;
}

export interface Group {
  id: string;
  mode: Exclude<Mode, "recorded">;
  days: string;
  time: string;
  startDate: string;
  seatsTotal: number;
  seatsLeft: number;
  earlyBirdUntil?: string;
}

export interface CourseSummary {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  icon: IconName;
  theme: CoverTheme;
  language?: LanguageKey;
  title: string;
  subtitle: string;
  image?: string;
  instructorId: string;
  instructorName: string;
  level: Level;
  cefr?: string;
  ageGroups: AgeGroup[];
  modes: Mode[];
  prices: Partial<Record<Mode, PriceOption>>;
  /** Lowest current price across modes */
  fromPrice: number;
  fromOldPrice?: number;
  durationWeeks: number;
  sessionsCount: number;
  sessionMinutes: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  manualBadges: ManualBadge[];
  groups: Group[];
  publishedAt: string;
  popularity: number;
}

export interface Course extends CourseSummary {
  description: string;
  youtubeId?: string;
  outcomes: string[];
  audience: string[];
  requirements: string[];
  curriculum: { title: string; lessons: string[] }[];
  faq: { q: string; a: string }[];
  reviews: { name: string; rating: number; date: string; text: string }[];
  certificate: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  photo?: string;
  specialties: string[];
  certifications: string[];
  languages: string[];
  yearsExperience: number;
  featured: boolean;
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  description: string;
  courseIds: string[];
  courseTitles: string[];
  modes: Mode[];
  price: number;
  oldPrice: number;
  highlight: boolean;
  icon: IconName;
  categoryIds: string[];
}

/** Lightweight record used by the instant-search box */
export interface SearchItem {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  instructor: string;
  icon: IconName;
  fromPrice: number;
}

/* ─────────────────────────── Cart & booking ─────────────────────────── */

export interface CartItem {
  /** Unique line key */
  key: string;
  type: "course" | "package";
  /** course id or package id */
  refId: string;
  mode: Mode;
  groupId?: string;
  /** Number of trainees (siblings) booked on this line */
  trainees: number;
}

export interface BookingCustomer {
  traineeName: string;
  age: string;
  guardianName: string;
  phoneCode: string;
  phone: string;
  email: string;
  country: string;
  notes: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  locale: Locale;
  customer: BookingCustomer;
  lines: QuoteLine[];
  quote: Quote;
  couponCode?: string;
  isAbnaonaStudent: boolean;
}

export type DiscountKind = "sibling" | "earlyBird" | "student" | "coupon" | "cap";

export interface QuoteLine {
  key: string;
  type: "course" | "package";
  refId: string;
  title: string;
  level?: string;
  mode: Mode;
  groupLabel?: string;
  categoryIds: string[];
  unitPrice: number;
  trainees: number;
  gross: number;
  siblingDiscount: number;
  earlyBirdDiscount: number;
  net: number;
}

export interface Quote {
  lines: QuoteLine[];
  subtotal: number;
  discounts: { kind: DiscountKind; amount: number; label?: string }[];
  totalDiscount: number;
  total: number;
  couponError?: "invalid" | "expired" | "min" | "notApplicable";
}

/* ─────────────────────────── Phase 2 (planned) ─────────────────────────── */

/** A registered student account (dashboard — phase 2). */
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  guardianName?: string;
  createdAt: string;
}

/** A confirmed seat in a group (phase 2). */
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  groupId?: string;
  status: "pending" | "active" | "completed" | "cancelled";
  attendance: { date: string; present: boolean }[];
  certificateId?: string;
}

/** Invoice generated after an online payment (phase 2). */
export interface Invoice {
  id: string;
  bookingId: string;
  amount: number;
  currency: "AED";
  provider: "stripe" | "telr" | "network-international" | "tabby" | "cash" | "bank-transfer";
  status: "unpaid" | "paid" | "refunded";
  issuedAt: string;
}
