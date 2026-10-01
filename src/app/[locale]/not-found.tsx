import { useTranslations } from "next-intl";
import { Home, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HorusMark, LotusColumn } from "@/components/ui/Decor";

/** Pharaonic 404: "4 △ 4" with a pyramid as the zero, sun disk and desert dunes. */
export default function NotFound() {
  const t = useTranslations();
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-lapis-900 via-royal-900 to-copper-700 text-white">
      <div className="bg-hieroglyphs-light absolute inset-0 -z-10" aria-hidden="true" />
      <LotusColumn className="absolute bottom-0 start-4 hidden h-3/4 text-gold-300/25 md:block" />
      <LotusColumn className="absolute bottom-0 end-4 hidden h-3/4 text-gold-300/25 md:block" />
      <div className="container-x flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
        <div className="relative flex items-end justify-center gap-2 font-display text-[7rem] leading-none font-bold text-gold-300 sm:text-[10rem]" dir="ltr" aria-hidden="true">
          <span>4</span>
          <svg viewBox="0 0 120 110" className="mb-3 h-[6.5rem] w-auto sm:h-[9rem]">
            <circle cx="60" cy="28" r="16" fill="#E3B54A" opacity=".9" />
            <path d="M60 30 115 108H5z" fill="#C9A227" />
            <path d="M60 30 115 108H72z" fill="#7A4A2E" opacity=".6" />
            <path d="M33 70h54M20 90h80" stroke="#FFF5D6" strokeOpacity=".4" strokeWidth="2" />
          </svg>
          <span>4</span>
        </div>
        <HorusMark className="mt-4 w-24 text-gold-300/80" />
        <h1 className="mt-6 max-w-2xl text-3xl font-bold sm:text-4xl">{t("notFound.title")}</h1>
        <p className="mt-4 max-w-xl text-lg text-papyrus-200/90">{t("notFound.text")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gold btn-lg"><Home className="h-5 w-5" aria-hidden="true" /> {t("common.backHome")}</Link>
          <Link href="/courses" className="btn btn-ghost-light btn-lg"><Search className="h-5 w-5" aria-hidden="true" /> {t("common.browseCourses")}</Link>
        </div>
      </div>
      {/* Dunes */}
      <svg className="absolute inset-x-0 bottom-0 -z-10 h-28 w-full text-papyrus-200" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 80c240-60 480-60 720-10s480 50 720-20v70H0z" fill="currentColor" opacity=".35" />
        <path d="M0 100c300-40 600-30 900 0s420 10 540-10v30H0z" fill="currentColor" />
      </svg>
    </section>
  );
}
