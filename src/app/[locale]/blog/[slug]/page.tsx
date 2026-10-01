import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { BlogCard } from "@/components/cards/BlogCard";
import { InstructorAvatar } from "@/components/cards/InstructorCard";
import { JsonLd } from "@/components/ui/JsonLd";
import { getBlogPost, getBlogPosts, getSite } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return getBlogPosts("ar").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug, locale);
  if (!post) return {};
  return pageMetadata({ locale, path: `/blog/${slug}`, title: post.title, description: post.excerpt, type: "article" });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPost(slug, locale);
  if (!post) notFound();
  const t = await getTranslations();
  const site = getSite(locale);
  const more = getBlogPosts(locale).filter((p) => p.slug !== slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: locale,
    mainEntityOfPage: absoluteUrl(locale, `/blog/${slug}`),
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    publisher: { "@type": "EducationalOrganization", name: site.name },
  };

  return (
    <>
      <PageHero title={post.title} eyebrow={post.category} crumbs={[{ label: t("blog.title"), href: "/blog" }, { label: post.title }]}>
        <p className="mt-4 text-sm text-papyrus-200/80">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time> · {t("blog.minRead", { minutes: post.readMinutes })}
        </p>
      </PageHero>

      <article className="container-x max-w-3xl py-12">
        {post.author && (
          <div className="card mb-8 flex items-center gap-4 p-4">
            <InstructorAvatar instructor={post.author} />
            <div>
              <p className="text-xs text-copper-700">{t("blog.by")}</p>
              <p className="font-extrabold text-lapis-900">{post.author.name}</p>
              <p className="text-sm text-gold-700">{post.author.title}</p>
            </div>
          </div>
        )}
        <div className="prose-egypt text-lg">
          {post.content.map((b, i) =>
            b.type === "h2" ? <h2 key={i}>{b.text}</h2> : b.type === "ul" ? (
              <ul key={i}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
            ) : (
              <p key={i}>{b.text}</p>
            )
          )}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-gold-300 to-gold-500 p-8 text-center">
          <h2 className="text-2xl font-bold text-lapis-950">{t("blog.ctaTitle")}</h2>
          <p className="mt-2 text-lapis-950/80">{t("blog.ctaText")}</p>
          <Link href="/placement-test" className="btn btn-lapis btn-lg mt-5">{t("common.freePlacementTest")}</Link>
        </div>
      </article>

      <section className="container-x pb-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl text-lapis-800">{t("blog.back")}</h2>
          <Link href="/blog" className="btn btn-outline">{t("common.viewAll")}</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {more.map((p) => <BlogCard key={p.slug} post={p} />)}
        </div>
      </section>
      <JsonLd data={articleLd} />
    </>
  );
}
