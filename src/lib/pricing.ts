/**
 * Pricing engine — pure functions, no React.
 * ---------------------------------------------------------------
 * Used by the cart today and designed to be reused on the server by
 * a payment gateway in phase 2 (so the client can never set its own
 * price: re-run `buildQuote` on the server before charging).
 *
 * Order of discounts:
 *   1. Per line: early-bird (group booked before `earlyBirdUntil`)
 *   2. Per line: sibling discount (2nd trainee, 3rd+ trainees)
 *   3. Order: Abnaona-student discount
 *   4. Order: coupon code
 *   5. Cap: total discount never exceeds `maxTotalDiscountPercent`
 */

import type { CartItem, Coupon, CourseSummary, Package, Quote, QuoteLine, DiscountKind } from "./types";

export interface DiscountRules {
  siblingSecondPercent: number;
  siblingThirdPlusPercent: number;
  abnaonaStudentPercent: number;
  earlyBirdPercent: number;
  maxTotalDiscountPercent: number;
}

export interface PricingCatalog {
  courses: CourseSummary[];
  packages: Package[];
}

export interface QuoteOptions {
  rules: DiscountRules;
  coupon?: Coupon | null;
  isAbnaonaStudent?: boolean;
  now?: Date;
  /** Human label for a course level (translated by the caller) */
  levelLabel?: (c: CourseSummary) => string;
}

const round = (n: number) => Math.round(n);
const today = (d: Date) => d.toISOString().slice(0, 10);

/** Price for a single trainee on a cart line. */
export function unitPrice(item: CartItem, catalog: PricingCatalog): number | undefined {
  if (item.type === "package") return catalog.packages.find((p) => p.id === item.refId)?.price;
  const c = catalog.courses.find((x) => x.id === item.refId);
  return c?.prices[item.mode]?.price;
}

/** Sibling discount for `n` trainees at `price` each. */
export function siblingDiscount(price: number, n: number, rules: DiscountRules) {
  if (n < 2) return 0;
  const second = (price * rules.siblingSecondPercent) / 100;
  const thirdPlus = ((price * rules.siblingThirdPlusPercent) / 100) * Math.max(0, n - 2);
  return round(second + thirdPlus);
}

export function buildLines(items: CartItem[], catalog: PricingCatalog, opts: QuoteOptions): QuoteLine[] {
  const now = opts.now ?? new Date();
  const lines: QuoteLine[] = [];
  for (const item of items) {
    const price = unitPrice(item, catalog);
    if (price === undefined) continue; // stale cart entry (course removed / mode no longer offered)
    const trainees = Math.max(1, Math.min(10, item.trainees));
    const gross = price * trainees;

    let title = "";
    let level: string | undefined;
    let groupLabel: string | undefined;
    let categoryIds: string[] = [];
    let earlyBird = 0;

    if (item.type === "course") {
      const c = catalog.courses.find((x) => x.id === item.refId)!;
      title = c.title;
      level = opts.levelLabel?.(c);
      categoryIds = [c.categoryId];
      const g = c.groups.find((x) => x.id === item.groupId);
      if (g) {
        groupLabel = `${g.days} ${g.time}`;
        if (g.earlyBirdUntil && today(now) <= g.earlyBirdUntil) {
          earlyBird = round((gross * opts.rules.earlyBirdPercent) / 100);
        }
      }
    } else {
      const p = catalog.packages.find((x) => x.id === item.refId)!;
      title = p.title;
      categoryIds = p.categoryIds;
    }

    const sibling = siblingDiscount(price, trainees, opts.rules);
    lines.push({
      key: item.key,
      type: item.type,
      refId: item.refId,
      title,
      level,
      mode: item.mode,
      groupLabel,
      categoryIds,
      unitPrice: price,
      trainees,
      gross,
      siblingDiscount: sibling,
      earlyBirdDiscount: earlyBird,
      net: gross - sibling - earlyBird,
    });
  }
  return lines;
}

export function buildQuote(items: CartItem[], catalog: PricingCatalog, opts: QuoteOptions): Quote {
  const now = opts.now ?? new Date();
  const lines = buildLines(items, catalog, opts);
  const subtotal = lines.reduce((s, l) => s + l.gross, 0);
  const discounts: Quote["discounts"] = [];
  const push = (kind: DiscountKind, amount: number, label?: string) => {
    if (amount > 0) discounts.push({ kind, amount: round(amount), label });
  };

  push("earlyBird", lines.reduce((s, l) => s + l.earlyBirdDiscount, 0));
  push("sibling", lines.reduce((s, l) => s + l.siblingDiscount, 0));

  const afterLines = lines.reduce((s, l) => s + l.net, 0);
  const studentPct = opts.isAbnaonaStudent ? opts.rules.abnaonaStudentPercent : 0;
  push("student", (afterLines * studentPct) / 100);

  let couponError: Quote["couponError"];
  const c = opts.coupon;
  if (c) {
    const eligible = c.categories?.length
      ? lines.filter((l) => l.categoryIds.some((id) => c.categories!.includes(id)))
      : lines;
    const base = eligible.reduce((s, l) => s + l.net, 0) * (1 - studentPct / 100);
    if (c.expiresAt && today(now) > c.expiresAt) couponError = "expired";
    else if (c.minSubtotal && subtotal < c.minSubtotal) couponError = "min";
    else if (base <= 0) couponError = "notApplicable";
    else push("coupon", c.type === "percent" ? (base * c.value) / 100 : Math.min(c.value, base), c.code);
  }

  let totalDiscount = discounts.reduce((s, d) => s + d.amount, 0);
  const cap = round((subtotal * opts.rules.maxTotalDiscountPercent) / 100);
  if (totalDiscount > cap) {
    // Give back the excess so the total never goes below the allowed maximum discount
    discounts.push({ kind: "cap", amount: -(totalDiscount - cap) });
    totalDiscount = cap;
  }

  return {
    lines,
    subtotal,
    discounts,
    totalDiscount,
    total: Math.max(0, subtotal - totalDiscount),
    couponError,
  };
}
