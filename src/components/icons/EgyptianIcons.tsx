/**
 * Egyptian-inspired line icons (24×24, stroke = currentColor).
 * Each course category maps to one symbol:
 *   papyrus → languages · pyramid → coding · obelisk → computer skills
 *   eye (Horus) → design · lotus → arts · harp → music
 *   palette (scribe's palette) → academic · ankh → personal skills
 */
import type { SVGProps } from "react";
import type { IconName } from "@/lib/types";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const Papyrus = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4h11a2 2 0 0 1 2 2v1h-3" />
    <path d="M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
    <path d="M7 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2" />
    <path d="M12 9h4M12 12h4M12 15h2.5" />
  </svg>
);

export const Ankh = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 11c-2.4-1.3-3.6-3.3-3.6-5.3A3.6 3.6 0 0 1 12 2a3.6 3.6 0 0 1 3.6 3.7c0 2-1.2 4-3.6 5.3z" />
    <path d="M5.5 12.5h13M12 11v11" />
  </svg>
);

export const Pyramid = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4 2.5 20h19z" />
    <path d="M12 4l3.2 16" />
    <path d="M7.4 12.3h6.2M5 16.2h10" />
    <circle cx="19" cy="5" r="1.8" />
  </svg>
);

export const EyeOfHorus = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 11.5C6 7.5 9.5 6.8 12 6.8s6 .8 9.5 4" />
    <path d="M4.5 11.5c2.5 2.3 5 3 7.5 3s4.8-.8 7-3" />
    <circle cx="11.5" cy="10.6" r="2.2" />
    <path d="M3.5 6.3C7 4.3 11 3.6 16 4.6" />
    <path d="M9.8 14.4 8.5 20" />
    <path d="M13 14.5c.8 2.3 2.6 3.8 5.3 3.4 1.2-.2 1.6-1.4.8-2.1" />
  </svg>
);

export const Lotus = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5c2 2.4 2.2 7 0 10.5-2.2-3.5-2-8.1 0-10.5z" />
    <path d="M12 14c-3.3 0-6.3-2.3-7.3-6.3 3.2.1 5.7 1.8 7.3 4.3" />
    <path d="M12 14c3.3 0 6.3-2.3 7.3-6.3-3.2.1-5.7 1.8-7.3 4.3" />
    <path d="M4.5 17.5h15M8 21h8M12 14v3.5" />
  </svg>
);

export const Harp = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3v18h12.5" />
    <path d="M6 3c6.5 1.2 10.8 6.5 12.5 18" />
    <path d="M9 7v14M12 9.5V21M15 13.5V21" />
  </svg>
);

export const Obelisk = (p: P) => (
  <svg {...base(p)}>
    <path d="M10 5.5 12 3l2 2.5V19h-4z" />
    <path d="M7.5 19h9v2.5h-9z" />
    <path d="M12 8v.5M12 11v.5M12 14v.5" />
  </svg>
);

export const ScribePalette = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="2.5" width="8" height="19" rx="1.5" />
    <circle cx="7.5" cy="6.2" r="1.3" />
    <circle cx="7.5" cy="10" r="1.3" />
    <path d="M7.5 13.3v5" />
    <path d="m15 21 5.5-17.5" />
    <path d="m14.2 17.2 2 .8" />
  </svg>
);

export const Scarab = (p: P) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="13.5" rx="4.5" ry="6" />
    <path d="M12 7.5v12M9 5.5a3 3 0 0 1 6 0" />
    <path d="M7.6 11 4 9M7.6 15 3.5 16.5M16.4 11 20 9M16.4 15l4.1 1.5" />
  </svg>
);

export const Djed = (p: P) => (
  <svg {...base(p)}>
    <path d="M9.5 21V6a2.5 2.5 0 0 1 5 0v15" />
    <path d="M7 8.5h10M7 11.5h10M7 14.5h10M7.5 21h9" />
  </svg>
);

export const SunDisk = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="11" r="4" />
    <path d="M2.5 11c2.5-1.8 3.7-1.8 5.5 0M16 11c1.8-1.8 3-1.8 5.5 0" />
    <path d="M12 3v1.5M12 17.5V21M6 5l1 1M18 5l-1 1" />
  </svg>
);

const MAP: Record<IconName, (p: P) => React.ReactElement> = {
  papyrus: Papyrus,
  ankh: Ankh,
  pyramid: Pyramid,
  eye: EyeOfHorus,
  lotus: Lotus,
  harp: Harp,
  obelisk: Obelisk,
  palette: ScribePalette,
  scarab: Scarab,
  djed: Djed,
  sun: SunDisk,
};

export function EgyptIcon({ name, ...props }: { name: IconName } & P) {
  const Cmp = MAP[name] ?? Papyrus;
  return <Cmp {...props} />;
}
