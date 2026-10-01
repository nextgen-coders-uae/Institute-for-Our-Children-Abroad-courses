import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { BundleCard, CopyCode } from "@/components/cards/BundleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { OfferBanner } from "@/components/home/Sections";
import { getPackages, getSite, tr } from "@/lib/data";
import { formatDate, formatMoney } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";
import coupons from "@/data/coupons.json";
import type { Coupon, Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/packages", title: t("packagesTitle"), description: t("packagesDescription") });
}

export default async function PackagesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("packages");
  const site = getSite(locale);
  const d = site.discounts;
  // Only coupons flagged `public` are listed; private codes stay server-side
  const publicCoupons = (coupons as Coupon[]).filter((c) => c.public);

  const programs = [
    { icon: "lotus" as const, title: t("siblingTitle"), text: t("siblingText", { second: d.siblingSecondPercent, third: d.siblingThirdPlusPercent }) },
    { icon: "djed" as const, title: t("studentTitle"), text: t("studentText", { percent: d.abnaonaStudentPercent }) },
    { icon: "sun" as const, title: t("earlyTitle"), text: t("earlyText", { percent: d.earlyBirdPercent }) },
  ];

  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} crumbs={[{ label: t("title") }]} />

      <section className="container-x py-16">
        <SectionHeading title={t("bundlesTitle")} />
        <div className="grid gap-6 md:grid-cols-2">
          {getPackages(locale).map((p) => <BundleCard key={p.id} pkg={p} />)}
        </div>
      </section>

      <OfferBanner offer={site.offer} />

      <section className="container-x py-16">
        <SectionHeading title={t("discountsTitle")} subtitle={t("maxNote", { percent: d.maxTotalDiscountPercent })} />
        <div className="grid gap-5 md:grid-cols-3">
          {programs.map((p) => (
            <div key={p.title} className="card p-6 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-gold-200 to-gold-400 text-lapis-900">
                <EgyptIcon name={p.icon} className="h-8 w-8" />
              </span>
              <h3 className="mt-4 font-sans text-lg font-extrabold text-lapis-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-copper-900">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-8">
        <SectionHeading title={t("couponsTitle")} subtitle={t("couponsText")} />
        <div className="grid gap-5 md:grid-cols-2">
          {publicCoupons.map((c) => (
            <div key={c.code} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-lapis-900">{tr(c.description, locale)}</p>
                <p className="mt-1 text-xs text-copper-700">
                  {c.expiresAt && t("validUntil", { date: formatDate(c.expiresAt, locale) })}
                  {c.minSubtotal ? ` · ${t("minOrder", { amount: formatMoney(c.minSubtotal, locale) })}` : ""}
                </p>
              </div>
              <CopyCode code={c.code} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
