import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LotusColumn } from "@/components/ui/Decor";
import { Cartouche } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE_URL } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/** Inner-page banner: dark lapis with hieroglyph texture, lotus columns, breadcrumbs (+ BreadcrumbList schema). */
export function PageHero({
  title,
  subtitle,
  eyebrow,
  crumbs = [],
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  const t = useTranslations("nav");
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-lapis-900 via-lapis-800 to-royal-900 text-white">
      <div className="bg-hieroglyphs-light absolute inset-0 -z-10" aria-hidden="true" />
      <div className="absolute -top-24 end-1/4 -z-10 h-72 w-72 rounded-full bg-gold-400/15 blur-3xl" aria-hidden="true" />
      <LotusColumn className="absolute -bottom-2 start-3 hidden h-48 text-gold-300/25 md:block" />
      <LotusColumn className="absolute -bottom-2 end-3 hidden h-48 text-gold-300/25 md:block" />
      <div className="container-x py-12 text-center sm:py-16">
        <Breadcrumbs crumbs={[{ label: t("home"), href: "/" }, ...crumbs]} />
        {eyebrow && <div className="mt-5"><Cartouche light>{eyebrow}</Cartouche></div>}
        <h1 className="mx-auto mt-4 max-w-3xl text-3xl leading-tight font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-papyrus-200/90">{subtitle}</p>}
        {children}
      </div>
      <div className="frieze" aria-hidden="true" />
    </section>
  );
}

export function Breadcrumbs({ crumbs, dark }: { crumbs: Crumb[]; dark?: boolean }) {
  const t = useTranslations("course");
  const locale = useLocale();
  const Sep = locale === "ar" ? ChevronLeft : ChevronRight;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}/${locale}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };
  return (
    <nav aria-label={t("breadcrumb")}>
      <ol className={`flex flex-wrap items-center justify-center gap-1 text-sm ${dark ? "text-copper-700" : "text-papyrus-200/80"}`}>
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <Sep className="h-4 w-4 opacity-60" aria-hidden="true" />}
            {c.href && i < crumbs.length - 1 ? (
              <Link href={c.href} className={dark ? "hover:text-lapis-700" : "hover:text-gold-300"}>{c.label}</Link>
            ) : (
              <span aria-current="page" className={dark ? "font-bold text-lapis-900" : "font-bold text-gold-200"}>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={jsonLd} />
    </nav>
  );
}
