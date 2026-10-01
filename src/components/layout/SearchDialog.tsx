"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Search, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { useMoney } from "@/components/ui/Price";
import type { SearchItem } from "@/lib/types";
import { cn, matchesQuery } from "@/lib/utils";

/** Instant search over all courses (client-side, Arabic-aware normalisation). */
export function SearchDialog({
  open,
  onClose,
  index,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  index: SearchItem[];
  locale: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const money = useMoney();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    if (!q.trim()) return index.slice(0, 5);
    return index
      .filter((i) => matchesQuery(`${i.title} ${i.subtitle} ${i.category} ${i.instructor}`, q))
      .slice(0, 7);
  }, [q, index]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label={t("common.search")}>
      <div className="absolute inset-0 bg-lapis-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-fade-up relative w-full max-w-xl overflow-hidden rounded-3xl bg-papyrus-50 shadow-2xl ring-1 ring-gold-500/30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (results[active] && q.trim()) go(`/courses/${results[active].slug}`);
            else go(`/courses${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
          }}
          className="flex items-center gap-3 border-b border-papyrus-300 px-5"
        >
          <Search className="h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            }}
            placeholder={t("header.searchPlaceholder")}
            className="h-16 flex-1 bg-transparent text-lg text-ink outline-none placeholder:text-copper-700/50"
            aria-label={t("header.searchPlaceholder")}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active].slug}` : undefined}
          />
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-papyrus-200" aria-label={t("common.close")}>
            <X className="h-5 w-5" />
          </button>
        </form>

        <ul id="search-results" role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="p-6 text-center text-copper-700">{t("header.searchNoResults")}</li>}
          {results.map((r, i) => (
            <li key={r.slug} id={`sr-${r.slug}`} role="option" aria-selected={i === active}>
              <Link
                href={`/courses/${r.slug}`}
                onClick={onClose}
                onMouseEnter={() => setActive(i)}
                className={cn("flex items-center gap-3 rounded-2xl p-3 transition", i === active ? "bg-lapis-50" : "hover:bg-papyrus-100")}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-700 to-royal-700 text-gold-300">
                  <EgyptIcon name={r.icon} className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-lapis-900">{r.title}</span>
                  <span className="block truncate text-xs text-copper-700">{r.category} · {r.instructor}</span>
                </span>
                <span className="shrink-0 text-sm font-extrabold text-lapis-800">{money(r.fromPrice)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => go(`/courses${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`)}
          className="flex w-full items-center justify-center gap-2 border-t border-papyrus-300 bg-papyrus-100 py-3 text-sm font-bold text-lapis-700 hover:bg-papyrus-200"
        >
          {t("header.searchAll")} <Arrow className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
