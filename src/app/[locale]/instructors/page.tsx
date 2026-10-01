import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { InstructorCard } from "@/components/cards/InstructorCard";
import { getCoursesByInstructor, getInstructors } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/instructors", title: t("instructorsTitle"), description: t("instructorsDescription") });
}

export default async function InstructorsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("instructors");
  const instructors = getInstructors(locale);

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} crumbs={[{ label: t("title") }]} />
      <div className="container-x grid gap-6 py-14 md:grid-cols-2 xl:grid-cols-3">
        {instructors.map((i) => (
          <InstructorCard key={i.id} instructor={i} courses={getCoursesByInstructor(i.id, locale)} detailed />
        ))}
      </div>
    </>
  );
}
