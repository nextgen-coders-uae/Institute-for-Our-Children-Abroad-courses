import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Brand logo: the Abnaona mashrabiya arch + wordmark + "Courses" tag.
 * Replace /public/images/brand/logo-mark.svg with the official logo file.
 */
export function Logo({ variant = "dark", className }: { variant?: "dark" | "light"; className?: string }) {
  const locale = useLocale();
  const light = variant === "light";
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label={locale === "ar" ? "كورسات أبناؤنا – الرئيسية" : "Abnauona Courses – Home"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/brand/logo-mark.svg" alt="" width={34} height={42} className="h-10 w-auto shrink-0 transition-transform group-hover:-translate-y-0.5 sm:h-11" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-bold", locale === "ar" ? "text-2xl" : "text-lg sm:text-2xl", light ? "text-gold-300" : "text-lapis-800")}>
          {locale === "ar" ? "أبناؤنا" : "Abnauona"}
        </span>
        <span
          className={cn(
            "mt-1 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide",
            light ? "bg-gold-500/20 text-gold-200" : "bg-gold-500 text-ink"
          )}
        >
          {locale === "ar" ? "كورسات · Courses" : "Courses · كورسات"}
        </span>
      </span>
    </Link>
  );
}
