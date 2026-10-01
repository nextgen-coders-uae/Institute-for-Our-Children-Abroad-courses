import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero, HeroSearchBand } from "@/components/home/Hero";
import { CategoryGrid, CourseGridSection, CtaBand, OfferBanner, Stats, Testimonials, WhyUs } from "@/components/home/Sections";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstructorCard } from "@/components/cards/InstructorCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { Link } from "@/i18n/navigation";
import {
  getBlogPosts,
  getCategories,
  getInstructors,
  getNewestCourses,
  getPopularCourses,
  getSite,
  getTestimonials,
} from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

// Re-generate hourly so "starting soon / seats left" badges stay fresh
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    ...pageMetadata({ locale, title: t("homeTitle"), description: t("homeDescription") }),
    title: { absolute: t("homeTitle") },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const site = getSite(locale);
  const popular = getPopularCourses(locale, 6);
  const popularIds = new Set(popular.map((c) => c.id));
  const newest = getNewestCourses(locale, 6).filter((c) => !popularIds.has(c.id)).slice(0, 3);
  const instructors = getInstructors(locale).filter((i) => i.featured).slice(0, 4);
  const posts = getBlogPosts(locale).slice(0, 3);

  return (
    <>
      <Hero />
      <HeroSearchBand />
      <CategoryGrid categories={getCategories(locale)} />
      <CourseGridSection title={t("popularTitle")} subtitle={t("popularSubtitle")} courses={popular} href="/courses?sort=popular" />
      <OfferBanner offer={site.offer} />
      <CourseGridSection title={t("newestTitle")} subtitle={t("newestSubtitle")} courses={newest} href="/courses?sort=newest" />
      <WhyUs />
      <Stats stats={site.stats} />
      <Testimonials items={getTestimonials(locale)} />

      <section className="container-x py-20">
        <SectionHeading eyebrow={t("instructorsEyebrow")} title={t("instructorsTitle")} subtitle={t("instructorsSubtitle")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((i) => (
            <InstructorCard key={i.id} instructor={i} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/instructors" className="btn btn-outline">{tc("viewAll")}</Link>
        </div>
      </section>

      <section className="bg-hieroglyphs bg-papyrus-100 py-20">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl text-lapis-800 sm:text-4xl">{t("blogTitle")}</h2>
            <Link href="/blog" className="btn btn-outline">{tc("viewAll")}</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
