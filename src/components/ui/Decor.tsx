/** Decorative Pharaonic elements (purely visual → aria-hidden). */
import { cn } from "@/lib/utils";

/** Lotus column: papyriform capital, fluted shaft, base. */
export function LotusColumn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 240" className={cn("pointer-events-none", className)} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M6 10h36M8 14h32" />
        <path d="M10 14c0 12 6 20 14 22 8-2 14-10 14-22" />
        <path d="M17 16c1 8 3 14 7 19M31 16c-1 8-3 14-7 19M24 16v19" />
        <path d="M14 40h20M15 44h18" />
        <path d="M16 44v176M32 44v176M21 44v176M27 44v176" opacity=".55" />
        <path d="M15 60h18M15 64h18M15 200h18M15 204h18" />
        <path d="M11 220h26v8H11zM7 228h34v6H7z" />
      </g>
    </svg>
  );
}

/** Eye of Horus mark used as ornament. */
export function HorusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={cn("pointer-events-none", className)} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18C14 7 24 5 32 5s18 2 28 11" />
        <path d="M9 18c7 6 14 8 22 8s15-2 21-8" />
        <circle cx="30" cy="16" r="6" />
        <path d="M6 5C16 0 28-1 42 2" />
        <path d="M24 26l-4 12M34 26c3 7 9 10 16 8 3-1 3-5 0-6" />
      </g>
    </svg>
  );
}

/** Small ornamental divider: line – ankh – line */
export function Ornament({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-gold-500", className)} aria-hidden="true">
      <span className="h-px w-8 bg-current opacity-60" />
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 11c-2.4-1.3-3.6-3.3-3.6-5.3A3.6 3.6 0 0 1 12 2a3.6 3.6 0 0 1 3.6 3.7c0 2-1.2 4-3.6 5.3zM5.5 12.5h13M12 11v11" />
      </svg>
      <span className="h-px w-8 bg-current opacity-60" />
    </span>
  );
}
