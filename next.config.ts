import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at our request config (src/i18n/request.ts)
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Serve modern formats (WebP/AVIF) automatically for every <Image />
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
