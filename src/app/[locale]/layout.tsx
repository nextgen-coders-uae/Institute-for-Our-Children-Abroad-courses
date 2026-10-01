import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cairo, Cinzel, Inter, Reem_Kufi } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Analytics } from "@/components/layout/Analytics";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCategories, getSearchIndex, getSite } from "@/lib/data";
import { SITE_URL, cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" });
const reemKufi = Reem_Kufi({ subsets: ["arabic", "latin"], variable: "--font-reem", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#1E3A8A",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("homeTitle"), template: t("titleTemplate") },
    description: t("homeDescription"),
    applicationName: t("siteName"),
    openGraph: {
      siteName: t("siteName"),
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("common");
  const site = getSite(locale);
  const categories = getCategories(locale);
  const fonts = locale === "ar" ? [cairo.variable, reemKufi.variable, inter.variable] : [inter.variable, cinzel.variable, cairo.variable];

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    alternateName: locale === "ar" ? "Abnauona Courses" : "كورسات أبناؤنا في الخارج",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/images/brand/logo-mark.svg`,
    email: site.contact.email,
    telephone: site.contact.phones.map((p) => p.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: locale === "ar" ? "شارع التلة" : "Al Tallah Street",
      addressLocality: locale === "ar" ? "عجمان" : "Ajman",
      addressCountry: "AE",
    },
    geo: { "@type": "GeoCoordinates", latitude: site.contact.geo.lat, longitude: site.contact.geo.lng },
    parentOrganization: { "@type": "EducationalOrganization", name: site.parent.name, url: site.parent.url },
    sameAs: Object.values(site.social),
  };

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={cn(...fonts)}>
      <body className="min-h-dvh">
        <NextIntlClientProvider>
          <StoreProvider>
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-3 focus:font-bold focus:text-ink">
              {t("skipToContent")}
            </a>
            {site.announcement.enabled && <AnnouncementBar text={site.announcement.text} href={site.announcement.href} />}
            <Header
              searchIndex={getSearchIndex(locale)}
              categories={categories.map(({ id, name, icon }) => ({ id, name, icon }))}
              phone={site.contact.phones[2] ?? site.contact.phones[0]}
            />
            <main id="main" className="min-h-[60vh]">
              {children}
            </main>
            <Footer site={site} categories={categories} />
            <FloatingActions phoneTel={site.contact.phones[2]?.tel ?? site.contact.phones[0].tel} />
          </StoreProvider>
        </NextIntlClientProvider>
        <JsonLd data={orgJsonLd} />
        <Analytics />
      </body>
    </html>
  );
}
