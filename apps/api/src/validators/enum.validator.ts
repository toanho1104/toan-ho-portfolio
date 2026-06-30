import { t } from 'elysia'

/** Drizzle pgEnum.enumValues → Elysia t.Enum (expects Record, not array) */
export function drizzleEnumField<const T extends string>(values: readonly T[]) {
  const record = Object.fromEntries(
    values.map((value) => [value, value]),
  ) as { [K in T]: K }

  return t.Enum(record)
}
