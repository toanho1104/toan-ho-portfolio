import { t } from 'elysia'

export const uploadResumeBodyValidator = t.Object({
  file: t.File({
    type: ['application/pdf'],
    maxSize: 5 * 1024 * 1024,
  }),
})
