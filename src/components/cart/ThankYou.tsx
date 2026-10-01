"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, Copy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useStore } from "@/components/providers/StoreProvider";
import { WhatsAppGlyph } from "@/components/layout/FloatingActions";
import { checkoutViaWhatsApp } from "@/lib/payments";
import { formatNumber } from "@/lib/format";
import type { Booking } from "@/lib/types";
import { LAST_BOOKING_KEY } from "./CartView";

export function ThankYou() {
  const t = useTranslations();
  const params = useSearchParams();
  const { toast } = useStore();
  const id = params.get("id");
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_BOOKING_KEY);
      const b = raw ? (JSON.parse(raw) as Booking) : null;
      setBooking(b && (!id || b.id === id) ? b : null);
    } catch {
      setBooking(null);
    }
  }, [id]);

  const bookingId = booking?.id ?? id;

  return (
    <div className="container-x py-12">
      <div className="card mx-auto max-w-2xl overflow-hidden text-center">
        <div className="relative bg-gradient-to-br from-nile-500 to-lapis-800 px-6 py-10 text-white">
          <div className="bg-hieroglyphs-light absolute inset-0" aria-hidden="true" />
          <CheckCircle2 className="relative mx-auto h-16 w-16 text-gold-300" aria-hidden="true" />
          <h1 className="relative mt-4 text-2xl font-bold sm:text-3xl">{t("thankyou.title")}</h1>
          <p className="relative mt-2 text-papyrus-100/90">{t("thankyou.subtitle")}</p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          {bookingId && (
            <div>
              <p className="text-sm font-bold text-copper-700">{t("thankyou.bookingId")}</p>
              <button
                type="button"
                onClick={async () => { try { await navigator.clipboard.writeText(bookingId); toast(t("common.copied")); } catch { /* ignore */ } }}
                className="mt-1 inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-gold-500 bg-gold-50 px-5 py-3 font-mono text-xl font-extrabold text-lapis-900"
                dir="ltr"
              >
                {bookingId} <Copy className="h-4 w-4 text-gold-700" aria-label={t("common.copy")} />
              </button>
            </div>
          )}

          {booking && (
            <div className="rounded-2xl bg-papyrus-100 p-4 text-start text-sm">
              <ul className="space-y-1">
                {booking.lines.map((l) => (
                  <li key={l.key} className="flex justify-between gap-3">
                    <span className="text-copper-900">{l.title}{l.trainees > 1 ? ` ×${l.trainees}` : ""}</span>
                    <span className="font-bold">{formatNumber(l.net, booking.locale)} {booking.locale === "ar" ? "درهم" : "AED"}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-papyrus-300 pt-2 font-extrabold text-lapis-900">
                <span>{t("cart.total")}</span>
                <span>{formatNumber(booking.quote.total, booking.locale)} {booking.locale === "ar" ? "درهم" : "AED"}</span>
              </div>
            </div>
          )}
          {booking === null && <p className="text-sm text-copper-700">{t("thankyou.notFound")}</p>}

          <div className="text-start">
            <h2 className="mb-3 font-sans text-lg font-extrabold text-lapis-900">{t("thankyou.stepsTitle")}</h2>
            <ol className="space-y-3">
              {(["step1", "step2", "step3", "step4"] as const).map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lapis-700 text-sm font-bold text-gold-300">{i + 1}</span>
                  <span className="pt-0.5 text-copper-900">{t(`thankyou.${s}`)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {booking && (
              <a href={checkoutViaWhatsApp(booking).redirectUrl} target="_blank" rel="noopener" className="btn btn-whatsapp btn-lg">
                <WhatsAppGlyph className="h-5 w-5" /> {t("thankyou.resend")}
              </a>
            )}
            <Link href="/courses" className="btn btn-outline btn-lg">{t("thankyou.browseMore")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
