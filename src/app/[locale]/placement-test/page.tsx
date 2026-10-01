import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { PlacementTest, type PlacementData } from "@/components/placement/PlacementTest";
import { getCourses } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import placement from "@/data/placement-test.json";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/placement-test", title: t("placementTitle"), description: t("placementDescription") });
}

export default async function PlacementPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("placement");
  const data = placement as unknown as PlacementData;
  // Only ship the courses that can be recommended
  const slugs = new Set(Object.values(data.recommend).flatMap((byAge) => Object.values(byAge).flat()));
  const courses = getCourses(locale).filter((c) => slugs.has(c.slug));

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} crumbs={[{ label: t("title") }]} />
      <div className="container-x py-12">
        <PlacementTest data={data} courses={courses} />
      </div>
    </>
  );
}
