import { NextResponse } from "next/server";
import coupons from "@/data/coupons.json";
import type { Coupon } from "@/lib/types";

/**
 * Validates a coupon code on the server so private codes never ship to the browser.
 * Expiry / minimum / category rules are evaluated by the pricing engine (lib/pricing.ts).
 */
export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };
  const normalized = String(code ?? "").trim().toUpperCase();
  const coupon = (coupons as Coupon[]).find((c) => c.code.toUpperCase() === normalized);
  if (!coupon) return NextResponse.json({ error: "invalid" }, { status: 404 });
  return NextResponse.json({ coupon });
}
