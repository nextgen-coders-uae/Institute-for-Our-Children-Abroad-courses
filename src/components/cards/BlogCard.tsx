import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { EgyptIcon } from "@/components/icons/EgyptianIcons";
import type { BlogPost } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function BlogCard({ post }: { post: BlogPost }) {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden bg-gradient-to-br from-copper-500 via-copper-700 to-lapis-900">
        <div className="bg-hieroglyphs-light absolute inset-0" />
        <EgyptIcon name={post.icon} className="relative h-16 w-16 text-gold-300 transition duration-500 group-hover:scale-110" strokeWidth={1.3} />
        <span className="absolute start-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-lapis-900">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-copper-700">
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time> · {t("minRead", { minutes: post.readMinutes })}
        </p>
        <h3 className="mt-2 font-sans text-lg leading-snug font-extrabold text-lapis-900">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-copper-900">{post.excerpt}</p>
      </div>
    </article>
  );
}
