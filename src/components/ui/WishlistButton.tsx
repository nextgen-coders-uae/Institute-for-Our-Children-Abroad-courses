"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStore } from "@/components/providers/StoreProvider";
import { cn } from "@/lib/utils";

export function WishlistButton({ courseId, className, withLabel }: { courseId: string; className?: string; withLabel?: boolean }) {
  const t = useTranslations("common");
  const { wishlist, toggleWishlist, toast, hydrated } = useStore();
  const active = hydrated && wishlist.includes(courseId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        const added = toggleWishlist(courseId);
        toast(added ? t("addedToWishlist") : t("removedFromWishlist"));
      }}
      aria-pressed={active}
      aria-label={active ? t("wishlistRemove") : t("wishlistAdd")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition",
        withLabel ? "btn btn-outline" : "h-10 w-10 bg-white/90 shadow-md backdrop-blur hover:scale-105",
        className
      )}
    >
      <Heart className={cn("h-5 w-5 transition", active ? "fill-pharaoh-600 text-pharaoh-600" : "text-lapis-800")} aria-hidden="true" />
      {withLabel && <span>{active ? t("wishlistRemove") : t("wishlistAdd")}</span>}
    </button>
  );
}
