"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Heart, Menu, Phone, Search, ShoppingBag, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/components/providers/StoreProvider";
import { SearchDialog } from "./SearchDialog";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import type { CurrencyCode, SearchItem, Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/whatsapp";

const NAV = [
  { href: "/courses", key: "courses" },
  { href: "/packages", key: "packages" },
  { href: "/placement-test", key: "placementTest" },
  { href: "/instructors", key: "instructors" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

const MOBILE_EXTRA = [
  { href: "/blog", key: "blog" },
  { href: "/faq", key: "faq" },
  { href: "/verify-certificate", key: "verify" },
  { href: "/wishlist", key: "wishlist" },
] as const;

const CURRENCIES: CurrencyCode[] = ["AED", "EGP"];

export function Header({
  searchIndex,
  categories,
  phone,
}: {
  searchIndex: SearchItem[];
  categories: Pick<Category, "id" | "name" | "icon">[];
  phone: { display: string; tel: string };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { cart, wishlist, hydrated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcut: "/" or Ctrl/Cmd+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => setMenuOpen(false), [pathname]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const cartCount = hydrated ? cart.length : 0;
  const wishCount = hydrated ? wishlist.length : 0;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled ? "border-gold-500/25 bg-papyrus-100/90 shadow-md backdrop-blur-lg" : "border-transparent bg-papyrus-100/70 backdrop-blur"
        )}
      >
        <div className="container-x flex h-[72px] items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="-ms-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-lapis-800 hover:bg-white xl:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label={t("header.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Logo />

          <nav className="ms-6 hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-bold transition-colors",
                  isActive(item.href) ? "text-lapis-800" : "text-copper-900 hover:text-lapis-700"
                )}
              >
                {t(`nav.${item.key}`)}
                {isActive(item.href) && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold-500" />}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-lapis-800 hover:bg-white"
              aria-label={t("common.search")}
            >
              <Search className="h-5 w-5" />
            </button>

            <CurrencySelect className="hidden sm:block" />
            <LanguageSwitcher compact />

            <Link
              href="/wishlist"
              className="relative hidden h-11 w-11 items-center justify-center rounded-full text-lapis-800 hover:bg-white sm:inline-flex"
              aria-label={t("header.wishlistLabel", { count: wishCount })}
            >
              <Heart className="h-5 w-5" />
              {wishCount > 0 && <CountBubble n={wishCount} />}
            </Link>

            <Link
              href="/cart"
              className="relative inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lapis-700 ps-3 pe-4 text-white transition hover:bg-lapis-800"
              aria-label={t("header.cartLabel", { count: cartCount })}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden text-sm font-bold md:inline">{t("nav.cart")}</span>
              {cartCount > 0 && <CountBubble n={cartCount} gold />}
            </Link>
          </div>
        </div>
      </header>

      {/* ───────── Mobile drawer ───────── */}
      <div className={cn("fixed inset-0 z-[60] xl:hidden", menuOpen ? "visible" : "invisible")} aria-hidden={!menuOpen}>
        <div
          className={cn("absolute inset-0 bg-lapis-950/60 backdrop-blur-sm transition-opacity", menuOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("common.menu")}
          className={cn(
            "bg-hieroglyphs absolute inset-y-0 start-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-papyrus-100 shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-gold-500/20 px-5 py-4">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white"
              aria-label={t("header.closeMenu")}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
            <MobileLink href="/" active={pathname === "/"}>{t("nav.home")}</MobileLink>
            {NAV.map((i) => (
              <MobileLink key={i.href} href={i.href} active={isActive(i.href)}>{t(`nav.${i.key}`)}</MobileLink>
            ))}
            <div className="my-2 h-px bg-gold-500/20" />
            <p className="px-3 pt-1 text-xs font-extrabold text-gold-700">{t("nav.allCategories")}</p>
            <div className="grid grid-cols-2 gap-2 p-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={{ pathname: "/courses", query: { category: c.id } }}
                  className="flex items-center gap-2 rounded-xl bg-white/70 p-2.5 text-xs font-bold text-lapis-900 hover:bg-white"
                >
                  <EgyptIcon name={c.icon} className="h-5 w-5 shrink-0 text-gold-600" />
                  <span className="line-clamp-2">{c.name}</span>
                </Link>
              ))}
            </div>
            <div className="my-2 h-px bg-gold-500/20" />
            {MOBILE_EXTRA.map((i) => (
              <MobileLink key={i.href} href={i.href} active={isActive(i.href)}>{t(`nav.${i.key}`)}</MobileLink>
            ))}
          </nav>
          <div className="mt-auto space-y-3 border-t border-gold-500/20 p-5">
            <div className="flex items-center gap-2">
              <LanguageSwitcher className="flex-1 justify-center" />
              <CurrencySelect className="flex-1" />
            </div>
            <a href={waLink(t("floating.waDefault"))} target="_blank" rel="noopener" className="btn btn-whatsapp w-full">
              {t("common.whatsappUs")}
            </a>
            <a href={`tel:${phone.tel}`} className="btn btn-outline w-full" dir="ltr">
              <Phone className="h-4 w-4" /> {phone.display}
            </a>
          </div>
        </div>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} index={searchIndex} locale={locale} />
    </>
  );
}

function CountBubble({ n, gold }: { n: number; gold?: boolean }) {
  return (
    <span
      className={cn(
        "absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-extrabold ring-2 ring-papyrus-100",
        gold ? "bg-gold-400 text-ink" : "bg-pharaoh-600 text-white"
      )}
    >
      {n}
    </span>
  );
}

function MobileLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn("rounded-xl px-3 py-2.5 font-bold", active ? "bg-lapis-700 text-white" : "text-lapis-900 hover:bg-white")}
    >
      {children}
    </Link>
  );
}

export function LanguageSwitcher({ className, compact }: { className?: string; compact?: boolean }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "ar" ? "en" : "ar";
  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      onClick={(e) => {
        // Keep the current query string (e.g. catalog filters) when switching language
        const q = window.location.search;
        if (q) {
          e.preventDefault();
          router.replace(`${pathname}${q}`, { locale: other });
        }
      }}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-papyrus-400 bg-white/70 px-2.5 text-sm font-bold text-lapis-800 hover:border-gold-500 sm:px-3",
        className
      )}
      aria-label={t("switchLangLabel")}
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      {compact ? (
        <>
          <span lang={other} className="hidden sm:inline">{t("switchLang")}</span>
          <span lang={other} className="sm:hidden">{other === "en" ? "EN" : "ع"}</span>
        </>
      ) : (
        <span lang={other}>{t("switchLang")}</span>
      )}
    </Link>
  );
}

export function CurrencySelect({ className }: { className?: string }) {
  const t = useTranslations("currency");
  const { currency, setCurrency } = useStore();
  return (
    <label className={cn("relative", className)}>
      <span className="sr-only">{t("label")}</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="h-10 w-full cursor-pointer appearance-none rounded-full border border-papyrus-400 bg-white/70 px-3 text-center text-sm font-bold text-lapis-800 hover:border-gold-500 focus:outline-none"
        title={t("approx")}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </label>
  );
}
