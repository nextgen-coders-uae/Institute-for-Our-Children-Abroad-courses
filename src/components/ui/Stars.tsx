import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ rating, size = 14, className, label }: { rating: number; size?: number; className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={label ?? `${rating}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          width={size}
          height={size}
          aria-hidden="true"
          className={i <= Math.round(rating) ? "fill-gold-400 text-gold-400" : "fill-papyrus-300 text-papyrus-300"}
        />
      ))}
    </span>
  );
}
