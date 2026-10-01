import { useTranslations } from "next-intl";
import { Flame, Hourglass, Sparkles, Users, Lock } from "lucide-react";
import type { Badge } from "@/lib/types";
import { cn } from "@/lib/utils";

const STYLE: Record<Badge, { cls: string; Icon: typeof Flame }> = {
  new: { cls: "bg-nile-500 text-white", Icon: Sparkles },
  bestseller: { cls: "bg-gold-400 text-ink", Icon: Flame },
  limited: { cls: "bg-pharaoh-600 text-white", Icon: Users },
  "starting-soon": { cls: "bg-royal-700 text-white", Icon: Hourglass },
  full: { cls: "bg-ink/80 text-white", Icon: Lock },
};

export function CourseBadges({ badges, className }: { badges: Badge[]; className?: string }) {
  const t = useTranslations("badges");
  if (!badges.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((b) => {
        const { cls, Icon } = STYLE[b];
        return (
          <span key={b} className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold shadow-sm", cls)}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {t(b)}
          </span>
        );
      })}
    </div>
  );
}
