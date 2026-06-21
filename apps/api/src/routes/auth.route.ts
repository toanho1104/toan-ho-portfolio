import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { loginBodyValidator } from '@/validators/auth.validator'
import { authService } from '@/services/auth.service'
import { SWAGGER_TAGS } from '@/constants/swagger'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
      exp: '7d',
    })
  )
  .post(
    '/login',
    async ({ jwt, body, set }) => {
      const user = await authService.findUserByEmail(body.email)

      if (!user) {
        set.status = 401
        return { message: 'Invalid credentials' }
      }

      const isValid = await authService.verifyPassword(body.password, user.passwordHash)

      if (!isValid) {
        set.status = 401
        return { message: 'Invalid credentials' }
      }

      const token = await jwt.sign({ userId: user.id, email: user.email })

      return { token }
    },
    {
      body: loginBodyValidator,
      detail: { tags: [SWAGGER_TAGS.AUTH], summary: 'Login and get JWT token' },
    }
  )
