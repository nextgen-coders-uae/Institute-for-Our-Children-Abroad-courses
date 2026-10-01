"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { BadgeCheck, SearchX, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Locale } from "@/lib/types";

interface Result {
  valid: boolean;
  id?: string;
  traineeName?: string;
  course?: string;
  issuedAt?: string;
  grade?: string;
  hours?: number;
}

/** Certificate lookup — supports ?id=… so QR codes printed on certificates can link here directly. */
export function VerifyForm() {
  const t = useTranslations("verify");
  const locale = useLocale() as Locale;
  const params = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const check = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/certificates?id=${encodeURIComponent(value.trim())}&locale=${locale}`);
      setResult((await res.json()) as Result);
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = params.get("id");
    if (initial) check(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card mx-auto max-w-2xl p-6 sm:p-10">
      <ShieldCheck className="mx-auto h-14 w-14 text-gold-600" aria-hidden="true" />
      <form
        className="mt-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          check(id);
        }}
      >
        <label htmlFor="cert-id" className="sr-only">{t("placeholder")}</label>
        <input
          id="cert-id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder={t("placeholder")}
          className="field h-14 flex-1 text-center font-mono text-lg uppercase"
          dir="ltr"
          required
        />
        <button type="submit" disabled={loading} className="btn btn-lapis btn-lg h-14">{loading ? t("checking") : t("button")}</button>
      </form>
      <p className="mt-3 text-center text-xs text-copper-700">{t("sampleHint")}</p>

      <div aria-live="polite" className="mt-8">
        {result?.valid && (
          <div className="animate-fade-up overflow-hidden rounded-2xl border-2 border-nile-500">
            <p className="flex items-center justify-center gap-2 bg-nile-500 px-4 py-3 font-bold text-white">
              <BadgeCheck className="h-5 w-5" aria-hidden="true" /> {t("valid")}
            </p>
            <dl className="grid gap-4 bg-white p-6 sm:grid-cols-2">
              {[
                [t("trainee"), result.traineeName],
                [t("course"), result.course],
                [t("date"), result.issuedAt ? formatDate(result.issuedAt, locale) : ""],
                [t("grade"), result.grade],
                [t("hours"), String(result.hours ?? "")],
                ["ID", result.id],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-copper-700">{k}</dt>
                  <dd className="font-extrabold text-lapis-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        {result && !result.valid && (
          <p className="animate-fade-up flex items-center justify-center gap-2 rounded-2xl bg-pharaoh-100 p-4 text-center font-bold text-pharaoh-700">
            <SearchX className="h-5 w-5 shrink-0" aria-hidden="true" /> {t("invalid")}
          </p>
        )}
      </div>
    </div>
  );
}
