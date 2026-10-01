"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { postForm } from "@/lib/forms";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email") as string;
        setStatus("loading");
        const ok = await postForm("newsletter", { email });
        setStatus(ok ? "ok" : "error");
      }}
      className="space-y-2"
    >
      <div className="flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/20 focus-within:ring-gold-300">
        <label htmlFor="nl-email" className="sr-only">{t("emailPlaceholder")}</label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          placeholder={t("emailPlaceholder")}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="m-1 inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-4 text-sm font-extrabold text-ink hover:bg-gold-300 disabled:opacity-60"
        >
          <Send className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {t("subscribe")}
        </button>
      </div>
      <p aria-live="polite" className="min-h-5 text-sm text-gold-200">
        {status === "ok" && t("subscribed")}
        {status === "error" && t("subscribeError")}
      </p>
    </form>
  );
}
