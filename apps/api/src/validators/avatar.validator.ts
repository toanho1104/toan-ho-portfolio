import { t } from 'elysia'

const AVATAR_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
] as const

export const uploadAvatarBodyValidator = t.Object({
  file: t.File({
    type: AVATAR_MIME_TYPES,
    maxSize: 2 * 1024 * 1024,
  }),
})
