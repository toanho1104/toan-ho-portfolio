import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const authMiddleware = new Elysia({ name: 'middleware/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    })
  )
  .derive({ as: 'scoped' }, async ({ jwt, headers }) => {
    const authorization = headers.authorization
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null

    const payload = token ? await jwt.verify(token) : null

    return {
      userId: payload ? (payload.userId as string) : null,
    }
  })
  .onBeforeHandle({ as: 'scoped' }, ({ userId, set }) => {
    if (!userId) {
      set.status = 401
      return { message: 'Unauthorized' }
    }
  })
