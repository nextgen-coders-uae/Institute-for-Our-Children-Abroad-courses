/**
 * WhatsApp helpers — booking message format, deep links & booking ids.
 * The booking message layout follows the format agreed with the institute.
 */

import type { Booking, DiscountKind, Locale, Mode } from "./types";
import { formatNumber } from "./format";
import site from "@/data/site.json";

export const WHATSAPP_NUMBER = site.contact.whatsapp;
const SEP = "━━━━━━━━━━━━━━";

/** Build a wa.me link with a properly encoded message. */
export function waLink(text?: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Booking reference: PREFIX-YYYYMMDD-NNNN (e.g. ABC-20260930-4821). */
export function generateBookingId(date = new Date()) {
  const d = date.toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" }).replace(/-/g, "");
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `${site.booking.idPrefix}-${d}-${rnd}`;
}

const L = {
  ar: {
    title: "📚 حجز جديد – كورسات أبناؤنا في الخارج",
    trainee: "👤 المتدرب",
    age: "العمر",
    guardian: "👨‍👩‍👧 ولي الأمر",
    courses: "📖 الكورسات:",
    level: "المستوى",
    group: "المجموعة",
    trainees: "عدد المتدربين",
    discount: "🏷️ الخصم",
    noDiscount: "لا يوجد",
    total: "💵 الإجمالي",
    phone: "📞 الهاتف",
    email: "📧 البريد",
    country: "📍 الدولة/الإمارة",
    notes: "📝 ملاحظات",
    id: "🔖 رقم الحجز",
    currency: "درهم",
    package: "باقة",
    toSchedule: "يُحدد لاحقاً",
    modes: { "in-person": "حضوري", online: "أونلاين", recorded: "مسجّل" } as Record<Mode, string>,
    kinds: { sibling: "خصم الإخوة", earlyBird: "خصم التسجيل المبكر", student: "خصم طلاب معهد أبناؤنا", coupon: "كود", cap: "تعديل الحد الأقصى" } as Record<DiscountKind, string>,
  },
  en: {
    title: "📚 New booking – Abnauona Courses",
    trainee: "👤 Trainee",
    age: "Age",
    guardian: "👨‍👩‍👧 Guardian",
    courses: "📖 Courses:",
    level: "Level",
    group: "Group",
    trainees: "Trainees",
    discount: "🏷️ Discount",
    noDiscount: "None",
    total: "💵 Total",
    phone: "📞 Phone",
    email: "📧 Email",
    country: "📍 Country/Emirate",
    notes: "📝 Notes",
    id: "🔖 Booking ID",
    currency: "AED",
    package: "Bundle",
    toSchedule: "to be scheduled",
    modes: { "in-person": "In-person", online: "Online", recorded: "Recorded" } as Record<Mode, string>,
    kinds: { sibling: "Sibling discount", earlyBird: "Early-bird discount", student: "Abnaona student discount", coupon: "Code", cap: "Max-discount adjustment" } as Record<DiscountKind, string>,
  },
};

export function buildBookingMessage(b: Booking, locale: Locale = b.locale) {
  const l = L[locale];
  const money = (n: number) => `${formatNumber(n, locale)} ${l.currency}`;
  const c = b.customer;
  const dash = "—";

  const courseLines = b.lines.map((line, i) => {
    const parts = [
      `${i + 1}) ${line.type === "package" ? `${l.package}: ` : ""}${line.title}`,
      line.level ? `${l.level}: ${line.level}` : null,
      l.modes[line.mode],
      line.mode !== "recorded" ? `${l.group}: ${line.groupLabel ?? l.toSchedule}` : null,
      money(line.net),
    ].filter(Boolean);
    const extra = line.trainees > 1 ? `\n   (${l.trainees}: ${line.trainees})` : "";
    return parts.join(" – ") + extra;
  });

  const discountText = b.quote.discounts.length
    ? b.quote.discounts
        .filter((d) => d.kind !== "cap")
        .map((d) => (d.kind === "coupon" ? `${l.kinds.coupon} ${d.label}` : l.kinds[d.kind]))
        .join(" + ") + ` – ${money(b.quote.totalDiscount)}`
    : l.noDiscount;

  return [
    l.title,
    SEP,
    `${l.trainee}: ${c.traineeName} | ${l.age}: ${c.age}`,
    `${l.guardian}: ${c.guardianName || dash}`,
    SEP,
    l.courses,
    ...courseLines,
    SEP,
    `${l.discount}: ${discountText}`,
    `${l.total}: ${money(b.quote.total)}`,
    SEP,
    `${l.phone}: ${c.phoneCode} ${c.phone}`,
    `${l.email}: ${c.email || dash}`,
    `${l.country}: ${c.country || dash}`,
    `${l.notes}: ${c.notes || dash}`,
    `${l.id}: ${b.id}`,
  ].join("\n");
}
