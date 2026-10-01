import type messages from "../messages/ar.json";
import type { routing } from "@/i18n/routing";

// Type-safe translation keys: t("home.heroTitle") is checked at compile time.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
