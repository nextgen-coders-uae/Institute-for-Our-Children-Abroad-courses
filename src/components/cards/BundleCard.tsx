"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Crown } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useStore } from "@/components/providers/StoreProvider";
import { Price, useMoney } from "@/components/ui/Price";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import type { Mode, Package } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BundleCard({ pkg }: { pkg: Package }) {
  const t = useTranslations();
  const router = useRouter();
  const money = useMoney();
  const { addToCart } = useStore();
  const [mode, setMode] = useState<Mode>(pkg.modes[0]);

  return (
    <article className={cn("card relative flex flex-col overflow-hidden", pkg.highlight && "ring-2 ring-gold-500")}>
      {pkg.highlight && (
        <span className="absolute end-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-gold-400 px-3 py-1 text-xs font-extrabold text-ink">
          <Crown className="h-3.5 w-3.5" aria-hidden="true" /> {t("packages.bestValue")}
        </span>
      )}
      <div className="relative flex items-center gap-4 bg-gradient-to-br from-lapis-800 to-royal-900 p-6 text-white">
        <div className="bg-hieroglyphs-light absolute inset-0" aria-hidden="true" />
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-gold-300 to-gold-500 text-lapis-950">
          <EgyptIcon name={pkg.icon} className="h-7 w-7" />
        </span>
        <h3 className="relative font-sans text-xl leading-snug font-extrabold">{pkg.title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-copper-900">{pkg.description}</p>
        <p className="mt-4 text-sm font-extrabold text-gold-700">{t("packages.includes")}</p>
        <ul className="mt-2 space-y-1.5">
          {pkg.courseTitles.map((c) => (
            <li key={c} className="flex items-center gap-2 text-sm text-lapis-900">
              <Check className="h-4 w-4 text-nile-500" aria-hidden="true" /> {c}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-bold text-copper-700">{t("packages.chooseMode")}</legend>
            <div className="flex flex-wrap gap-2">
              {pkg.modes.map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cn("chip text-xs font-bold", mode === m && "chip-active")}>
                  {t(`modes.${m}`)}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Price aed={pkg.price} old={pkg.oldPrice} className="text-2xl" />
              <p className="mt-1 inline-block rounded-full bg-pharaoh-100 px-2.5 py-0.5 text-xs font-extrabold text-pharaoh-700">
                {t("packages.save", { amount: money(pkg.oldPrice - pkg.price) })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                addToCart({ type: "package", refId: pkg.id, mode, trainees: 1 });
                router.push("/cart");
              }}
              className="btn btn-gold"
            >
              {t("packages.bookBundle")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CopyCode({ code }: { code: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch { /* ignore */ }
      }}
      className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-gold-500 bg-gold-50 px-4 py-2 font-mono text-lg font-extrabold text-lapis-900 hover:bg-gold-100"
      dir="ltr"
    >
      {code}
      {copied ? <Check className="h-4 w-4 text-nile-500" aria-label={t("copied")} /> : <Copy className="h-4 w-4 text-gold-700" aria-label={t("copy")} />}
    </button>
  );
}
