import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppGlyph } from "@/components/layout/FloatingActions";
import { getSite } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";
import type { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/contact", title: t("contactTitle"), description: t("contactDescription") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const site = getSite(locale);
  const c = site.contact;

  const cards = [
    { Icon: MapPin, title: t("contact.address"), body: <p>{c.address}</p> },
    {
      Icon: Phone,
      title: t("contact.phones"),
      body: (
        <ul className="space-y-1">
          {c.phones.map((p) => (
            <li key={p.tel}><a href={`tel:${p.tel}`} className="font-bold text-lapis-700 hover:underline" dir="ltr">{p.display}</a></li>
          ))}
        </ul>
      ),
    },
    {
      Icon: WhatsAppGlyph,
      title: t("contact.whatsapp"),
      body: <a href={waLink(t("floating.waDefault"))} target="_blank" rel="noopener" className="font-bold text-nile-700 hover:underline" dir="ltr">+{c.whatsapp}</a>,
    },
    { Icon: Mail, title: t("contact.emailLabel"), body: <a href={`mailto:${c.email}`} className="font-bold text-lapis-700 hover:underline">{c.email}</a> },
    { Icon: Clock, title: t("contact.hours"), body: <p>{c.workingHours}</p> },
  ];

  return (
    <>
      <PageHero title={t("contact.title")} subtitle={t("contact.subtitle")} crumbs={[{ label: t("contact.title") }]} />
      <div className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_1.4fr]">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {cards.map(({ Icon, title, body }) => (
            <li key={title} className="card flex gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lapis-700 text-gold-300">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div className="text-copper-900">
                <p className="mb-1 text-sm font-extrabold text-gold-700">{title}</p>
                {body}
              </div>
            </li>
          ))}
        </ul>
        <div className="card p-6 sm:p-8">
          <h2 className="mb-6 text-2xl text-lapis-800">{t("contact.formTitle")}</h2>
          <ContactForm />
        </div>
      </div>
      <section className="container-x" aria-label={t("contact.mapTitle")}>
        <div className="overflow-hidden rounded-3xl border-4 border-papyrus-50 shadow-card">
          <iframe
            title={t("contact.mapTitle")}
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&hl=${locale}&z=15&output=embed`}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
