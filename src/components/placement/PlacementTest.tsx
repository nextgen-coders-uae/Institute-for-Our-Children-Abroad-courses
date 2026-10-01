"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Clock, ListChecks, RotateCcw, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { CourseCard } from "@/components/course/CourseCard";
import { WhatsAppGlyph } from "@/components/layout/FloatingActions";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { waLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import type { AgeGroup, CourseSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type CEFR = "A1" | "A2" | "B1" | "B2" | "C1";

export interface PlacementData {
  questions: { id: number; level: string; q: string; options: string[]; answer: number }[];
  bands: { min: number; max: number; level: string }[];
  recommend: Record<string, Record<AgeGroup, string[]>>;
}

const LEVEL_POS: Record<CEFR, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
const DONT_KNOW = -1;

export function PlacementTest({ data, courses }: { data: PlacementData; courses: CourseSummary[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState<"intro" | "test" | "result">("intro");
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeGroup>("adults");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);

  const total = data.questions.length;
  const q = data.questions[index];
  const score = data.questions.reduce((s, qq, i) => s + (answers[i] === qq.answer ? 1 : 0), 0);
  const level = (data.bands.find((b) => score >= b.min && score <= b.max)?.level ?? "A1") as CEFR;
  const recSlugs = data.recommend[level]?.[age] ?? [];
  const recommended = recSlugs.map((s) => courses.find((c) => c.slug === s)).filter(Boolean) as CourseSummary[];

  const Prev = locale === "ar" ? ArrowRight : ArrowLeft;
  const Next = locale === "ar" ? ArrowLeft : ArrowRight;

  const choose = (opt: number) => {
    const next = [...answers];
    next[index] = opt;
    setAnswers(next);
  };

  const finish = () => {
    setStep("result");
    trackEvent("CompleteRegistration", { content_name: "placement-test", level });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === "intro") {
    return (
      <div className="card mx-auto max-w-2xl p-6 sm:p-10">
        <div className="flex flex-wrap justify-center gap-3 text-sm font-bold text-lapis-800">
          <span className="chip"><ListChecks className="h-4 w-4 text-gold-600" /> 20</span>
          <span className="chip"><Clock className="h-4 w-4 text-gold-600" /> ~10 min</span>
          <span className="chip">A1 → C1</span>
        </div>
        <h2 className="mt-6 text-center font-sans text-2xl font-extrabold text-lapis-900">{t("placement.introTitle")}</h2>
        <p className="mt-2 text-center leading-7 text-copper-900">{t("placement.introText")}</p>
        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("test");
          }}
        >
          <div>
            <label htmlFor="pt-name" className="label">{t("placement.nameLabel")}</label>
            <input id="pt-name" value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" />
          </div>
          <fieldset>
            <legend className="label">{t("placement.ageQuestion")}</legend>
            <div className="grid grid-cols-3 gap-2">
              {(["kids", "teens", "adults"] as AgeGroup[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={age === a}
                  onClick={() => setAge(a)}
                  className={cn("rounded-2xl border-2 p-3 text-center transition", age === a ? "border-lapis-700 bg-lapis-50" : "border-papyrus-300 bg-white hover:border-gold-500")}
                >
                  <span className="block font-bold text-lapis-900">{t(`ages.${a}`)}</span>
                  <span className="block text-xs text-copper-700">{t(`agesHint.${a}`)}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="btn btn-gold btn-lg w-full">{t("placement.start")}</button>
        </form>
      </div>
    );
  }

  if (step === "test") {
    const answered = answers[index] !== undefined;
    return (
      <div className="card mx-auto max-w-2xl p-6 sm:p-10">
        <div className="flex items-center justify-between text-sm font-bold text-copper-700">
          <span>{t("placement.question", { current: index + 1, total })}</span>
          <span className="rounded-full bg-lapis-50 px-2.5 py-0.5 text-xs text-lapis-800" dir="ltr">{q.level}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-papyrus-300" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index + 1}>
          <div className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-300 rtl:bg-gradient-to-l" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>

        <fieldset className="mt-8" key={q.id}>
          <legend className="animate-fade-up text-xl leading-relaxed font-bold text-lapis-900 sm:text-2xl" dir="ltr" lang="en">
            {q.q}
          </legend>
          <div className="mt-6 grid gap-3" dir="ltr" lang="en">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 font-semibold transition",
                  answers[index] === i ? "border-lapis-700 bg-lapis-50 text-lapis-900" : "border-papyrus-300 bg-white hover:border-gold-500"
                )}
              >
                <input type="radio" name={`q-${q.id}`} checked={answers[index] === i} onChange={() => choose(i)} className="h-4 w-4 accent-lapis-700" />
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-papyrus-200 text-sm font-extrabold text-copper-900">{String.fromCharCode(65 + i)}</span>
                {opt}
              </label>
            ))}
          </div>
          <label className={cn("mt-3 flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-3 text-sm transition", answers[index] === DONT_KNOW ? "border-lapis-700 bg-lapis-50" : "border-papyrus-300 hover:border-gold-500")}>
            <input type="radio" name={`q-${q.id}`} checked={answers[index] === DONT_KNOW} onChange={() => choose(DONT_KNOW)} className="h-4 w-4 accent-lapis-700" />
            {t("placement.dontKnow")}
          </label>
        </fieldset>

        <div className="mt-8 flex justify-between gap-3">
          <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="btn btn-outline">
            <Prev className="h-4 w-4" /> {t("placement.prev")}
          </button>
          {index < total - 1 ? (
            <button type="button" onClick={() => setIndex((i) => i + 1)} disabled={!answered} className="btn btn-lapis">
              {t("placement.next")} <Next className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={finish} disabled={!answered} className="btn btn-gold">
              {t("placement.finish")}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Result
  const waText = t("placement.waMessage", {
    name: name || "—",
    age: t(`ages.${age}`),
    score,
    total,
    level,
    course: recommended.map((c) => c.title).join(" / ") || "—",
  });

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-lapis-800 via-royal-700 to-royal-900 p-8 text-center text-white sm:p-12">
          <div className="bg-hieroglyphs-light absolute inset-0" aria-hidden="true" />
          <p className="relative text-sm font-bold text-gold-200">{t("placement.resultTitle")}{name ? ` — ${name}` : ""}</p>
          <div className="relative mx-auto mt-4 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-b from-gold-200 to-gold-500 text-lapis-950 shadow-glow">
            <span className="text-xs font-bold">{t("placement.yourLevel")}</span>
            <span className="font-display text-4xl font-bold" dir="ltr">{level}</span>
          </div>
          <p className="relative mt-4 text-lg font-bold">{t("placement.score", { score, total })}</p>
          {/* Level ladder */}
          <div className="relative mx-auto mt-6 flex max-w-md items-end justify-center gap-2" dir="ltr" aria-hidden="true">
            {(Object.keys(LEVEL_POS) as CEFR[]).map((l) => (
              <div key={l} className="flex flex-col items-center gap-1">
                <div
                  className={cn("w-10 rounded-t-lg transition-all", LEVEL_POS[l] <= LEVEL_POS[level] ? "bg-gold-300" : "bg-white/15")}
                  style={{ height: `${20 + LEVEL_POS[l] * 14}px` }}
                />
                <span className={cn("text-xs font-bold", l === level ? "text-gold-200" : "text-white/60")}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5 p-6 text-center sm:p-8">
          <p className="mx-auto max-w-2xl text-lg leading-8 text-copper-900">{t(`placement.levelDesc.${level}`)}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waLink(waText)} target="_blank" rel="noopener" className="btn btn-whatsapp btn-lg">
              <WhatsAppGlyph className="h-5 w-5" /> {t("placement.sendWhatsapp")}
            </a>
            <button
              type="button"
              onClick={() => {
                setAnswers([]);
                setIndex(0);
                setStep("intro");
              }}
              className="btn btn-outline btn-lg"
            >
              <RotateCcw className="h-4 w-4" /> {t("placement.retake")}
            </button>
          </div>
          <p className="text-xs text-copper-700">{t("placement.disclaimer")}</p>
        </div>
      </div>

      {recommended.length > 0 && (
        <section>
          <h2 className="mb-6 flex items-center gap-2 text-2xl text-lapis-800 sm:text-3xl">
            <Sparkles className="h-6 w-6 text-gold-500" aria-hidden="true" /> {t("placement.recommended")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>
      )}
      <EgyptIcon name="eye" className="mx-auto h-10 w-10 text-gold-500/60" />
    </div>
  );
}
