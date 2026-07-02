import type { I18nField, PaginatedResponse, ProjectStatus, ProjectType } from './common'

export type Project = {
  id: string
  userId: string
  experienceId: string | null
  title: I18nField
  summary: I18nField
  description: I18nField
  type: ProjectType
  status: ProjectStatus
  techStack: string[]
  thumbnailUrl: string | null
  images: string[]
  githubUrl: string | null
  demoUrl: string | null
  appStoreUrl: string | null
  playStoreUrl: string | null
  isFeatured: boolean
  sortOrder: number
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectInput = {
  experienceId?: string
  title: I18nField
  summary?: I18nField
  description?: I18nField
  type?: ProjectType
  status?: ProjectStatus
  techStack?: string[]
  thumbnailUrl?: string
  images?: string[]
  githubUrl?: string
  demoUrl?: string
  appStoreUrl?: string
  playStoreUrl?: string
  isFeatured?: boolean
  sortOrder?: number
  startDate?: string
  endDate?: string
}

export type ProjectsResponse = PaginatedResponse<Project>
