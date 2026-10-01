"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useStore } from "@/components/providers/StoreProvider";
import { useMoney } from "@/components/ui/Price";
import { CourseCover } from "@/components/course/CourseCover";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { WhatsAppGlyph } from "@/components/layout/FloatingActions";
import { buildQuote, type DiscountRules, type PricingCatalog } from "@/lib/pricing";
import { openGroups } from "@/lib/badges";
import { generateBookingId } from "@/lib/whatsapp";
import { checkoutViaWhatsApp } from "@/lib/payments";
import { trackEvent } from "@/lib/analytics";
import type { Booking, BookingCustomer, Coupon, CourseSummary, Locale, Mode } from "@/lib/types";
import { cn } from "@/lib/utils";

const PHONE_CODES = ["+971", "+20", "+966", "+965", "+974", "+968", "+973", "+962", "+1", "+44"];

const EMIRATES = {
  ar: ["أبوظبي", "دبي", "الشارقة", "عجمان", "أم القيوين", "رأس الخيمة", "الفجيرة", "مصر", "السعودية", "الكويت", "قطر", "عُمان", "البحرين"],
  en: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah", "Egypt", "Saudi Arabia", "Kuwait", "Qatar", "Oman", "Bahrain"],
};

export const LAST_BOOKING_KEY = "abc:lastBooking";

type Errors = Partial<Record<keyof BookingCustomer | "groups", string>>;

export function CartView({ catalog, rules }: { catalog: PricingCatalog; rules: DiscountRules }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const money = useMoney();
  const { cart, hydrated, updateCartItem, removeFromCart, clearCart } = useStore();

  const [customer, setCustomer] = useState<BookingCustomer>({
    traineeName: "",
    age: "",
    guardianName: "",
    phoneCode: "+971",
    phone: "",
    email: "",
    country: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isStudent, setIsStudent] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checking, setChecking] = useState(false);

  const levelLabel = (c: CourseSummary) => `${t(`levels.${c.level}`)}${c.cefr ? ` (${c.cefr})` : ""}`;

  const quote = useMemo(
    () => buildQuote(cart, catalog, { rules, coupon, isAbnaonaStudent: isStudent, levelLabel }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cart, catalog, rules, coupon, isStudent, locale]
  );

  const couponErrorText = quote.couponError
    ? t(`cart.${({ invalid: "couponInvalid", expired: "couponExpired", min: "couponMin", notApplicable: "couponNotApplicable" } as const)[quote.couponError]}`)
    : null;

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setChecking(true);
    try {
      const res = await fetch(`/api/coupons/validate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const data = (await res.json()) as { coupon?: Coupon };
      if (res.ok && data.coupon) {
        setCoupon(data.coupon);
        setCouponMsg({ ok: true, text: t("cart.couponApplied", { code }) });
      } else {
        setCoupon(null);
        setCouponMsg({ ok: false, text: t("cart.couponInvalid") });
      }
    } catch {
      setCouponMsg({ ok: false, text: t("cart.couponInvalid") });
    } finally {
      setChecking(false);
    }
  };

  const set = (k: keyof BookingCustomer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCustomer((c) => ({ ...c, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    const req = t("cart.errors.required");
    if (!customer.traineeName.trim()) e.traineeName = req;
    const age = Number(customer.age);
    if (!customer.age) e.age = req;
    else if (!Number.isFinite(age) || age < 3 || age > 99) e.age = t("cart.errors.age");
    if (age && age < 18 && !customer.guardianName.trim()) e.guardianName = t("cart.errors.guardian");
    const digits = customer.phone.replace(/\D/g, "");
    if (!digits) e.phone = req;
    else if (digits.length < 7 || digits.length > 12) e.phone = t("cart.errors.phone");
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) e.email = t("cart.errors.email");
    if (cart.some((i) => i.type === "course" && i.mode !== "recorded" && !i.groupId)) e.groups = t("cart.errors.group");
    return e;
  };

  const confirm = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true'], #groups-error")?.focus?.();
      document.querySelector("[aria-invalid='true'], #groups-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const booking: Booking = {
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      locale,
      customer: { ...customer, phone: customer.phone.replace(/[^\d ]/g, "").trim() },
      lines: quote.lines,
      quote,
      couponCode: coupon?.code,
      isAbnaonaStudent: isStudent,
    };
    const { redirectUrl } = checkoutViaWhatsApp(booking);
    try { localStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(booking)); } catch { /* ignore */ }
    trackEvent("Lead", { value: quote.total, currency: "AED", booking_id: booking.id });
    // Open WhatsApp synchronously (inside the click handler) so pop-up blockers allow it
    // (if it is blocked anyway, the thank-you page shows a big "send via WhatsApp" button)
    const win = window.open(redirectUrl, "_blank");
    if (win) win.opener = null;
    clearCart();
    router.push(`/booking/success?id=${encodeURIComponent(booking.id)}`);
  };

  if (!hydrated) {
    return <div className="container-x py-24"><div className="card mx-auto h-64 max-w-3xl animate-pulse" /></div>;
  }

  if (cart.length === 0) {
    return (
      <div className="container-x py-20">
        <div className="card mx-auto flex max-w-xl flex-col items-center p-10 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-100 text-gold-700">
            <ShoppingBag className="h-10 w-10" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-sans text-2xl font-extrabold text-lapis-900">{t("cart.empty")}</h2>
          <p className="mt-2 text-copper-700">{t("cart.emptyText")}</p>
          <Link href="/courses" className="btn btn-gold btn-lg mt-6">{t("common.browseCourses")}</Link>
        </div>
      </div>
    );
  }

  const field = (k: keyof BookingCustomer, label: string, input: React.ReactNode, hint?: string) => (
    <div>
      <label htmlFor={`f-${k}`} className="label">{label}</label>
      {input}
      {errors[k] ? (
        <p id={`e-${k}`} className="mt-1 text-xs font-bold text-pharaoh-600" role="alert">{errors[k]}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-copper-700">{hint}</p>
      ) : null}
    </div>
  );
  const inputProps = (k: keyof BookingCustomer) => ({
    id: `f-${k}`,
    value: customer[k],
    onChange: set(k),
    "aria-invalid": errors[k] ? ("true" as const) : undefined,
    "aria-describedby": errors[k] ? `e-${k}` : undefined,
    className: cn("field", errors[k] && "field-error"),
  });

  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
      <div className="min-w-0 space-y-8">
        {/* ───── Items ───── */}
        <section className="card p-5 sm:p-6" aria-labelledby="items-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="items-title" className="font-sans text-xl font-extrabold text-lapis-900">{t("cart.items")} ({cart.length})</h2>
            <button type="button" onClick={clearCart} className="text-sm font-bold text-pharaoh-600 hover:underline">{t("cart.clear")}</button>
          </div>
          <ul className="divide-y divide-papyrus-300">
            {cart.map((item) => {
              const line = quote.lines.find((l) => l.key === item.key);
              const course = item.type === "course" ? catalog.courses.find((c) => c.id === item.refId) : undefined;
              const pkg = item.type === "package" ? catalog.packages.find((p) => p.id === item.refId) : undefined;
              if (!line || (!course && !pkg)) return null;
              const modes: Mode[] = course ? course.modes : pkg!.modes;
              const groups = course ? openGroups(course.groups).filter((g) => g.mode === item.mode) : [];
              return (
                <li key={item.key} className="flex flex-col gap-4 py-5 sm:flex-row">
                  {course ? (
                    <CourseCover title={course.title} icon={course.icon} theme={course.theme} image={course.image} className="aspect-[16/10] w-full shrink-0 rounded-2xl sm:w-40" sizes="160px" />
                  ) : (
                    <div className="flex aspect-[16/10] w-full shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-copper-700 text-lapis-950 sm:w-40">
                      <EgyptIcon name={pkg!.icon} className="h-12 w-12" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {pkg && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-gold-800">{t("cart.bundle")}</span>}
                        <h3 className="font-sans text-base font-extrabold text-lapis-900">
                          {course ? <Link href={`/courses/${course.slug}`} className="hover:underline">{course.title}</Link> : pkg!.title}
                        </h3>
                        {line.level && <p className="text-xs text-copper-700">{t("common.level")}: {line.level}</p>}
                        {pkg && <p className="text-xs text-copper-700">{pkg.courseTitles.join(" + ")}</p>}
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.key)} className="rounded-full p-2 text-copper-700 hover:bg-pharaoh-100 hover:text-pharaoh-600" aria-label={`${t("common.remove")}: ${line.title}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-bold text-copper-700" htmlFor={`m-${item.key}`}>{t("cart.mode")}</label>
                        <select
                          id={`m-${item.key}`}
                          value={item.mode}
                          onChange={(e) => {
                            const m = e.target.value as Mode;
                            const g = course ? openGroups(course.groups).find((x) => x.mode === m) : undefined;
                            updateCartItem(item.key, { mode: m, groupId: g?.id });
                          }}
                          className="field py-2 text-sm"
                        >
                          {modes.map((m) => <option key={m} value={m}>{t(`modes.${m}`)}</option>)}
                        </select>
                      </div>
                      {item.mode !== "recorded" && (
                        <div>
                          <label className="mb-1 block text-xs font-bold text-copper-700" htmlFor={`g-${item.key}`}>{t("cart.group")}</label>
                          {course ? (
                            <select
                              id={`g-${item.key}`}
                              value={item.groupId ?? ""}
                              onChange={(e) => updateCartItem(item.key, { groupId: e.target.value || undefined })}
                              className={cn("field py-2 text-sm", errors.groups && !item.groupId && "field-error")}
                            >
                              <option value="">{t("cart.selectGroup")}</option>
                              {groups.map((g) => (
                                <option key={g.id} value={g.id}>{g.days} · {g.time} ({t("common.seatsLeft", { count: g.seatsLeft })})</option>
                              ))}
                            </select>
                          ) : (
                            <p className="field py-2 text-sm text-copper-700">{t("cart.toBeScheduled")}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-copper-700">{t("cart.trainees")}</span>
                        <div className="flex items-center rounded-full border border-papyrus-400 bg-white">
                          <button type="button" className="p-2 disabled:opacity-40" disabled={item.trainees <= 1} onClick={() => updateCartItem(item.key, { trainees: item.trainees - 1 })} aria-label="−"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-6 text-center text-sm font-extrabold">{item.trainees}</span>
                          <button type="button" className="p-2 disabled:opacity-40" disabled={item.trainees >= 6} onClick={() => updateCartItem(item.key, { trainees: item.trainees + 1 })} aria-label="+"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <div className="text-end">
                        {line.net < line.gross && <s className="me-2 text-xs text-copper-700/70">{money(line.gross)}</s>}
                        <span className="font-extrabold text-lapis-800">{money(line.net)}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {errors.groups && <p id="groups-error" tabIndex={-1} className="mt-2 text-sm font-bold text-pharaoh-600" role="alert">{errors.groups}</p>}
          <Link href="/courses" className="mt-2 inline-block text-sm font-bold text-lapis-700 hover:underline">+ {t("cart.continueShopping")}</Link>
        </section>

        {/* ───── Customer form ───── */}
        <section className="card p-5 sm:p-6" aria-labelledby="details-title">
          <h2 id="details-title" className="mb-5 font-sans text-xl font-extrabold text-lapis-900">{t("cart.yourDetails")}</h2>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); confirm(); }} noValidate>
            {field("traineeName", t("cart.traineeName"), <input {...inputProps("traineeName")} autoComplete="name" required />)}
            {field("age", t("cart.age"), <input {...inputProps("age")} type="number" inputMode="numeric" min={3} max={99} required />)}
            <div className="sm:col-span-2">
              {field("guardianName", `${t("cart.guardianName")}`, <input {...inputProps("guardianName")} />, t("cart.guardianHint"))}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="f-phone" className="label">{t("cart.phone")}</label>
              <div className="flex gap-2" dir="ltr">
                <label htmlFor="f-phoneCode" className="sr-only">{t("cart.phoneCode")}</label>
                <select id="f-phoneCode" value={customer.phoneCode} onChange={set("phoneCode")} className="field w-28 shrink-0">
                  {PHONE_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input {...inputProps("phone")} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="55 551 5049" required />
              </div>
              {errors.phone && <p id="e-phone" className="mt-1 text-xs font-bold text-pharaoh-600" role="alert">{errors.phone}</p>}
            </div>
            {field("email", `${t("cart.email")} (${t("common.optional")})`, <input {...inputProps("email")} type="email" autoComplete="email" dir="ltr" />)}
            {field(
              "country",
              t("cart.country"),
              <select {...inputProps("country")}>
                <option value="">{t("cart.countryPlaceholder")}</option>
                {EMIRATES[locale].map((e) => <option key={e} value={e}>{e}</option>)}
                <option value={t("cart.other")}>{t("cart.other")}</option>
              </select>
            )}
            <div className="sm:col-span-2">
              {field("notes", `${t("cart.notes")} (${t("common.optional")})`, <textarea {...inputProps("notes")} rows={3} placeholder={t("cart.notesPlaceholder")} />)}
            </div>
            <button type="submit" className="sr-only">{t("cart.confirmWhatsApp")}</button>
          </form>
        </section>
      </div>

      {/* ───── Summary ───── */}
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-labelledby="summary-title">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-lapis-800 to-royal-900 px-6 py-4">
            <h2 id="summary-title" className="font-sans text-lg font-extrabold text-white">{t("cart.summary")}</h2>
          </div>
          <div className="space-y-5 p-6">
            {/* Coupon */}
            <div>
              <label htmlFor="coupon" className="label">{t("cart.coupon")}</label>
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-nile-500 bg-nile-500/5 px-3 py-2">
                  <span className="flex items-center gap-2 font-mono font-bold text-nile-700" dir="ltr"><Tag className="h-4 w-4" />{coupon.code}</span>
                  <button type="button" onClick={() => { setCoupon(null); setCouponMsg(null); setCouponInput(""); }} className="rounded-full p-1 hover:bg-white" aria-label={t("cart.removeCoupon")}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input id="coupon" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyCoupon()} placeholder={t("cart.couponPlaceholder")} className="field uppercase" dir="ltr" />
                  <button type="button" onClick={applyCoupon} disabled={checking || !couponInput.trim()} className="btn btn-lapis">{t("cart.applyCoupon")}</button>
                </div>
              )}
              {(couponErrorText || couponMsg) && (
                <p className={cn("mt-1.5 text-xs font-bold", couponErrorText || !couponMsg?.ok ? "text-pharaoh-600" : "text-nile-700")} role="status">
                  {couponErrorText ?? couponMsg?.text}
                </p>
              )}
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-papyrus-100 p-3">
              <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} className="mt-1 h-4 w-4 accent-lapis-700" />
              <span>
                <span className="block text-sm font-bold text-lapis-900">{t("cart.abnaonaStudent")}</span>
                <span className="block text-xs text-copper-700">{t("cart.abnaonaStudentHint", { percent: rules.abnaonaStudentPercent })}</span>
              </span>
            </label>

            <dl className="space-y-2 border-t border-dashed border-papyrus-400 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-copper-900">{t("cart.subtotal")}</dt><dd className="font-bold">{money(quote.subtotal)}</dd></div>
              {quote.discounts.map((d, i) => (
                <div key={i} className={cn("flex justify-between", d.amount > 0 ? "text-nile-700" : "text-copper-700")}>
                  <dt>{d.kind === "coupon" ? t("cart.discountKinds.coupon", { code: d.label ?? "" }) : t(`cart.discountKinds.${d.kind}`)}</dt>
                  <dd className="font-bold">{d.amount > 0 ? "−" : "+"}{money(Math.abs(d.amount))}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-papyrus-300 pt-3">
                <dt className="text-base font-extrabold text-lapis-900">{t("cart.total")}</dt>
                <dd className="text-2xl font-extrabold text-lapis-800">{money(quote.total)}</dd>
              </div>
            </dl>

            <button type="button" onClick={confirm} className="btn btn-whatsapp btn-lg w-full">
              <WhatsAppGlyph className="h-6 w-6" />
              {t("cart.confirmWhatsApp")}
            </button>
            <p className="flex gap-2 text-xs leading-5 text-copper-700">
              <ShieldCheck className="h-4 w-4 shrink-0 text-nile-500" aria-hidden="true" />
              {t("cart.paymentNote")}
            </p>
            {Object.keys(errors).some((k) => errors[k as keyof Errors]) && (
              <p className="text-sm font-bold text-pharaoh-600" role="alert">{t("cart.errors.form")}</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
