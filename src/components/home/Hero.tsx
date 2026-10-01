import { useTranslations } from "next-intl";
import { Award, BadgeCheck, CalendarClock, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LotusColumn, HorusMark } from "@/components/ui/Decor";
import { Cartouche } from "@/components/ui/SectionHeading";
import { HeroSearch } from "./HeroSearch";

export function Hero() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-lapis-900 via-lapis-800 to-royal-900 text-white">
      <div className="bg-hieroglyphs-light absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute -top-40 start-1/3 -z-10 h-[520px] w-[520px] rounded-full bg-gold-400/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -end-20 -z-10 h-[420px] w-[420px] rounded-full bg-pharaoh-500/20 blur-3xl" aria-hidden="true" />
      <LotusColumn className="absolute bottom-0 start-2 hidden h-[88%] text-gold-300/25 xl:block" />
      <LotusColumn className="absolute bottom-0 end-2 hidden h-[88%] text-gold-300/25 xl:block" />

      <div className="container-x grid items-center gap-12 pt-14 pb-28 lg:grid-cols-2 lg:pt-20 lg:pb-36">
        <div className="animate-fade-up">
          <Cartouche light>{t("heroEyebrow")}</Cartouche>
          <h1 className="mt-6 text-4xl leading-[1.25] font-bold sm:text-5xl lg:text-6xl">
            <span className="block">{t("heroTitle")}</span>
            <span className="text-gold-gradient block pb-2">{t("heroTitle2")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-papyrus-200/90">{t("heroSubtitle")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/courses" className="btn btn-gold btn-lg">{tc("browseCourses")}</Link>
            <Link href="/placement-test" className="btn btn-ghost-light btn-lg">
              <Award className="h-5 w-5" aria-hidden="true" />
              {tc("freePlacementTest")}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-papyrus-200">
            {[
              [BadgeCheck, t("trust1")],
              [Award, t("trust2")],
              [CalendarClock, t("trust3")],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof BadgeCheck;
              return (
                <li key={i} className="flex items-center gap-2">
                  <I className="h-5 w-5 text-gold-300" aria-hidden="true" />
                  {label as string}
                </li>
              );
            })}
          </ul>
        </div>

        <HeroArt />
      </div>
    </section>
  );
}

/** Quick-search card overlapping the bottom edge of the hero. */
export function HeroSearchBand() {
  return (
    <div className="container-x relative z-10 -mt-20">
      <HeroSearch />
    </div>
  );
}

/** Illustration: pyramid + sun disk + floating "hello" bubbles in four languages. */
function HeroArt() {
  const bubbles = [
    { text: "Hello!", cls: "top-[8%] start-[6%] bg-white text-lapis-800", delay: "0s" },
    { text: "Bonjour", cls: "top-[30%] end-[2%] bg-gold-300 text-ink", delay: "1.2s" },
    { text: "Hallo", cls: "bottom-[30%] start-0 bg-pharaoh-600 text-white", delay: "2.1s" },
    { text: "مرحباً", cls: "top-[2%] end-[24%] bg-nile-500 text-white", delay: "0.6s" },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
      {/* Sun disk with rays */}
      <div className="absolute start-1/2 top-[14%] h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-gold-200 to-gold-500 shadow-[0_0_80px_20px_rgba(227,181,74,0.35)] rtl:translate-x-1/2" />
      <HorusMark className="absolute start-1/2 top-[25%] w-20 -translate-x-1/2 text-lapis-900/70 rtl:translate-x-1/2" />
      {/* Pyramids */}
      <svg viewBox="0 0 400 240" className="absolute inset-x-0 bottom-[6%] w-full">
        <defs>
          <linearGradient id="pyrA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F0DA8E" />
            <stop offset="1" stopColor="#A8841A" />
          </linearGradient>
          <linearGradient id="pyrB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7A4A2E" />
            <stop offset="1" stopColor="#4A2C1B" />
          </linearGradient>
        </defs>
        <path d="M200 20 330 220H70z" fill="url(#pyrA)" />
        <path d="M200 20 330 220H230z" fill="url(#pyrB)" opacity=".55" />
        <path d="M95 110 170 220H20z" fill="url(#pyrA)" opacity=".85" />
        <path d="M95 110 170 220h-60z" fill="url(#pyrB)" opacity=".5" />
        <path d="M315 130 385 220H245z" fill="url(#pyrA)" opacity=".75" />
        <path d="M0 220h400v20H0z" fill="#C9A227" opacity=".35" />
        <g stroke="#FFF5D6" strokeOpacity=".35" strokeWidth="1.5">
          <path d="M140 110h120M122 140h156M103 170h194M85 198h230" />
        </g>
      </svg>

      {bubbles.map((b) => (
        <span
          key={b.text}
          dir="auto"
          className={`animate-float absolute rounded-2xl px-4 py-2 font-display text-lg font-bold shadow-xl ${b.cls}`}
          style={{ animationDelay: b.delay }}
        >
          {b.text}
        </span>
      ))}

      <div className="animate-float absolute end-[4%] bottom-[4%] flex items-center gap-3 rounded-2xl bg-white/95 p-3 pe-5 text-ink shadow-2xl" style={{ animationDelay: "1.6s" }}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-400">
          <Star className="h-6 w-6 fill-white text-white" />
        </span>
        <span className="leading-tight">
          <span className="block text-xl font-extrabold text-lapis-800">4.9 / 5</span>
          <span className="block text-xs text-copper-700">★★★★★</span>
        </span>
      </div>
    </div>
  );
}
