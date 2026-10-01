import { useTranslations } from "next-intl";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { WhatsAppGlyph } from "./FloatingActions";
import type { Category } from "@/lib/types";
import type { Site } from "@/lib/data";
import { waLink } from "@/lib/whatsapp";

const SOCIAL_LABEL: Record<string, string> = { facebook: "Fb", instagram: "Ig", tiktok: "Tk", youtube: "Yt" };

export function Footer({ site, categories }: { site: Site; categories: Category[] }) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  const quick = [
    ["/courses", "nav.courses"],
    ["/packages", "nav.packages"],
    ["/placement-test", "nav.placementTest"],
    ["/instructors", "nav.instructors"],
    ["/blog", "nav.blog"],
    ["/about", "nav.about"],
    ["/faq", "nav.faq"],
    ["/verify-certificate", "nav.verify"],
    ["/contact", "nav.contact"],
  ] as const;

  return (
    <footer className="relative mt-24 bg-lapis-950 text-papyrus-200">
      <div className="frieze" aria-hidden="true" />
      <div className="bg-hieroglyphs-light">
        <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-7 text-papyrus-200/80">{t("footer.about")}</p>
            <a
              href={site.parent.url}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-500/40 px-4 py-2 text-sm font-bold text-gold-200 hover:bg-gold-500/10"
            >
              {t("footer.partOf")} {site.parent.name}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <div className="mt-6">
              <p className="mb-2 text-sm font-bold text-gold-300">{t("footer.follow")}</p>
              <div className="flex gap-2">
                {Object.entries(site.social).map(([name, url]) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xs font-extrabold text-papyrus-200 ring-1 ring-white/10 transition hover:bg-gold-500 hover:text-ink"
                  >
                    {SOCIAL_LABEL[name] ?? name.slice(0, 2)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label={t("footer.quickLinks")}>
            <h2 className="mb-4 text-lg text-gold-300">{t("footer.quickLinks")}</h2>
            <ul className="space-y-2 text-sm">
              {quick.map(([href, key]) => (
                <li key={href}>
                  <Link href={href} className="text-papyrus-200/80 hover:text-gold-300">{t(key)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label={t("footer.categories")}>
            <h2 className="mb-4 text-lg text-gold-300">{t("footer.categories")}</h2>
            <ul className="space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={{ pathname: "/courses", query: { category: c.id } }} className="flex items-center gap-2 text-papyrus-200/80 hover:text-gold-300">
                    <EgyptIcon name={c.icon} className="h-4 w-4 text-gold-500" /> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6 lg:col-span-3">
            <div>
              <h2 className="mb-4 text-lg text-gold-300">{t("footer.contact")}</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                  {site.contact.address}
                </li>
                {site.contact.phones.map((p) => (
                  <li key={p.tel}>
                    <a href={`tel:${p.tel}`} className="flex items-center gap-2 hover:text-gold-300">
                      <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" />
                      <span dir="ltr">{p.display}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={waLink(t("floating.waDefault"))} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-gold-300">
                    <WhatsAppGlyph className="h-4 w-4 text-[#3fcf7f]" />
                    <span dir="ltr">+{site.contact.whatsapp}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 hover:text-gold-300">
                    <Mail className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {site.contact.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-lg text-gold-300">{t("footer.newsletterTitle")}</h2>
              <p className="mb-3 text-sm text-papyrus-200/75">{t("footer.newsletterText")}</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-x flex flex-col items-center justify-between gap-3 py-5 pb-24 text-xs text-papyrus-200/70 sm:flex-row sm:pb-5">
            <p>© {year} {site.name} — {t("footer.rights")}</p>
            <ul className="flex flex-wrap justify-center gap-4">
              <li><Link href="/policies/privacy" className="hover:text-gold-300">{t("footer.privacy")}</Link></li>
              <li><Link href="/policies/terms" className="hover:text-gold-300">{t("footer.terms")}</Link></li>
              <li><Link href="/policies/refund" className="hover:text-gold-300">{t("footer.refund")}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
