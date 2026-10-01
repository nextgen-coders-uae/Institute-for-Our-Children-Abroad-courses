import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { BlogCard } from "@/components/cards/BlogCard";
import { getBlogPosts } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/blog", title: t("blogTitle"), description: t("blogDescription") });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} crumbs={[{ label: t("title") }]} />
      <div className="container-x grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        {getBlogPosts(locale).map((p) => <BlogCard key={p.slug} post={p} />)}
      </div>
    </>
  );
}
