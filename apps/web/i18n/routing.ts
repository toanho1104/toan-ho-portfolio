import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vi"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
