import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { WhatsAppGlyph } from "@/components/layout/FloatingActions";
import { getFaq } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/faq", title: t("faqTitle"), description: t("faqDescription") });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const groups = getFaq(locale);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <PageHero title={t("faq.title")} subtitle={t("faq.subtitle")} crumbs={[{ label: t("faq.title") }]} />
      <div className="container-x max-w-4xl space-y-10 py-14">
        {groups.map((g, gi) => (
          <section key={g.group}>
            <h2 className="mb-4 flex items-center gap-3 text-2xl text-lapis-800">
              <span className="h-6 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
              {g.group}
            </h2>
            <Accordion defaultOpen={gi === 0 ? 0 : -1} items={g.items.map((f) => ({ title: f.q, content: <p className="leading-7">{f.a}</p> }))} />
          </section>
        ))}
        <div className="card flex flex-col items-center gap-4 p-8 text-center">
          <p className="font-sans text-xl font-extrabold text-lapis-900">{t("faq.stillQuestions")}</p>
          <a href={waLink(t("floating.waDefault"))} target="_blank" rel="noopener" className="btn btn-whatsapp btn-lg">
            <WhatsAppGlyph className="h-5 w-5" /> {t("faq.ask")}
          </a>
        </div>
      </div>
      <JsonLd data={faqLd} />
    </>
  );
}
