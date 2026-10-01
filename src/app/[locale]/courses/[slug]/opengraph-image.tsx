import { ogImage, ogSize } from "@/lib/og";
import { getCourse, getCourseSlugs } from "@/lib/data";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Abnauona Courses";

export function generateStaticParams() {
  return getCourseSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug, "en");
  if (!course) return ogImage({ eyebrow: "COURSE", title: "Abnauona Courses" });
  return ogImage({
    eyebrow: course.categoryName.toUpperCase(),
    title: course.title,
    subtitle: `${course.level === "all-levels" ? "All levels" : course.level[0].toUpperCase() + course.level.slice(1)}${course.cefr ? ` · ${course.cefr}` : ""} · ${course.durationWeeks} weeks · with ${course.instructorName}`,
    price: `From ${course.fromPrice} AED`,
  });
}
