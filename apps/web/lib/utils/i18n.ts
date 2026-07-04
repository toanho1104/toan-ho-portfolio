import type { I18nField, Locale } from "@/lib/types/portfolio";

export function pickI18n(
  value: I18nField | null | undefined,
  locale: Locale,
): string {
  if (!value) return "";
  return value[locale]?.trim() || value.en?.trim() || value.vi?.trim() || "";
}

export function formatDateRange(
  start: string,
  end: string | null,
  isCurrent: boolean,
  locale: Locale,
): string {
  const fmt = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    month: "short",
    year: "numeric",
  });
  const startLabel = fmt.format(new Date(start));
  if (isCurrent || !end) {
    return `${startLabel} — ${locale === "vi" ? "Hiện tại" : "Present"}`;
  }
  return `${startLabel} — ${fmt.format(new Date(end))}`;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
