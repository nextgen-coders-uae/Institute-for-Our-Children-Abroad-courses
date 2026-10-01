import Image from "next/image";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import type { CoverTheme, IconName, LanguageKey } from "@/lib/types";
import { cn } from "@/lib/utils";

const THEMES: Record<CoverTheme, string> = {
  lapis: "from-lapis-600 via-lapis-800 to-lapis-950",
  royal: "from-royal-500 via-royal-700 to-royal-900",
  copper: "from-copper-500 via-copper-700 to-copper-900",
  gold: "from-gold-600 via-copper-700 to-copper-900",
  pharaoh: "from-pharaoh-500 via-pharaoh-700 to-royal-900",
  nile: "from-nile-500 via-nile-700 to-lapis-900",
};

const WATERMARK: Record<LanguageKey, string> = {
  english: "Hello",
  french: "Bonjour",
  german: "Hallo",
  arabic: "مرحباً",
};

/**
 * Course cover. Uses the real image when `image` is set (put files in
 * /public/images/courses and reference them from courses.json);
 * otherwise renders a generated Pharaonic cover — no image download needed.
 */
export function CourseCover({
  image,
  title,
  icon,
  theme,
  language,
  className,
  priority,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  image?: string;
  title: string;
  icon: IconName;
  theme: CoverTheme;
  language?: LanguageKey;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={image} alt={title} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div className={cn("relative isolate overflow-hidden bg-gradient-to-br", THEMES[theme], className)} role="img" aria-label={title}>
      <div className="bg-hieroglyphs-light absolute inset-0 opacity-70" />
      <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-gold-300/20 blur-2xl" />
      {/* Sun disk */}
      <div className="absolute end-6 top-6 h-16 w-16 rounded-full border border-gold-300/40" />
      {language && (
        <span dir="auto" className="absolute bottom-2 start-4 font-display text-5xl font-bold text-white/10 select-none sm:text-6xl">
          {WATERMARK[language]}
        </span>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-gold-300 to-gold-500 text-lapis-950 shadow-glow ring-4 ring-white/15">
          <EgyptIcon name={icon} className="h-10 w-10" strokeWidth={1.8} />
        </span>
      </div>
      {/* Pyramid silhouette */}
      <svg className="absolute bottom-0 start-0 h-1/3 w-2/3 text-black/15" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 60 50 10l50 50zM70 60l45-40 45 40z" fill="currentColor" />
      </svg>
    </div>
  );
}
