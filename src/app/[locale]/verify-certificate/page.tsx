import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { VerifyForm } from "@/components/forms/VerifyForm";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/verify-certificate", title: t("verifyTitle"), description: t("verifyDescription") });
}

export default async function VerifyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("verify");
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} crumbs={[{ label: t("title") }]} />
      <div className="container-x py-14">
        <Suspense>
          <VerifyForm />
        </Suspense>
      </div>
    </>
  );
}
