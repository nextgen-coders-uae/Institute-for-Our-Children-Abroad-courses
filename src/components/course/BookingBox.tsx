"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Award, CalendarCheck, Check, FileText, Link2, MessageCircle, Minus, Plus, ShoppingBag, Users, Zap } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useStore } from "@/components/providers/StoreProvider";
import { Price, useMoney } from "@/components/ui/Price";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { NotifyForm } from "@/components/forms/NotifyForm";
import { WhatsAppGlyph } from "@/components/layout/FloatingActions";
import { openGroups } from "@/lib/badges";
import { siblingDiscount, type DiscountRules } from "@/lib/pricing";
import { formatDate } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import type { CourseSummary, Locale, Mode } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BookingBox({ course, rules, url }: { course: CourseSummary; rules: DiscountRules; url: string }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const money = useMoney();
  const { addToCart, toast } = useStore();

  const open = useMemo(() => openGroups(course.groups), [course.groups]);
  const modeAvailable = (m: Mode) => m === "recorded" || open.some((g) => g.mode === m);
  const firstAvailable = course.modes.find(modeAvailable);

  const [mode, setMode] = useState<Mode>(firstAvailable ?? course.modes[0]);
  const groupsForMode = course.groups.filter((g) => g.mode === mode);
  const openForMode = open.filter((g) => g.mode === mode);
  const [groupId, setGroupId] = useState<string | undefined>(openForMode[0]?.id);
  const [trainees, setTrainees] = useState(1);

  const selectMode = (m: Mode) => {
    setMode(m);
    setGroupId(open.find((g) => g.mode === m)?.id);
  };

  const price = course.prices[mode]?.price ?? 0;
  const oldPrice = course.prices[mode]?.oldPrice;
  const group = course.groups.find((g) => g.id === groupId);
  const today = new Date().toISOString().slice(0, 10);
  const earlyBird = group?.earlyBirdUntil && today <= group.earlyBirdUntil ? Math.round((price * trainees * rules.earlyBirdPercent) / 100) : 0;
  const sibling = siblingDiscount(price, trainees, rules);
  const total = price * trainees - sibling - earlyBird;
  const modeFull = !modeAvailable(mode);

  const add = (goToCart: boolean) => {
    addToCart({ type: "course", refId: course.id, mode, groupId: mode === "recorded" ? undefined : groupId, trainees });
    trackEvent("AddToCart", { content_ids: [course.id], value: total, currency: "AED" });
    if (goToCart) router.push("/cart");
    else toast(t("common.addedToCart"));
  };

  const shareText = t("course.shareText", { title: course.title });

  return (
    <div id="booking" className="card scroll-mt-28 overflow-hidden">
      <div className="bg-gradient-to-br from-lapis-800 to-royal-900 p-5 text-white">
        <p className="text-sm text-papyrus-200/80">{t("course.bookingTitle")}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <Price aed={price} old={oldPrice} className="text-3xl" light />
          <span className="text-sm text-papyrus-200/80">/ {t("course.perTrainee")}</span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {/* Attendance mode */}
        <fieldset>
          <legend className="label">{t("course.chooseMode")}</legend>
          <div className="grid gap-2">
            {course.modes.map((m) => {
              const available = modeAvailable(m);
              return (
                <label
                  key={m}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 transition",
                    mode === m ? "border-lapis-700 bg-lapis-50" : "border-papyrus-300 bg-white hover:border-gold-500"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <input type="radio" name="mode" checked={mode === m} onChange={() => selectMode(m)} className="h-4 w-4 accent-lapis-700" />
                    <span className="font-bold text-lapis-900">{t(`modes.${m}`)}</span>
                    {!available && <span className="rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold text-white">{t("course.full")}</span>}
                  </span>
                  <span className="text-sm font-extrabold text-lapis-800">{money(course.prices[m]!.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {modeFull ? (
          <NotifyForm courseTitle={course.title} mode={t(`modes.${mode}`)} />
        ) : (
          <>
            {/* Group */}
            {mode !== "recorded" ? (
              <fieldset>
                <legend className="label">{t("course.chooseGroup")}</legend>
                <div className="grid gap-2">
                  {groupsForMode.map((g) => {
                    const full = g.seatsLeft <= 0 || !openForMode.includes(g);
                    return (
                      <label
                        key={g.id}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl border-2 px-4 py-3 text-sm transition",
                          full ? "cursor-not-allowed border-papyrus-300 bg-papyrus-100 opacity-60" : "cursor-pointer",
                          !full && groupId === g.id ? "border-lapis-700 bg-lapis-50" : !full && "border-papyrus-300 bg-white hover:border-gold-500"
                        )}
                      >
                        <input
                          type="radio"
                          name="group"
                          disabled={full}
                          checked={groupId === g.id}
                          onChange={() => setGroupId(g.id)}
                          className="mt-1 h-4 w-4 accent-lapis-700"
                        />
                        <span className="flex-1">
                          <span className="block font-bold text-lapis-900">{g.days}</span>
                          <span className="block text-copper-700" dir="ltr">{g.time}</span>
                          <span className="mt-1 flex flex-wrap gap-x-3 text-xs">
                            <span className="text-copper-700">{t("course.startDate")}: {formatDate(g.startDate, locale, { day: "numeric", month: "short" })}</span>
                            <span className={cn("font-bold", g.seatsLeft <= 3 ? "text-pharaoh-600" : "text-nile-700")}>
                              {t("common.seatsLeft", { count: Math.max(0, g.seatsLeft) })}
                            </span>
                          </span>
                          {g.earlyBirdUntil && today <= g.earlyBirdUntil && (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-gold-800">
                              <Zap className="h-3 w-3" aria-hidden="true" />
                              {t("course.earlyBird", { percent: rules.earlyBirdPercent, date: formatDate(g.earlyBirdUntil, locale, { day: "numeric", month: "short" }) })}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <p className="rounded-2xl bg-nile-500/10 p-3 text-sm font-semibold text-nile-700">{t("course.recordedOnly")}</p>
            )}

            {/* Trainees (sibling discount) */}
            <div>
              <p className="label" id="trainees-label">{t("course.trainees")}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border-2 border-papyrus-300 bg-white" role="group" aria-labelledby="trainees-label">
                  <button type="button" onClick={() => setTrainees((n) => Math.max(1, n - 1))} className="p-2.5 text-lapis-800 disabled:opacity-40" disabled={trainees <= 1} aria-label="−">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-lapis-900" aria-live="polite">{trainees}</span>
                  <button type="button" onClick={() => setTrainees((n) => Math.min(6, n + 1))} className="p-2.5 text-lapis-800" aria-label="+">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="flex-1 text-xs leading-5 text-copper-700">
                  <Users className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
                  {t("course.traineesHint", { second: rules.siblingSecondPercent, third: rules.siblingThirdPlusPercent })}
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-2xl bg-papyrus-100 p-4 text-sm">
              {(sibling > 0 || earlyBird > 0) && (
                <div className="mb-2 space-y-1 text-copper-900">
                  <div className="flex justify-between"><span>{money(price)} × {trainees}</span><span>{money(price * trainees)}</span></div>
                  {sibling > 0 && <div className="flex justify-between text-nile-700"><span>{t("cart.discountKinds.sibling")}</span><span>−{money(sibling)}</span></div>}
                  {earlyBird > 0 && <div className="flex justify-between text-nile-700"><span>{t("cart.discountKinds.earlyBird")}</span><span>−{money(earlyBird)}</span></div>}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-bold text-lapis-900">{t("course.total")}</span>
                <span className="text-xl font-extrabold text-lapis-800">{money(total)}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <button type="button" onClick={() => add(true)} disabled={mode !== "recorded" && !groupId} className="btn btn-gold btn-lg w-full">
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                {t("common.bookNow")}
              </button>
              <div className="flex gap-2">
                <button type="button" onClick={() => add(false)} disabled={mode !== "recorded" && !groupId} className="btn btn-outline flex-1">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  {t("common.addToCart")}
                </button>
                <WishlistButton courseId={course.id} className="h-11 w-11 border-2 border-lapis-700/20 shadow-none" />
              </div>
            </div>
          </>
        )}

        {/* Includes */}
        <div>
          <p className="label">{t("course.includes")}</p>
          <ul className="space-y-1.5 text-sm text-copper-900">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-nile-500" aria-hidden="true" />{t("course.includeSessions", { sessions: course.sessionsCount, minutes: course.sessionMinutes })}</li>
            <li className="flex items-center gap-2"><Award className="h-4 w-4 text-nile-500" aria-hidden="true" />{t("course.includeCert")}</li>
            <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-nile-500" aria-hidden="true" />{t("course.includeMaterials")}</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-nile-500" aria-hidden="true" />{t("course.includeSupport")}</li>
          </ul>
        </div>

        {/* Share */}
        <div className="border-t border-dashed border-papyrus-400 pt-4">
          <p className="label">{t("common.share")}</p>
          <div className="flex flex-wrap gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`} target="_blank" rel="noopener" className="chip text-xs font-bold">
              <WhatsAppGlyph className="h-4 w-4 text-[#1f9d55]" /> {t("course.shareWhatsapp")}
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener" className="chip text-xs font-bold">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1877f2] text-[10px] font-black text-white" aria-hidden="true">f</span>
              {t("course.shareFacebook")}
            </a>
            <button
              type="button"
              onClick={async () => {
                try { await navigator.clipboard.writeText(url); toast(t("common.copied")); } catch { /* ignore */ }
              }}
              className="chip text-xs font-bold"
            >
              <Link2 className="h-4 w-4 text-lapis-700" aria-hidden="true" /> {t("course.copyLink")}
            </button>
          </div>
          <a
            href={waLink(t("course.askText", { title: course.title }))}
            target="_blank"
            rel="noopener"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-nile-700 hover:underline"
          >
            <WhatsAppGlyph className="h-4 w-4" /> {t("course.askQuestion")}
          </a>
        </div>
      </div>
    </div>
  );
}

/** Mobile bottom bar that jumps to the booking box. */
export function MobileBookingBar({ fromPrice, oldPrice }: { fromPrice: number; oldPrice?: number }) {
  const t = useTranslations();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold-500/30 bg-papyrus-50/95 p-3 pe-20 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] text-copper-700">{t("course.stickyFrom")}</p>
          <Price aed={fromPrice} old={oldPrice} className="text-lg" />
        </div>
        <a href="#booking" className="btn btn-gold">{t("common.bookNow")}</a>
      </div>
    </div>
  );
}
