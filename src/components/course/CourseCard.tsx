import { useTranslations } from "next-intl";
import { CalendarDays, Clock3, GraduationCap, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CourseSummary } from "@/lib/types";
import { computeBadges, minSeatsLeft } from "@/lib/badges";
import { CourseCover } from "./CourseCover";
import { CourseBadges } from "./CourseBadges";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";
import { WishlistButton } from "@/components/ui/WishlistButton";

/** Catalog card: cover, badges, key facts, price and CTA. Works in server & client trees. */
export function CourseCard({ course, priority }: { course: CourseSummary; priority?: boolean }) {
  const t = useTranslations();
  const badges = computeBadges(course);
  const seats = minSeatsLeft(course);
  const href = `/courses/${course.slug}`;

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <CourseCover
            image={course.image}
            title={course.title}
            icon={course.icon}
            theme={course.theme}
            language={course.language}
            priority={priority}
            className="aspect-[16/10] transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <CourseBadges badges={badges} className="absolute start-3 top-3 max-w-[75%]" />
        <WishlistButton courseId={course.id} className="absolute end-3 top-3 z-10" />
        <div className="absolute bottom-3 start-3 flex flex-wrap gap-1.5">
          {course.modes.map((m) => (
            <span key={m} className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-lapis-900 backdrop-blur">
              {t(`modesShort.${m}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold text-gold-700">{course.categoryName}</p>
        <h3 className="mt-1.5 font-sans text-lg leading-snug font-extrabold text-lapis-900">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:underline">
            {course.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-copper-700">
          <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
          {course.instructorName}
        </p>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-copper-900">
          <li className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4 text-lapis-500" aria-hidden="true" />
            {t(`levels.${course.level}`)}
            {course.cefr ? <bdi className="text-copper-700/80">({course.cefr})</bdi> : null}
          </li>
          <li className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4 text-lapis-500" aria-hidden="true" />
            {t("common.weeks", { count: course.durationWeeks })}
          </li>
          <li className="flex items-center gap-1">
            <Clock3 className="h-4 w-4 text-lapis-500" aria-hidden="true" />
            {t("common.sessions", { count: course.sessionsCount })}
          </li>
        </ul>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <Stars rating={course.rating} label={t("course.ratingOf", { rating: course.rating })} />
          <span className="font-bold text-lapis-900">{course.rating.toFixed(1)}</span>
          <span className="text-copper-700/80">· {t("common.students", { count: course.studentsCount })}</span>
        </div>

        {seats !== undefined && seats <= 5 && (
          <p className="mt-2 text-xs font-bold text-pharaoh-600">{t("common.seatsLeft", { count: seats })}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-papyrus-400 pt-4">
          <div>
            <p className="text-[11px] text-copper-700">{t("common.from")}</p>
            <Price aed={course.fromPrice} old={course.fromOldPrice} className="text-lg" />
          </div>
          <span className="btn btn-lapis relative z-10 px-4 py-2 text-xs" aria-hidden="true">
            {t("common.viewDetails")}
          </span>
        </div>
      </div>
    </article>
  );
}
