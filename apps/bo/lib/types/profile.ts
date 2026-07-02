import type { I18nField } from './common'

export type Profile = {
  id: string
  userId: string
  name: string
  title: I18nField
  bio: I18nField
  avatarUrl: string | null
  location: string | null
  email: string | null
  phone: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  youtubeUrl: string | null
  websiteUrl: string | null
  educationSchool: I18nField
  educationDegree: I18nField
  resumeUrl: string | null
  isAvailable: boolean
  createdAt: string
  updatedAt: string
  avatar: {
    available: boolean
    urlPath: string
  } | null
  resume: {
    available: boolean
    fileName: string | null
    downloadPath: string
  } | null
}

export type UpdateProfileInput = {
  name?: string
  title?: I18nField
  bio?: I18nField
  avatarUrl?: string
  location?: string
  email?: string
  phone?: string
  githubUrl?: string
  linkedinUrl?: string
  youtubeUrl?: string
  websiteUrl?: string
  educationSchool?: I18nField
  educationDegree?: I18nField
  resumeUrl?: string
  isAvailable?: boolean
}

export type ResumeMeta = {
  fileName: string | null
  uploadedAt: string
  downloadPath: string
}

export type ResumeResponse = {
  resume: ResumeMeta | null
}

export type UploadResumeResponse = {
  message: string
  resume: ResumeMeta
}

export type AvatarMeta = {
  uploadedAt: string
  urlPath: string
}

export type AvatarResponse = {
  avatar: AvatarMeta | null
}

export type UploadAvatarResponse = {
  message: string
  avatar: AvatarMeta
}
