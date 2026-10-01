import { NextResponse } from "next/server";
import certificates from "@/data/certificates.json";
import { getCourseById, tr } from "@/lib/data";
import type { Locale } from "@/lib/types";

/** GET /api/certificates?id=ABC-2026-0001&locale=ar — verifies a certificate number. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = (url.searchParams.get("id") ?? "").trim().toUpperCase();
  const locale = (url.searchParams.get("locale") === "en" ? "en" : "ar") as Locale;
  const cert = certificates.find((c) => c.id.toUpperCase() === id);
  if (!cert) return NextResponse.json({ valid: false }, { status: 404 });
  return NextResponse.json({
    valid: true,
    id: cert.id,
    traineeName: tr(cert.traineeName, locale),
    course: getCourseById(cert.courseId, locale)?.title ?? cert.courseId,
    issuedAt: cert.issuedAt,
    grade: tr(cert.grade, locale),
    hours: cert.hours,
  });
}
