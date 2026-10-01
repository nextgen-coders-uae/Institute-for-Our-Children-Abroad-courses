import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { CartView } from "@/components/cart/CartView";
import { getCourses, getPackages, getSite } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/cart", title: t("cartTitle"), description: t("homeDescription"), noIndex: true });
}

export default async function CartPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");
  return (
    <>
      <PageHero title={t("title")} crumbs={[{ label: t("title") }]} />
      <CartView catalog={{ courses: getCourses(locale), packages: getPackages(locale) }} rules={getSite(locale).discounts} />
    </>
  );
}
