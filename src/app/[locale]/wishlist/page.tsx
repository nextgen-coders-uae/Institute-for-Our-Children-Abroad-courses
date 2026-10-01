import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { WishlistView } from "@/components/course/WishlistView";
import { getCourses } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/wishlist", title: t("wishlistTitle"), description: t("homeDescription"), noIndex: true });
}

export default async function WishlistPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("wishlist");
  return (
    <>
      <PageHero title={t("title")} crumbs={[{ label: t("title") }]} />
      <WishlistView courses={getCourses(locale)} />
    </>
  );
}
