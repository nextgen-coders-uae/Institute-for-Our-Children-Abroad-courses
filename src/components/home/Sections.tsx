import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Quote, Tag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { SectionHeading, Cartouche } from "@/components/ui/SectionHeading";
import { CourseCard } from "@/components/course/CourseCard";
import { Countdown } from "@/components/ui/Countdown";
import { CountUp } from "@/components/ui/CountUp";
import { Stars } from "@/components/ui/Stars";
import { HorusMark, LotusColumn } from "@/components/ui/Decor";
import type { Category, CourseSummary, IconName } from "@/lib/types";
import type { Site } from "@/lib/data";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/whatsapp";

/* ───────────────────────── Categories ───────────────────────── */

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const t = useTranslations("home");
  const [main, ...rest] = [...categories].sort((a, b) => Number(b.featured) - Number(a.featured));
  return (
    <section className="container-x pt-24">
      <SectionHeading eyebrow={t("categoriesEyebrow")} title={t("categoriesTitle")} subtitle={t("categoriesSubtitle")} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Featured: Languages */}
        <Link
          href={{ pathname: "/courses", query: { category: main.id } }}
          className="group relative isolate col-span-2 flex min-h-64 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br from-lapis-700 via-lapis-800 to-royal-900 p-6 text-white shadow-card lg:row-span-2"
        >
          <div className="bg-hieroglyphs-light absolute inset-0 -z-10" />
          <EgyptIcon name={main.icon} className="absolute end-6 top-6 h-16 w-16 opacity-80 sm:opacity-100 text-gold-300/80 transition duration-500 group-hover:rotate-6 sm:h-32 sm:w-32" strokeWidth={1.2} />
          <span className="mb-3 w-fit rounded-full bg-gold-400 px-3 py-1 text-xs font-extrabold text-ink">{t("mainCategory")}</span>
          <h3 className="text-3xl font-bold text-white sm:text-4xl">{main.name}</h3>
          <p className="mt-2 max-w-md text-papyrus-200/90">{main.description}</p>
          <p className="mt-4 flex items-center gap-2 font-bold text-gold-200">
            {t("coursesCount", { count: main.count })}
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden="true" />
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
            {["English", "Français", "Deutsch", "العربية"].map((l) => (
              <span key={l} className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20" dir="auto">{l}</span>
            ))}
          </div>
        </Link>

        {rest.map((c) => (
          <Link
            key={c.id}
            href={{ pathname: "/courses", query: { category: c.id } }}
            className="group card flex flex-col items-start gap-3 p-4 transition hover:-translate-y-1 hover:border-gold-500/60 hover:shadow-xl sm:flex-row sm:gap-4 sm:p-5"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-200 sm:h-14 sm:w-14 to-gold-400 text-lapis-900 transition group-hover:from-lapis-700 group-hover:to-royal-700 group-hover:text-gold-300">
              <EgyptIcon name={c.icon} className="h-7 w-7" />
            </span>
            <span className="min-w-0">
              <span className="block font-extrabold leading-snug text-lapis-900">{c.name}</span>
              <span className="mt-1 block text-xs leading-5 text-copper-700 line-clamp-2">{c.description}</span>
              <span className="mt-2 block text-xs font-bold text-gold-700">{t("coursesCount", { count: c.count })}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Course grid ───────────────────────── */

export function CourseGridSection({
  title,
  subtitle,
  courses,
  href,
  tinted,
}: {
  title: string;
  subtitle?: string;
  courses: CourseSummary[];
  href?: string;
  tinted?: boolean;
}) {
  const t = useTranslations("common");
  return (
    <section className={cn("py-20", tinted && "bg-hieroglyphs bg-papyrus-100")}>
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl text-lapis-800 sm:text-4xl">{title}</h2>
            {subtitle && <p className="mt-2 text-copper-700">{subtitle}</p>}
          </div>
          {href && (
            <Link href={href} className="btn btn-outline">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          )}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Offer banner ───────────────────────── */

export function OfferBanner({ offer }: { offer: Site["offer"] }) {
  const t = useTranslations("home");
  return (
    <section className="container-x py-6" aria-labelledby="offer-title">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-pharaoh-700 via-pharaoh-600 to-royal-700 p-8 text-white shadow-2xl sm:p-12">
        <div className="bg-hieroglyphs-light absolute inset-0 -z-10 opacity-80" />
        <LotusColumn className="absolute -bottom-4 end-6 hidden h-72 text-gold-200/30 md:block" />
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Cartouche light>{t("offersEyebrow")}</Cartouche>
            <h2 id="offer-title" className="mt-4 text-3xl font-bold sm:text-4xl">{offer.title}</h2>
            <p className="mt-3 max-w-xl text-lg text-white/90">{offer.text}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-gold-300 px-4 py-2 font-bold">
                <Tag className="h-4 w-4 text-gold-300" aria-hidden="true" />
                {t("useCode")} <span className="font-mono text-gold-200" dir="ltr">{offer.coupon}</span>
              </span>
              <Link href="/packages" className="btn btn-gold">{t("offersCta")}</Link>
            </div>
          </div>
          <div>
            <p className="mb-3 font-bold text-gold-200">{t("endsIn")}</p>
            <Countdown endsAt={offer.endsAt} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Why us ───────────────────────── */

export function WhyUs() {
  const t = useTranslations("home");
  const items: { icon: IconName; k: 1 | 2 | 3 | 4 | 5 | 6 }[] = [
    { icon: "djed", k: 1 },
    { icon: "ankh", k: 2 },
    { icon: "scarab", k: 3 },
    { icon: "sun", k: 4 },
    { icon: "lotus", k: 5 },
    { icon: "eye", k: 6 },
  ];
  return (
    <section className="container-x py-20" aria-labelledby="why-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-center">
        <div>
          <Cartouche>{t("whyEyebrow")}</Cartouche>
          <h2 id="why-title" className="mt-4 text-3xl leading-tight text-lapis-800 sm:text-4xl">{t("whyTitle")}</h2>
          <HorusMark className="mt-8 hidden w-40 text-gold-500/60 lg:block" />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map(({ icon, k }) => (
            <li key={k} className="card flex gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lapis-700 text-gold-300">
                <EgyptIcon name={icon} className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-extrabold text-lapis-900">{t(`why${k}Title`)}</span>
                <span className="mt-1 block text-sm leading-6 text-copper-700">{t(`why${k}Text`)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Stats ───────────────────────── */

export function Stats({ stats }: { stats: Site["stats"] }) {
  const t = useTranslations("home");
  return (
    <section className="relative isolate overflow-hidden bg-lapis-900 py-16 text-white" aria-labelledby="stats-title">
      <div className="bg-hieroglyphs-light absolute inset-0 -z-10" />
      <div className="container-x">
        <h2 id="stats-title" className="sr-only">{t("statsTitle")}</h2>
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-papyrus-200/85">{s.label}</dt>
              <dd className="text-gold-gradient font-display text-4xl font-bold sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */

export function Testimonials({
  items,
}: {
  items: { name: string; role: string; rating: number; text: string; courseTitle: string }[];
}) {
  const t = useTranslations("home");
  return (
    <section className="bg-hieroglyphs bg-papyrus-100 py-20" aria-labelledby="testi-title">
      <div className="container-x">
        <SectionHeading eyebrow={t("testimonialsEyebrow")} title={t("testimonialsTitle")} />
        <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scrollbar-none px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
          {items.map((it) => (
            <li key={it.name} className="card relative w-[85%] shrink-0 snap-center p-6 sm:w-[48%] lg:w-auto">
              <Quote className="absolute end-5 top-5 h-10 w-10 text-gold-300/60 rtl:-scale-x-100" aria-hidden="true" />
              <Stars rating={it.rating} />
              <blockquote className="mt-3 leading-7 text-copper-900">“{it.text}”</blockquote>
              <div className="mt-5 flex items-center gap-3 border-t border-dashed border-papyrus-400 pt-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-lapis-700 to-royal-700 font-display text-lg font-bold text-gold-300">
                  {it.name.trim().charAt(0)}
                </span>
                <span>
                  <span className="block font-extrabold text-lapis-900">{it.name}</span>
                  <span className="block text-xs text-copper-700">{it.role} · {it.courseTitle}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA band ───────────────────────── */

export function CtaBand() {
  const t = useTranslations("home");
  const tf = useTranslations("floating");
  return (
    <section className="container-x pt-20" aria-labelledby="cta-title">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 p-8 text-center shadow-glow sm:p-14">
        <div className="bg-hieroglyphs absolute inset-0 -z-10 opacity-80" />
        <EgyptIcon name="ankh" className="mx-auto h-12 w-12 text-lapis-900" />
        <h2 id="cta-title" className="mt-4 text-3xl font-bold text-lapis-950 sm:text-4xl">{t("ctaTitle")}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-lapis-950/85">{t("ctaText")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/courses" className="btn btn-lapis btn-lg">{t("ctaButton")}</Link>
          <a href={waLink(tf("waDefault"))} target="_blank" rel="noopener" className="btn btn-lg border-2 border-lapis-900/30 bg-white/40 text-lapis-950 hover:bg-white/70">
            {t("ctaSecondary")}
            <ArrowLeft className="h-5 w-5 ltr:-scale-x-100" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
