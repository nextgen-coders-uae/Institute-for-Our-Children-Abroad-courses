import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Abnauona Courses — Languages & skills in Ajman and online";

export default function Image() {
  return ogImage({
    eyebrow: "ABNAONA INSTITUTE ABROAD · AJMAN",
    title: "Learn a new language… and build your future with confidence",
    subtitle: "English · French · German · Arabic · Graphic Design · Coding",
  });
}
