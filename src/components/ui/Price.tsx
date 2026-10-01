"use client";

import { useLocale } from "next-intl";
import { useStore } from "@/components/providers/StoreProvider";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Price in AED converted to the visitor's selected display currency. */
export function Price({
  aed,
  old,
  className,
  light,
}: {
  aed: number;
  old?: number;
  className?: string;
  /** Use on dark backgrounds */
  light?: boolean;
}) {
  const locale = useLocale() as Locale;
  const { currency, rate } = useStore();
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={cn("font-extrabold", light ? "text-gold-200" : "text-lapis-800", className)}>{formatMoney(aed, locale, currency, rate)}</span>
      {old && old > aed ? (
        <s className={cn("text-sm", light ? "text-papyrus-200/70" : "text-copper-700/70")} aria-label={`${formatMoney(old, locale, currency, rate)}`}>
          {formatMoney(old, locale, currency, rate)}
        </s>
      ) : null}
    </span>
  );
}

export function useMoney() {
  const locale = useLocale() as Locale;
  const { currency, rate } = useStore();
  return (aed: number) => formatMoney(aed, locale, currency, rate);
}
