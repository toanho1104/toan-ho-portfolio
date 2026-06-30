import { t, type Static } from 'elysia'
import { skillLevelEnum } from '@/db/schema'
import { paginationValidator } from '@/validators/common.validator'
import { drizzleEnumField } from '@/validators/enum.validator'

const skillLevelField = drizzleEnumField(skillLevelEnum.enumValues)

export const createSkillCategoryBodyValidator = t.Object({
  name: t.Object({ vi: t.Optional(t.String()), en: t.Optional(t.String()) }),
  sortOrder: t.Optional(t.Number()),
})

export const createSkillBodyValidator = t.Object({
  categoryId: t.String(),
  name: t.String({ minLength: 1 }),
  level: t.Optional(skillLevelField),
  iconUrl: t.Optional(t.String({ format: 'uri' })),
  yearsOfExperience: t.Optional(t.Number({ minimum: 0 })),
  sortOrder: t.Optional(t.Number()),
})

export const updateSkillBodyValidator = t.Partial(createSkillBodyValidator)
export const updateSkillCategoryBodyValidator = t.Partial(createSkillCategoryBodyValidator)

export const skillQueryValidator = t.Composite([
  paginationValidator,
  t.Object({ categoryId: t.Optional(t.String()) }),
])

export type SkillQuery = Static<typeof skillQueryValidator>
