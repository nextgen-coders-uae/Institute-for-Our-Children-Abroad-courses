"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BellRing } from "lucide-react";
import { postForm } from "@/lib/forms";
import { waLink } from "@/lib/whatsapp";

/** "Notify me when a new group opens" — shown when every group of the chosen mode is full. */
export function NotifyForm({ courseTitle, mode }: { courseTitle: string; mode: string }) {
  const t = useTranslations("course");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (status === "ok") {
    return <p className="rounded-2xl bg-nile-500/10 p-4 text-sm font-bold text-nile-700" role="status">{t("notifySent")}</p>;
  }

  return (
    <form
      className="space-y-3 rounded-2xl border-2 border-dashed border-gold-500/60 bg-gold-50 p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const ok = await postForm("notify", { course: courseTitle, mode, name, phone });
        setStatus(ok ? "ok" : "error");
      }}
    >
      <p className="flex items-center gap-2 font-extrabold text-lapis-900">
        <BellRing className="h-5 w-5 text-gold-600" aria-hidden="true" />
        {t("notifyTitle")}
      </p>
      <p className="text-sm text-copper-700">{t("notifyText")}</p>
      <div>
        <label htmlFor="notify-name" className="sr-only">{t("notifyName")}</label>
        <input id="notify-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("notifyName")} className="field" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="notify-phone" className="sr-only">{t("notifyPhone")}</label>
        <input
          id="notify-phone"
          required
          type="tel"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t("notifyPhone")}
          className="field text-start rtl:text-end"
          autoComplete="tel"
          pattern="[+0-9 ]{7,18}"
        />
      </div>
      <button type="submit" disabled={status === "loading"} className="btn btn-lapis w-full">{t("notifyButton")}</button>
      {status === "error" && (
        <p className="text-sm text-pharaoh-600" role="alert">
          {t("notifyError")}{" "}
          <a className="font-bold underline" target="_blank" rel="noopener" href={waLink(`${t("notifyTitle")}: ${courseTitle} (${mode}) — ${name} ${phone}`)}>WhatsApp</a>
        </p>
      )}
    </form>
  );
}
