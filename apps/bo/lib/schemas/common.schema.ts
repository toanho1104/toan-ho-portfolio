import { z } from 'zod'

export const i18nFieldSchema = z.object({
  vi: z.string().optional(),
  en: z.string().optional(),
})

export const optionalUrlSchema = z
  .string()
  .url('Invalid URL')
  .optional()
  .or(z.literal(''))

export const optionalEmailSchema = z
  .string()
  .email('Invalid email')
  .optional()
  .or(z.literal(''))
