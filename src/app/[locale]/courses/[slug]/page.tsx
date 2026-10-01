import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarDays, CheckCircle2, Clock3, GraduationCap, Layers, MonitorPlay, Target, UserRound, Users, ListChecks } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { CourseCover } from "@/components/course/CourseCover";
import { CourseBadges } from "@/components/course/CourseBadges";
import { CourseCard } from "@/components/course/CourseCard";
import { BookingBox, MobileBookingBar } from "@/components/course/BookingBox";
import { VideoCover } from "@/components/course/VideoCover";
import { CertificatePreview } from "@/components/course/CertificatePreview";
import { InstructorAvatar } from "@/components/cards/InstructorCard";
import { Accordion } from "@/components/ui/Accordion";
import { Stars } from "@/components/ui/Stars";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCourse, getCourseSlugs, getInstructor, getSimilarCourses, getSite } from "@/lib/data";
import { computeBadges, upcomingGroups } from "@/lib/badges";
import { formatDate, formatNumber } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export function generateStaticParams() {
  return getCourseSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = getCourse(slug, locale);
  if (!course) return {};
  return pageMetadata({
    locale,
    path: `/courses/${slug}`,
    title: course.title,
    description: `${course.subtitle} — ${course.description.slice(0, 110)}…`,
  });
}

export default async function CoursePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const course = getCourse(slug, locale);
  if (!course) notFound();

  const t = await getTranslations();
  const site = getSite(locale);
  const instructor = getInstructor(course.instructorId, locale);
  const similar = getSimilarCourses(course, locale, 3);
  const badges = computeBadges(course);
  const groups = upcomingGroups(course.groups);
  const url = absoluteUrl(locale, `/courses/${slug}`);
  const lessonsCount = course.curriculum.reduce((s, m) => s + m.lessons.length, 0);

  const facts = [
    { Icon: GraduationCap, label: t("common.level"), value: `${t(`levels.${course.level}`)}${course.cefr ? ` · ${course.cefr}` : ""}` },
    { Icon: CalendarDays, label: t("common.duration"), value: t("common.weeks", { count: course.durationWeeks }) },
    { Icon: Layers, label: t("course.sessionsLabel"), value: t("common.sessions", { count: course.sessionsCount }) },
    { Icon: Clock3, label: t("course.sessionLength"), value: t("common.minutes", { count: course.sessionMinutes }) },
    { Icon: MonitorPlay, label: t("common.mode"), value: course.modes.map((m) => t(`modesShort.${m}`)).join(" · ") },
    { Icon: Users, label: t("common.ageGroup"), value: course.ageGroups.map((a) => t(`ages.${a}`)).join(" · ") },
  ];

  /* ─── Structured data: Course (+ offers, instances, rating) and FAQPage ─── */
  const courseLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url,
    inLanguage: course.language === "english" ? "en" : course.language === "french" ? "fr" : course.language === "german" ? "de" : "ar",
    educationalLevel: t(`levels.${course.level}`),
    provider: { "@type": "EducationalOrganization", name: site.name, sameAs: site.parent.url },
    aggregateRating: { "@type": "AggregateRating", ratingValue: course.rating, bestRating: 5, ratingCount: Math.max(course.reviewsCount, 1) },
    offers: course.modes.map((m) => ({
      "@type": "Offer",
      category: "Paid",
      price: course.prices[m]!.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      url,
    })),
    hasCourseInstance: (groups.length ? groups : [null]).map((g) =>
      g
        ? {
            "@type": "CourseInstance",
            courseMode: g.mode === "online" ? "Online" : "Onsite",
            startDate: g.startDate,
            location: g.mode === "in-person" ? site.contact.address : undefined,
            courseSchedule: { "@type": "Schedule", repeatFrequency: "P1W", duration: `PT${course.sessionMinutes}M` },
            instructor: instructor ? { "@type": "Person", name: instructor.name } : undefined,
          }
        : { "@type": "CourseInstance", courseMode: "Online", courseWorkload: `PT${Math.round((course.sessionsCount * course.sessionMinutes) / 60)}H` }
    ),
  };
  const faqLd = course.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: course.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;

  const cover = (
    <CourseCover
      image={course.image}
      title={course.title}
      icon={course.icon}
      theme={course.theme}
      language={course.language}
      priority
      sizes="(max-width: 1024px) 100vw, 60vw"
      className="aspect-video rounded-3xl"
    />
  );

  return (
    <>
      {/* ───── Header ───── */}
      <section className="bg-hieroglyphs border-b border-gold-500/20 bg-papyrus-100">
        <div className="container-x py-8">
          <div className="flex justify-start [&_ol]:justify-start">
            <Breadcrumbs
              dark
              crumbs={[
                { label: t("nav.home"), href: "/" },
                { label: t("nav.courses"), href: "/courses" },
                { label: course.categoryName, href: `/courses?category=${course.categoryId}` },
                { label: course.title },
              ]}
            />
          </div>
          <div className="mt-5 max-w-3xl">
            <CourseBadges badges={badges} />
            <h1 className="mt-3 text-3xl leading-tight font-bold text-lapis-800 sm:text-4xl lg:text-5xl">{course.title}</h1>
            <p className="mt-3 text-lg text-copper-700">{course.subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Stars rating={course.rating} label={t("course.ratingOf", { rating: course.rating })} />
                <b className="text-lapis-900">{course.rating.toFixed(1)}</b>
                <span className="text-copper-700">{t("common.reviewsCount", { count: course.reviewsCount })}</span>
              </span>
              <span className="flex items-center gap-1.5 text-copper-900">
                <Users className="h-4 w-4 text-gold-600" aria-hidden="true" />
                {t("common.students", { count: formatNumber(course.studentsCount, locale) })}
              </span>
              {instructor && (
                <a href="#instructor" className="flex items-center gap-1.5 font-bold text-lapis-700 hover:underline">
                  <UserRound className="h-4 w-4 text-gold-600" aria-hidden="true" />
                  {instructor.name}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_380px]">
        {/* ───── Main column ───── */}
        <div className="min-w-0 space-y-12">
          {course.youtubeId ? (
            <VideoCover youtubeId={course.youtubeId} title={course.title} label={t("course.playVideo")}>{cover}</VideoCover>
          ) : (
            cover
          )}

          {/* Key facts */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="card flex items-start gap-3 p-4">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-copper-700">{label}</dt>
                  <dd className="text-sm font-extrabold text-lapis-900">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <Block title={t("course.overview")}>
            <p className="leading-8 text-copper-900">{course.description}</p>
          </Block>

          <Block title={t("course.whatYouLearn")}>
            <ul className="grid gap-3 rounded-3xl border border-gold-500/30 bg-gold-50 p-6 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5 text-copper-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-nile-500" aria-hidden="true" />
                  {o}
                </li>
              ))}
            </ul>
          </Block>

          <Block title={t("course.curriculum")} aside={t("course.curriculumMeta", { modules: course.curriculum.length, lessons: lessonsCount })}>
            <Accordion
              defaultOpen={0}
              items={course.curriculum.map((m) => ({
                title: m.title,
                meta: t("common.sessions", { count: m.lessons.length }),
                content: (
                  <ol className="space-y-2">
                    {m.lessons.map((l, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lapis-50 text-xs font-bold text-lapis-700">{i + 1}</span>
                        {l}
                      </li>
                    ))}
                  </ol>
                ),
              }))}
            />
          </Block>

          <div className="grid gap-6 sm:grid-cols-2">
            <Block title={t("course.audience")} small>
              <IconList items={course.audience} Icon={Target} />
            </Block>
            <Block title={t("course.requirements")} small>
              <IconList items={course.requirements} Icon={ListChecks} />
            </Block>
          </div>

          {/* Groups & schedule */}
          <Block title={t("course.schedule")}>
            {groups.length ? (
              <div className="overflow-x-auto rounded-2xl border border-papyrus-300 bg-white">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-lapis-800 text-start text-papyrus-100">
                    <tr>
                      <th className="px-4 py-3 text-start font-bold">{t("common.mode")}</th>
                      <th className="px-4 py-3 text-start font-bold">{t("course.days")}</th>
                      <th className="px-4 py-3 text-start font-bold">{t("course.time")}</th>
                      <th className="px-4 py-3 text-start font-bold">{t("course.startDate")}</th>
                      <th className="px-4 py-3 text-start font-bold">{t("course.seats")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-papyrus-300">
                    {groups.map((g) => (
                      <tr key={g.id} className={cn(g.seatsLeft <= 0 && "opacity-60")}>
                        <td className="px-4 py-3 font-bold text-lapis-900">{t(`modesShort.${g.mode}`)}</td>
                        <td className="px-4 py-3">{g.days}</td>
                        <td className="px-4 py-3" dir="ltr">{g.time}</td>
                        <td className="px-4 py-3">{formatDate(g.startDate, locale)}</td>
                        <td className="px-4 py-3">
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", g.seatsLeft <= 0 ? "bg-ink/80 text-white" : g.seatsLeft <= 3 ? "bg-pharaoh-100 text-pharaoh-700" : "bg-nile-500/10 text-nile-700")}>
                            {t("common.seatsLeft", { count: Math.max(0, g.seatsLeft) })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-copper-700">{course.modes.includes("recorded") ? t("course.recordedOnly") : t("course.noGroups")}</p>
            )}
          </Block>

          {instructor && (
            <Block title={t("course.instructorTitle")} id="instructor">
              <div className="card flex flex-col gap-5 p-6 sm:flex-row">
                <InstructorAvatar instructor={instructor} size="lg" />
                <div>
                  <h3 className="font-sans text-xl font-extrabold text-lapis-900">{instructor.name}</h3>
                  <p className="text-sm font-semibold text-gold-700">{instructor.title}</p>
                  <p className="mt-3 leading-7 text-copper-900">{instructor.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {instructor.certifications.map((c) => (
                      <span key={c} className="rounded-full bg-lapis-50 px-2.5 py-1 text-xs font-bold text-lapis-800">{c}</span>
                    ))}
                  </div>
                  <Link href={`/instructors#${instructor.id}`} className="mt-4 inline-block text-sm font-bold text-lapis-700 hover:underline">
                    {t("course.moreFromInstructor")}
                  </Link>
                </div>
              </div>
            </Block>
          )}

          <Block title={t("course.certificateTitle")}>
            {course.certificate ? (
              <div className="grid items-center gap-6 md:grid-cols-2">
                <CertificatePreview course={course.title} locale={locale} />
                <p className="leading-8 text-copper-900">
                  {t("course.certificateText")}{" "}
                  <Link href="/verify-certificate" className="font-bold text-lapis-700 hover:underline">{t("nav.verify")}</Link>
                </p>
              </div>
            ) : (
              <p className="text-copper-900">{t("course.noCertificate")}</p>
            )}
          </Block>

          <Block title={t("course.reviews")}>
            <div className="grid gap-4 sm:grid-cols-2">
              {course.reviews.map((r, i) => (
                <figure key={i} className="card p-5">
                  <Stars rating={r.rating} />
                  <blockquote className="mt-2 leading-7 text-copper-900">“{r.text}”</blockquote>
                  <figcaption className="mt-3 text-sm">
                    <b className="text-lapis-900">{r.name}</b>
                    <span className="text-copper-700"> · {formatDate(r.date, locale, { month: "long", year: "numeric" })}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Block>

          {course.faq.length > 0 && (
            <Block title={t("course.faq")}>
              <Accordion items={course.faq.map((f) => ({ title: f.q, content: <p className="leading-7">{f.a}</p> }))} />
            </Block>
          )}
        </div>

        {/* ───── Sticky booking box ───── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingBox course={course} rules={site.discounts} url={url} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="container-x pb-10">
          <h2 className="mb-6 text-3xl text-lapis-800">{t("course.similar")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>
      )}

      <MobileBookingBar fromPrice={course.fromPrice} oldPrice={course.fromOldPrice} />
      <JsonLd data={courseLd} />
      {faqLd && <JsonLd data={faqLd} />}
    </>
  );
}

function Block({ title, children, aside, small, id }: { title: string; children: React.ReactNode; aside?: string; small?: boolean; id?: string }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={cn("flex items-center gap-3 text-lapis-800", small ? "text-xl" : "text-2xl sm:text-3xl")}>
          <span className="h-6 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
          {title}
        </h2>
        {aside && <span className="text-sm text-copper-700">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

function IconList({ items, Icon }: { items: string[]; Icon: typeof Target }) {
  return (
    <ul className="card space-y-3 p-5">
      {items.map((i) => (
        <li key={i} className="flex gap-2.5 text-copper-900">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
          {i}
        </li>
      ))}
    </ul>
  );
}
