"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { WhatsAppGlyph } from "@/components/layout/FloatingActions";
import { postForm } from "@/lib/forms";
import { waLink } from "@/lib/whatsapp";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const waText = `${form.subject ? `${form.subject}\n` : ""}${form.message}\n— ${form.name} ${form.phone}`;

  if (status === "ok") {
    return <p className="rounded-2xl bg-nile-500/10 p-6 text-center font-bold text-nile-700" role="status">{t("sent")}</p>;
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const ok = await postForm("contact", form);
        setStatus(ok ? "ok" : "error");
      }}
    >
      <div>
        <label htmlFor="c-name" className="label">{t("name")}</label>
        <input id="c-name" required value={form.name} onChange={set("name")} className="field" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="c-phone" className="label">{t("phone")}</label>
        <input id="c-phone" required type="tel" dir="ltr" value={form.phone} onChange={set("phone")} className="field" autoComplete="tel" pattern="[+0-9 ]{7,18}" />
      </div>
      <div>
        <label htmlFor="c-email" className="label">{t("email")}</label>
        <input id="c-email" type="email" dir="ltr" value={form.email} onChange={set("email")} className="field" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="c-subject" className="label">{t("subject")}</label>
        <input id="c-subject" value={form.subject} onChange={set("subject")} className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="label">{t("message")}</label>
        <textarea id="c-message" required rows={5} value={form.message} onChange={set("message")} className="field" />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "loading"} className="btn btn-lapis btn-lg">
          <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {status === "loading" ? t("sending") : t("send")}
        </button>
        <a href={waLink(waText)} target="_blank" rel="noopener" className="btn btn-whatsapp btn-lg">
          <WhatsAppGlyph className="h-5 w-5" /> {t("orWhatsapp")}
        </a>
      </div>
      {status === "error" && <p className="text-sm font-bold text-pharaoh-600 sm:col-span-2" role="alert">{t("error")}</p>}
    </form>
  );
}
