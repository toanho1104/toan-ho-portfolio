import type { I18nField, PaginatedResponse } from './common'

export type Experience = {
  id: string
  userId: string
  company: string
  companyLogoUrl: string | null
  companyUrl: string | null
  position: I18nField
  description: I18nField
  techStack: string[]
  startDate: string
  endDate: string | null
  isCurrent: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type ExperienceInput = {
  company: string
  companyLogoUrl?: string
  companyUrl?: string
  position: I18nField
  description?: I18nField
  techStack?: string[]
  startDate: string
  endDate?: string
  isCurrent?: boolean
  sortOrder?: number
}

export type ExperiencesResponse = PaginatedResponse<Experience>
