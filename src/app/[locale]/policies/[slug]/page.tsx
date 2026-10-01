import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { getLegal, LEGAL_PAGES, type LegalPage } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return LEGAL_PAGES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!LEGAL_PAGES.includes(slug as LegalPage)) return {};
  const page = getLegal(slug as LegalPage, locale);
  return pageMetadata({ locale, path: `/policies/${slug}`, title: page.title, description: page.sections[0]?.p.slice(0, 150) ?? page.title });
}

export default async function PolicyPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!LEGAL_PAGES.includes(slug as LegalPage)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const page = getLegal(slug as LegalPage, locale);

  return (
    <>
      <PageHero title={page.title} crumbs={[{ label: page.title }]}>
        <p className="mt-3 text-sm text-papyrus-200/80">{t("lastUpdated", { date: formatDate(page.updated, locale) })}</p>
      </PageHero>
      <div className="container-x max-w-3xl py-12">
        <p className="mb-8 rounded-2xl border border-dashed border-gold-500 bg-gold-50 p-4 text-sm font-bold text-gold-800">{t("disclaimer")}</p>
        <div className="prose-egypt card p-6 sm:p-10">
          {page.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
