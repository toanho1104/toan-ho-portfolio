import { t, type Static } from 'elysia'
import { paginationValidator } from '@/validators/common.validator'

export const createExperienceBodyValidator = t.Object({
  company: t.String({ minLength: 1 }),
  companyLogoUrl: t.Optional(t.String({ format: 'uri' })),
  companyUrl: t.Optional(t.String({ format: 'uri' })),
  position: t.Object({ vi: t.Optional(t.String()), en: t.Optional(t.String()) }),
  description: t.Optional(t.Object({ vi: t.Optional(t.String()), en: t.Optional(t.String()) })),
  techStack: t.Optional(t.Array(t.String())),
  startDate: t.String({ format: 'date-time' }),
  endDate: t.Optional(t.String({ format: 'date-time' })),
  isCurrent: t.Optional(t.Boolean()),
  sortOrder: t.Optional(t.Number()),
})

export const updateExperienceBodyValidator = t.Partial(createExperienceBodyValidator)

export const experienceQueryValidator = t.Composite([
  paginationValidator,
  t.Object({ current: t.Optional(t.BooleanString()) }),
])

export type ExperienceQuery = Static<typeof experienceQueryValidator>
