import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Accessible, JS-free accordion built on native <details>/<summary>. */
export function Accordion({
  items,
  defaultOpen = -1,
  className,
}: {
  items: { title: React.ReactNode; meta?: React.ReactNode; content: React.ReactNode }[];
  defaultOpen?: number;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-papyrus-300 overflow-hidden rounded-2xl border border-papyrus-300 bg-white", className)}>
      {items.map((it, i) => (
        <details key={i} className="group" open={i === defaultOpen}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition hover:bg-papyrus-100 [&::-webkit-details-marker]:hidden">
            <span className="font-bold text-lapis-900">{it.title}</span>
            <span className="flex shrink-0 items-center gap-3">
              {it.meta && <span className="text-xs text-copper-700">{it.meta}</span>}
              <ChevronDown className="h-5 w-5 text-gold-600 transition group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>
          <div className="px-5 pb-5 text-copper-900">{it.content}</div>
        </details>
      ))}
    </div>
  );
}
