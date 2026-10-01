import { cn } from "@/lib/utils";

/**
 * Section title with a cartouche-style eyebrow (oval frame + closing bar),
 * the classic frame of royal names in hieroglyphs.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  light?: boolean;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-10", align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow && <Cartouche light={light}>{eyebrow}</Cartouche>}
      <Tag className={cn("mt-4 text-3xl leading-tight sm:text-4xl", light ? "text-white" : "text-lapis-800")}>{title}</Tag>
      {subtitle && <p className={cn("mt-3 text-base sm:text-lg", light ? "text-papyrus-200/85" : "text-copper-700")}>{subtitle}</p>}
    </div>
  );
}

export function Cartouche({ children, light, className }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border-2 px-4 py-1 text-xs font-extrabold tracking-wider uppercase",
        "after:absolute after:top-1/2 after:h-5 after:w-[3px] after:-translate-y-1/2 after:rounded-full after:content-[''] after:-end-2.5",
        light ? "border-gold-300/70 text-gold-200 after:bg-gold-300/70" : "border-gold-500 text-gold-700 after:bg-gold-500",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rotate-45", light ? "bg-gold-300" : "bg-gold-500")} aria-hidden="true" />
      {children}
    </span>
  );
}
