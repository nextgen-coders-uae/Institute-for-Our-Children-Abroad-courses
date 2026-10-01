import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { HorusMark } from "@/components/ui/Decor";
import { Cartouche } from "@/components/ui/SectionHeading";
import { Stats, CtaBand } from "@/components/home/Sections";
import { getSite } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/about", title: t("aboutTitle"), description: t("aboutDescription") });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const site = getSite(locale);
  const values = [
    { icon: "scarab" as const, text: t("value1") },
    { icon: "ankh" as const, text: t("value2") },
    { icon: "eye" as const, text: t("value3") },
    { icon: "lotus" as const, text: t("value4") },
  ];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} crumbs={[{ label: t("title") }]} />

      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <Cartouche>{site.parent.name}</Cartouche>
          <h2 className="mt-4 text-3xl text-lapis-800 sm:text-4xl">{t("relationTitle")}</h2>
          <p className="mt-4 text-lg leading-9 text-copper-900">{t("relationText")}</p>
          <a href={site.parent.url} target="_blank" rel="noopener" className="btn btn-lapis btn-lg mt-6">
            {t("visitMain")} <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        {/* Visual: the two brands linked */}
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-lapis-800 to-royal-900 p-10 text-center text-white shadow-2xl">
          <div className="bg-hieroglyphs-light absolute inset-0 -z-10" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-mark.svg" alt="" width={96} height={120} className="mx-auto h-32 w-auto" />
          <p className="mt-4 font-display text-3xl text-gold-300">{site.parent.name}</p>
          <HorusMark className="mx-auto my-5 w-20 text-gold-300/70" />
          <p className="font-display text-2xl">{site.name}</p>
        </div>
      </section>

      <section className="container-x grid gap-6 pb-16 md:grid-cols-2">
        {[
          { icon: "sun" as const, title: t("visionTitle"), text: t("visionText") },
          { icon: "papyrus" as const, title: t("missionTitle"), text: t("missionText") },
        ].map((b) => (
          <div key={b.title} className="card p-8">
            <EgyptIcon name={b.icon} className="h-10 w-10 text-gold-600" />
            <h2 className="mt-4 text-2xl text-lapis-800">{b.title}</h2>
            <p className="mt-3 leading-8 text-copper-900">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="container-x pb-16">
        <h2 className="mb-6 text-center text-3xl text-lapis-800">{t("valuesTitle")}</h2>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {values.map((v) => (
            <li key={v.text} className="card flex flex-col items-center gap-3 p-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lapis-700 text-gold-300">
                <EgyptIcon name={v.icon} className="h-7 w-7" />
              </span>
              <span className="font-bold text-lapis-900">{v.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <Stats stats={site.stats} />

      <section className="container-x py-16 text-center">
        <h2 className="text-3xl text-lapis-800">{t("accreditTitle")}</h2>
        <p className="mt-2 text-copper-700">{t("accreditText")}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex h-24 items-center justify-center rounded-2xl border-2 border-dashed border-papyrus-400 bg-white/60 font-bold text-copper-700/60">
              LOGO {n}
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
