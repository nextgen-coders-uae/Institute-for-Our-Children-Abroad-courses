"use client";

import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useStore } from "@/components/providers/StoreProvider";
import { CourseCard } from "./CourseCard";
import type { CourseSummary } from "@/lib/types";

export function WishlistView({ courses }: { courses: CourseSummary[] }) {
  const t = useTranslations();
  const { wishlist, hydrated } = useStore();
  if (!hydrated) return <div className="container-x py-24"><div className="card mx-auto h-48 max-w-3xl animate-pulse" /></div>;
  const items = courses.filter((c) => wishlist.includes(c.id));

  if (!items.length) {
    return (
      <div className="container-x py-20">
        <div className="card mx-auto flex max-w-xl flex-col items-center p-10 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-pharaoh-100 text-pharaoh-600">
            <Heart className="h-10 w-10" aria-hidden="true" />
          </span>
          <h2 className="mt-5 font-sans text-2xl font-extrabold text-lapis-900">{t("wishlist.empty")}</h2>
          <p className="mt-2 text-copper-700">{t("wishlist.emptyText")}</p>
          <Link href="/courses" className="btn btn-gold btn-lg mt-6">{t("common.browseCourses")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => <CourseCard key={c.id} course={c} />)}
    </div>
  );
}
