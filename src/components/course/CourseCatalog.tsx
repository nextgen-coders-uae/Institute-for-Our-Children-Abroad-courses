"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, X, SearchX } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { CourseCard } from "./CourseCard";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { useMoney } from "@/components/ui/Price";
import type { AgeGroup, Category, CourseSummary, LanguageKey, Level, Mode } from "@/lib/types";
import { cn, matchesQuery } from "@/lib/utils";

type Filters = {
  q: string;
  category: string;
  language: string;
  level: string;
  age: string;
  mode: string;
  maxPrice: string;
  duration: string;
  sort: string;
};

const KEYS: (keyof Filters)[] = ["q", "category", "language", "level", "age", "mode", "maxPrice", "duration", "sort"];
const LANGS: LanguageKey[] = ["english", "french", "german", "arabic"];
const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
const AGES: AgeGroup[] = ["kids", "teens", "adults"];
const MODES: Mode[] = ["in-person", "online", "recorded"];
const DURATIONS = ["short", "medium", "long"] as const;
const SORTS = ["popular", "newest", "price-asc", "price-desc"] as const;

function durationOk(weeks: number, d: string) {
  if (d === "short") return weeks <= 6;
  if (d === "medium") return weeks >= 7 && weeks <= 10;
  if (d === "long") return weeks > 10;
  return true;
}

export function CourseCatalog({ courses, categories }: { courses: CourseSummary[]; categories: Category[] }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const money = useMoney();
  const [drawer, setDrawer] = useState(false);

  const f: Filters = Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? ""])) as Filters;
  const [q, setQ] = useState(f.q);
  // Sync the input from the URL only for external changes (back button, chips) — not for our own debounced pushes,
  // otherwise a slow round-trip could overwrite what the user is still typing.
  const pushedQ = useRef(f.q);
  useEffect(() => {
    if (f.q !== pushedQ.current) {
      pushedQ.current = f.q;
      setQ(f.q);
    }
  }, [f.q]);

  const priceCeil = useMemo(() => Math.ceil(Math.max(...courses.map((c) => Math.max(...Object.values(c.prices).map((p) => p!.price)))) / 50) * 50, [courses]);
  const langNames = useMemo(() => Object.fromEntries(LANGS.map((l) => [l, t(`languagesList.${l}`)])), [t]);

  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch };
    const query: Record<string, string> = {};
    for (const k of KEYS) if (next[k]) query[k] = next[k];
    router.replace({ pathname, query }, { scroll: false });
  };

  // Debounced text search → URL
  useEffect(() => {
    if (q === f.q) return;
    const id = setTimeout(() => {
      pushedQ.current = q;
      update({ q });
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const results = useMemo(() => {
    const max = f.maxPrice ? Number(f.maxPrice) : Infinity;
    const list = courses.filter((c) => {
      if (f.category && c.categoryId !== f.category) return false;
      if (f.language && c.language !== f.language) return false;
      if (f.level && c.level !== f.level && c.level !== "all-levels") return false;
      if (f.age && !c.ageGroups.includes(f.age as AgeGroup)) return false;
      if (f.mode && !c.modes.includes(f.mode as Mode)) return false;
      const price = f.mode ? c.prices[f.mode as Mode]?.price ?? Infinity : c.fromPrice;
      if (price > max) return false;
      if (f.duration && !durationOk(c.durationWeeks, f.duration)) return false;
      if (f.q) {
        const hay = `${c.title} ${c.subtitle} ${c.categoryName} ${c.instructorName} ${c.language ? langNames[c.language] : ""} ${c.cefr ?? ""}`;
        if (!matchesQuery(hay, f.q)) return false;
      }
      return true;
    });
    const priceOf = (c: CourseSummary) => (f.mode ? c.prices[f.mode as Mode]?.price ?? c.fromPrice : c.fromPrice);
    switch (f.sort) {
      case "newest": return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      case "price-asc": return list.sort((a, b) => priceOf(a) - priceOf(b));
      case "price-desc": return list.sort((a, b) => priceOf(b) - priceOf(a));
      default: return list.sort((a, b) => b.popularity - a.popularity);
    }
  }, [courses, f.category, f.language, f.level, f.age, f.mode, f.maxPrice, f.duration, f.q, f.sort, langNames]);

  const active = (
    [
      f.category && { k: "category", label: categories.find((c) => c.id === f.category)?.name },
      f.language && { k: "language", label: t(`languagesList.${f.language as LanguageKey}`) },
      f.level && { k: "level", label: t(`levels.${f.level as Level}`) },
      f.age && { k: "age", label: t(`ages.${f.age as AgeGroup}`) },
      f.mode && { k: "mode", label: t(`modes.${f.mode as Mode}`) },
      f.maxPrice && { k: "maxPrice", label: `≤ ${money(Number(f.maxPrice))}` },
      f.duration && { k: "duration", label: t(`catalog.duration${f.duration.charAt(0).toUpperCase()}${f.duration.slice(1)}` as "catalog.durationShort") },
      f.q && { k: "q", label: `“${f.q}”` },
    ].filter(Boolean) as { k: keyof Filters; label: string }[]
  );

  const resetAll = () => {
    pushedQ.current = "";
    setQ("");
    router.replace({ pathname, query: f.sort ? { sort: f.sort } : {} }, { scroll: false });
  };

  const filterPanel = (
    <div className="space-y-7">
      <FilterGroup title={t("catalog.category")}>
        <Radio name="category" label={t("catalog.all")} checked={!f.category} onChange={() => update({ category: "" })} />
        {categories.map((c) => (
          <Radio
            key={c.id}
            name="category"
            checked={f.category === c.id}
            onChange={() => update({ category: c.id })}
            label={
              <span className="flex items-center gap-2">
                <EgyptIcon name={c.icon} className="h-4 w-4 text-gold-600" />
                {c.name}
                <span className="text-xs text-copper-700/70">({c.count})</span>
              </span>
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t("catalog.language")}>
        <ChipRow>
          <Chip active={!f.language} onClick={() => update({ language: "" })}>{t("catalog.all")}</Chip>
          {LANGS.map((l) => <Chip key={l} active={f.language === l} onClick={() => update({ language: l, category: f.category && f.category !== "languages" ? "" : f.category })}>{t(`languagesList.${l}`)}</Chip>)}
        </ChipRow>
      </FilterGroup>

      <FilterGroup title={t("catalog.level")}>
        <ChipRow>
          <Chip active={!f.level} onClick={() => update({ level: "" })}>{t("catalog.all")}</Chip>
          {LEVELS.map((l) => <Chip key={l} active={f.level === l} onClick={() => update({ level: l })}>{t(`levels.${l}`)}</Chip>)}
        </ChipRow>
      </FilterGroup>

      <FilterGroup title={t("catalog.age")}>
        <ChipRow>
          <Chip active={!f.age} onClick={() => update({ age: "" })}>{t("catalog.all")}</Chip>
          {AGES.map((a) => (
            <Chip key={a} active={f.age === a} onClick={() => update({ age: a })}>
              {t(`ages.${a}`)} <span className="text-[10px] opacity-70">{t(`agesHint.${a}`)}</span>
            </Chip>
          ))}
        </ChipRow>
      </FilterGroup>

      <FilterGroup title={t("catalog.mode")}>
        <ChipRow>
          <Chip active={!f.mode} onClick={() => update({ mode: "" })}>{t("catalog.all")}</Chip>
          {MODES.map((m) => <Chip key={m} active={f.mode === m} onClick={() => update({ mode: m })}>{t(`modes.${m}`)}</Chip>)}
        </ChipRow>
      </FilterGroup>

      <FilterGroup title={t("catalog.maxPrice")}>
        <div className="flex items-center justify-between text-sm font-bold text-lapis-800">
          <span>{money(Number(f.maxPrice || priceCeil))}</span>
        </div>
        <input
          type="range"
          min={200}
          max={priceCeil}
          step={50}
          value={Number(f.maxPrice || priceCeil)}
          onChange={(e) => update({ maxPrice: Number(e.target.value) >= priceCeil ? "" : e.target.value })}
          className="mt-2 w-full accent-lapis-700"
          aria-label={t("catalog.maxPrice")}
        />
      </FilterGroup>

      <FilterGroup title={t("catalog.duration")}>
        <ChipRow>
          <Chip active={!f.duration} onClick={() => update({ duration: "" })}>{t("catalog.all")}</Chip>
          {DURATIONS.map((d) => (
            <Chip key={d} active={f.duration === d} onClick={() => update({ duration: d })}>
              {t(`catalog.duration${d.charAt(0).toUpperCase()}${d.slice(1)}` as "catalog.durationShort")}
            </Chip>
          ))}
        </ChipRow>
      </FilterGroup>
    </div>
  );

  return (
    <div className="container-x py-10">
      {/* Toolbar */}
      <div className="card mb-6 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-600" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("catalog.searchPlaceholder")}
            aria-label={t("catalog.searchPlaceholder")}
            className="field h-12 rounded-full ps-12"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline h-12 flex-1 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> {t("catalog.showFilters")}
            {active.length > 0 && <span className="rounded-full bg-gold-400 px-2 text-xs text-ink">{active.length}</span>}
          </button>
          <label className="sr-only" htmlFor="sort">{t("catalog.sort")}</label>
          <select
            id="sort"
            value={f.sort || "popular"}
            onChange={(e) => update({ sort: e.target.value === "popular" ? "" : e.target.value })}
            className="field h-12 flex-1 cursor-pointer rounded-full font-bold sm:w-56"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t(`catalog.${({ popular: "sortPopular", newest: "sortNewest", "price-asc": "sortPriceAsc", "price-desc": "sortPriceDesc" } as const)[s]}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block" aria-label={t("catalog.filters")}>
          <div className="card sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sans text-lg font-extrabold text-lapis-900">{t("catalog.filters")}</h2>
              {active.length > 0 && (
                <button type="button" onClick={resetAll} className="text-sm font-bold text-pharaoh-600 hover:underline">{t("catalog.reset")}</button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="me-2 font-bold text-lapis-900" aria-live="polite">{t("catalog.results", { count: results.length })}</p>
            {active.map((a) => (
              <button
                key={a.k}
                type="button"
                onClick={() => {
                  if (a.k === "q") { pushedQ.current = ""; setQ(""); }
                  update({ [a.k]: "" });
                }}
                className="chip chip-active text-xs"
              >
                {a.label} <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>

          {results.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c, i) => <CourseCard key={c.id} course={c} priority={i < 3} />)}
            </div>
          ) : (
            <div className="card flex flex-col items-center p-12 text-center">
              <SearchX className="h-14 w-14 text-gold-500" aria-hidden="true" />
              <h2 className="mt-4 font-sans text-xl font-extrabold text-lapis-900">{t("catalog.noResults")}</h2>
              <p className="mt-2 max-w-md text-copper-700">{t("catalog.noResultsHint")}</p>
              <button type="button" onClick={resetAll} className="btn btn-lapis mt-6">{t("catalog.reset")}</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label={t("catalog.filters")}>
          <div className="absolute inset-0 bg-lapis-950/60" onClick={() => setDrawer(false)} />
          <div className="animate-fade-up absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl bg-papyrus-50">
            <div className="flex items-center justify-between border-b border-papyrus-300 p-4">
              <h2 className="font-sans text-lg font-extrabold text-lapis-900">{t("catalog.filters")}</h2>
              <button type="button" onClick={() => setDrawer(false)} className="rounded-full p-2 hover:bg-papyrus-200" aria-label={t("common.close")}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-5">{filterPanel}</div>
            <div className="flex gap-2 border-t border-papyrus-300 p-4">
              <button type="button" onClick={resetAll} className="btn btn-outline flex-1">{t("catalog.reset")}</button>
              <button type="button" onClick={() => setDrawer(false)} className="btn btn-lapis flex-[2]">
                {t("catalog.showResults")} ({results.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-extrabold text-gold-700">{title}</legend>
      {children}
    </fieldset>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn("chip text-xs font-bold", active && "chip-active")}>
      {children}
    </button>
  );
}

function Radio({ name, label, checked, onChange }: { name: string; label: React.ReactNode; checked: boolean; onChange: () => void }) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm transition hover:bg-papyrus-100", checked && "bg-lapis-50 font-bold text-lapis-900")}>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="h-4 w-4 accent-lapis-700" />
      {label}
    </label>
  );
}
