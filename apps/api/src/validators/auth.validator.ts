import { t } from 'elysia'
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '@/constants/regex'

export const loginBodyValidator = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String({
    minLength: 8,
    pattern: PASSWORD_REGEX,
    error: PASSWORD_REGEX_MESSAGE,
  }),
})
