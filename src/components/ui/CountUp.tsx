"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/types";

/** Animates from 0 to `value` when scrolled into view. The final value is rendered on the server for SEO/no-JS. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      setN(0);
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums" dir="ltr">
      {formatNumber(n, locale)}
      {suffix}
    </span>
  );
}
