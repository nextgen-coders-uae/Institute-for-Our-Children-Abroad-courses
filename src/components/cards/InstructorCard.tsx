import Image from "next/image";
import { useTranslations } from "next-intl";
import { BadgeCheck, Languages } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CourseSummary, Instructor } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Instructor avatar: real photo if provided, otherwise initials inside a cartouche-shaped frame. */
export function InstructorAvatar({ instructor, size = "md" }: { instructor: Instructor; size?: "md" | "lg" }) {
  const dims = size === "lg" ? "h-28 w-24" : "h-20 w-16";
  const initials = instructor.name.replace(/^(أ\.|م\.|Ms\.|Mr\.|Eng\.|Mme\.|Herr)\s*/, "").trim().charAt(0);
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-t-full rounded-b-2xl border-2 border-gold-400 bg-gradient-to-b from-lapis-700 to-royal-900 shadow-md", dims)}>
      {instructor.photo ? (
        <Image src={instructor.photo} alt={instructor.name} fill sizes="96px" className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-gold-300" aria-hidden="true">
          {initials}
        </span>
      )}
    </span>
  );
}

export function InstructorCard({
  instructor,
  courses,
  detailed,
}: {
  instructor: Instructor;
  courses?: CourseSummary[];
  detailed?: boolean;
}) {
  const t = useTranslations("instructors");
  return (
    <article id={instructor.id} className="card flex h-full scroll-mt-28 flex-col p-6">
      <div className="flex items-start gap-4">
        <InstructorAvatar instructor={instructor} size={detailed ? "lg" : "md"} />
        <div className="min-w-0">
          <h3 className="font-sans text-lg font-extrabold text-lapis-900">{instructor.name}</h3>
          <p className="text-sm font-semibold text-gold-700">{instructor.title}</p>
          <p className="mt-1 text-xs font-bold text-copper-700">{t("experience", { years: instructor.yearsExperience })}</p>
        </div>
      </div>

      {detailed && <p className="mt-4 text-sm leading-7 text-copper-900">{instructor.bio}</p>}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {instructor.specialties.map((s) => (
          <span key={s} className="rounded-full bg-lapis-50 px-2.5 py-1 text-xs font-bold text-lapis-800">{s}</span>
        ))}
      </div>

      {detailed && (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <dt className="sr-only">{t("certifications")}</dt>
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
            <dd className="text-copper-900">{instructor.certifications.join(" • ")}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">{t("languages")}</dt>
            <Languages className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
            <dd className="text-copper-900">{instructor.languages.join(" • ")}</dd>
          </div>
        </dl>
      )}

      {courses && (
        <div className="mt-auto pt-5">
          <p className="mb-2 text-xs font-extrabold text-gold-700">{t("courses")}</p>
          {courses.length ? (
            <ul className="space-y-1.5">
              {courses.map((c) => (
                <li key={c.id}>
                  <Link href={`/courses/${c.slug}`} className="text-sm font-bold text-lapis-700 underline-offset-4 hover:underline">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-copper-700">{t("noCourses")}</p>
          )}
        </div>
      )}
    </article>
  );
}
