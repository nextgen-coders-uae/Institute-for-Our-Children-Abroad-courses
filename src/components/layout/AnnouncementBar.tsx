"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Top offers bar (text & link come from data/site.json → announcement). Dismissal lasts for the session. */
export function AnnouncementBar({ text, href }: { text: string; href?: string }) {
  const t = useTranslations("announcement");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("abc:ann") === text) setHidden(true);
    } catch { /* ignore */ }
  }, [text]);

  if (hidden) return null;

  return (
    <div className="relative bg-gradient-to-r from-pharaoh-700 via-pharaoh-600 to-royal-700 text-white">
      <div className="container-x flex min-h-10 items-center justify-center gap-3 py-2 pe-10 text-center text-[13px] font-semibold sm:text-sm">
        <p>
          {text}
          {href && (
            <Link href={href} className="ms-2 font-extrabold text-gold-200 underline decoration-gold-300/60 underline-offset-4 hover:text-white">
              {t("cta")}
            </Link>
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          try { sessionStorage.setItem("abc:ann", text); } catch { /* ignore */ }
        }}
        className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-white/15"
        aria-label={t("close")}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
