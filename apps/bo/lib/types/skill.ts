import type { I18nField, SkillLevel } from './common'

export type Skill = {
  id: string
  categoryId: string
  name: string
  level: SkillLevel
  iconUrl: string | null
  yearsOfExperience: number | null
  sortOrder: number
  createdAt: string
}

export type SkillCategory = {
  id: string
  userId: string
  name: I18nField
  sortOrder: number
  createdAt: string
  skills: Skill[]
}

export type SkillCategoryInput = {
  name: I18nField
  sortOrder?: number
}

export type SkillInput = {
  categoryId: string
  name: string
  level?: SkillLevel
  iconUrl?: string
  yearsOfExperience?: number
  sortOrder?: number
}
