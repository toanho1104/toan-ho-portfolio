import { t } from 'elysia'

const i18nField = t.Object({
  vi: t.Optional(t.String()),
  en: t.Optional(t.String()),
})

export const updateProfileBodyValidator = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  title: t.Optional(i18nField),
  bio: t.Optional(i18nField),
  avatarUrl: t.Optional(t.String({ format: 'uri' })),
  location: t.Optional(t.String()),
  email: t.Optional(t.String({ format: 'email' })),
  phone: t.Optional(t.String()),
  githubUrl: t.Optional(t.String({ format: 'uri' })),
  linkedinUrl: t.Optional(t.String({ format: 'uri' })),
  youtubeUrl: t.Optional(t.String({ format: 'uri' })),
  websiteUrl: t.Optional(t.String({ format: 'uri' })),
  educationSchool: t.Optional(i18nField),
  educationDegree: t.Optional(i18nField),
  resumeUrl: t.Optional(t.String({ format: 'uri' })),
  isAvailable: t.Optional(t.Boolean()),
})
