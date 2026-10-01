import { NextResponse } from "next/server";

const TYPES = new Set(["newsletter", "contact", "notify"]);

/**
 * Receives contact / newsletter / "notify me" submissions.
 * If FORMS_WEBHOOK_URL is set (Google Apps Script, Make, Zapier, n8n…), the JSON is forwarded there;
 * otherwise it is logged on the server. Replace with an email service (e.g. Resend) or a CRM when ready.
 */
export async function POST(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!TYPES.has(type)) return NextResponse.json({ error: "unknown form" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "invalid body" }, { status: 400 });

  // Basic validation & size limits
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (typeof v === "string" || typeof v === "number") clean[k] = String(v).slice(0, 2000);
  }
  if (type === "newsletter" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email ?? "")) {
    return NextResponse.json({ error: "invalid email" }, { status: 422 });
  }
  if ((type === "notify" || type === "contact") && !clean.phone && !clean.email) {
    return NextResponse.json({ error: "missing contact" }, { status: 422 });
  }

  const payload = { type, ...clean, receivedAt: new Date().toISOString() };
  const webhook = process.env.FORMS_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (e) {
      console.error("[forms] webhook failed", e);
      return NextResponse.json({ error: "delivery failed" }, { status: 502 });
    }
  } else {
    console.info("[forms] submission (set FORMS_WEBHOOK_URL to deliver it):", payload);
  }
  return NextResponse.json({ ok: true });
}
