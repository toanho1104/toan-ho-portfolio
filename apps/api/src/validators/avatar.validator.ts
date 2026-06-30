import { t } from 'elysia'

export const uploadAvatarBodyValidator = t.Object({
  file: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 2 * 1024 * 1024,
  }),
})
