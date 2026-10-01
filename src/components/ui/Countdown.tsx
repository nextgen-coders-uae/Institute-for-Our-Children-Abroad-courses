"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/types";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    ms,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/** Live countdown to `endsAt` (ISO). Renders placeholders on the server to avoid hydration mismatch. */
export function Countdown({ endsAt }: { endsAt: string }) {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const target = new Date(endsAt).getTime();
  const [left, setLeft] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setLeft(diff(target));
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left && left.ms === 0) {
    return <p className="font-bold text-gold-200">{t("offerEnded")}</p>;
  }

  const units = [
    { v: left?.days, label: t("days") },
    { v: left?.hours, label: t("hours") },
    { v: left?.minutes, label: t("minutesShort") },
    { v: left?.seconds, label: t("seconds") },
  ];

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label={t("endsIn")}>
      {units.map((u) => (
        <div key={u.label} className="flex w-16 flex-col items-center rounded-2xl bg-white/10 py-2 ring-1 ring-gold-300/40 backdrop-blur sm:w-20">
          <span className="font-display text-2xl font-bold text-gold-200 tabular-nums sm:text-3xl">
            {u.v === undefined ? "--" : formatNumber(u.v, locale).padStart(2, "0")}
          </span>
          <span className="text-[11px] font-semibold text-papyrus-200/80">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
