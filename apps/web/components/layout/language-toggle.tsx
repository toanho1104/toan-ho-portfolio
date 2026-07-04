"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("lang");

  const nextLocale: Locale = locale === "en" ? "vi" : "en";

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm min-w-10 font-mono text-xs uppercase tracking-wider"
      aria-label={t(nextLocale)}
      onClick={() => router.replace(pathname, { locale: nextLocale })}
    >
      {nextLocale}
    </button>
  );
}
