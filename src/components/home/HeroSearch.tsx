"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";

const POPULAR = [
  { q: "IELTS", label: "IELTS" },
  { category: "languages", language: "french", ar: "فرنسي", en: "French" },
  { category: "programming", ar: "برمجة للأطفال", en: "Kids coding" },
  { category: "graphic-design", ar: "تصميم جرافيك", en: "Graphic design" },
  { language: "german", ar: "ألماني", en: "German" },
] as const;

export function HeroSearch() {
  const t = useTranslations("home");
  const router = useRouter();
  const locale = useLocale();
  const [q, setQ] = useState("");

  return (
    <div className="card mx-auto max-w-4xl p-4 sm:p-6">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : "/courses");
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="hero-q" className="sr-only">{t("searchTitle")}</label>
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-600" aria-hidden="true" />
          <input
            id="hero-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="field h-14 rounded-full ps-12 text-base"
          />
        </div>
        <button type="submit" className="btn btn-lapis btn-lg h-14">{t("searchButton")}</button>
      </form>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold text-copper-700">{t("popularSearches")}</span>
        {POPULAR.map((p, i) => {
          const query: Record<string, string> = {};
          if ("q" in p) query.q = p.q;
          if ("category" in p) query.category = p.category;
          if ("language" in p) query.language = p.language;
          const label = "label" in p ? p.label : null;
          return (
            <Link key={i} href={{ pathname: "/courses", query }} className="chip text-xs">
              {label ?? (p as { ar: string; en: string })[locale === "ar" ? "ar" : "en"]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
