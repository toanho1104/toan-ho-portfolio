export type I18nField = {
  vi?: string;
  en?: string;
};

export type PaginationMeta = {
  total: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export const PROJECT_TYPES = ["work", "personal", "open-source"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_STATUSES = [
  "completed",
  "in-progress",
  "archived",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const SKILL_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const SKILL_TYPES = [
  "technical",
  "soft",
  "language",
  "tool",
  "ai",
] as const;
export type SkillType = (typeof SKILL_TYPES)[number];

export function formatI18n(
  value: I18nField | null | undefined,
  locale: "vi" | "en" = "en",
) {
  if (!value) return "—";
  return value[locale] || value.vi || value.en || "—";
}

export function parseTechStack(input: string) {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function joinTechStack(stack: string[] | null | undefined) {
  return stack?.join(", ") ?? "";
}

export function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toISOString().slice(0, 10);
}

export function toIsoDate(value: string) {
  if (!value) return undefined;
  return new Date(value).toISOString();
}
