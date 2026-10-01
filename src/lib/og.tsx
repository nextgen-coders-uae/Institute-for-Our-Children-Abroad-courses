/**
 * Shared Open Graph image template (1200×630) rendered with next/og.
 * Note: the OG renderer (Satori) can't shape Arabic script, so share images use
 * the English course names; the Arabic title still appears in og:title text.
 */
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function ogImage({ eyebrow, title, subtitle, price }: { eyebrow: string; title: string; subtitle?: string; price?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #11214F 0%, #1E3A8A 45%, #3B2A7A 100%)",
          color: "white",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Sun disk + pyramid */}
        <div style={{ position: "absolute", right: 90, top: 150, width: 170, height: 170, borderRadius: 999, background: "linear-gradient(180deg,#F0DA8E,#C9A227)", display: "flex" }} />
        <svg width="520" height="300" viewBox="0 0 520 300" style={{ position: "absolute", right: 0, bottom: 0 }}>
          <path d="M300 40 500 300H100z" fill="#C9A227" />
          <path d="M300 40 500 300H340z" fill="#7A4A2E" opacity="0.6" />
          <path d="M120 150 230 300H10z" fill="#E3B54A" opacity="0.8" />
        </svg>
        {/* Frieze */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, background: "#C9A227", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", padding: "8px 22px", borderRadius: 999, border: "3px solid #E3B54A", color: "#F0DA8E", fontSize: 26, letterSpacing: 2 }}>
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div style={{ fontSize: 68, lineHeight: 1.1, fontWeight: 700, color: "#FFFFFF" }}>{title}</div>
          {subtitle && <div style={{ marginTop: 20, fontSize: 30, color: "#F5ECD7", opacity: 0.9 }}>{subtitle}</div>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#E3B54A" }}>Abnauona Courses</div>
          {price && (
            <div style={{ display: "flex", padding: "10px 24px", borderRadius: 999, background: "#E3B54A", color: "#211A12", fontSize: 30, fontWeight: 700 }}>
              {price}
            </div>
          )}
        </div>
      </div>
    ),
    ogSize
  );
}
