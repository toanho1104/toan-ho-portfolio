import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { loginBodyValidator } from '@/validators/auth.validator'
import { authService } from '@/services/auth.service'
import { SWAGGER_TAGS } from '@/constants/swagger'
import { authMiddleware } from '@/middleware/auth'

const ACCESS_TOKEN_EXP = '1d'
const REFRESH_TOKEN_EXP = '7d'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    })
  )
  // ─── Login ────────────────────────────────────────────────────────────────
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

      const [accessToken, refreshToken] = await Promise.all([
        jwt.sign({ userId: user.id, email: user.email, exp: ACCESS_TOKEN_EXP }),
        jwt.sign({ userId: user.id, type: 'refresh', exp: REFRESH_TOKEN_EXP }),
      ])

      // Lưu refresh token vào DB để có thể revoke
      await authService.saveRefreshToken(user.id, refreshToken)

      return { accessToken, refreshToken }
    },
    {
      body: loginBodyValidator,
      detail: { tags: [SWAGGER_TAGS.AUTH], summary: 'Login — returns accessToken + refreshToken' },
    }
  )
  // ─── Refresh ──────────────────────────────────────────────────────────────
  .post(
    '/refresh',
    async ({ jwt, body, set }) => {
      // Verify JWT signature
      const payload = await jwt.verify(body.refreshToken)
      if (!payload || payload.type !== 'refresh') {
        set.status = 401
        return { message: 'Invalid refresh token' }
      }

      // Check token còn trong DB không (chưa bị logout)
      const user = await authService.findUserByRefreshToken(body.refreshToken)
      if (!user) {
        set.status = 401
        return { message: 'Refresh token revoked' }
      }

      // Rotate: cấp refresh token mới, vô hiệu hóa cái cũ
      const [accessToken, newRefreshToken] = await Promise.all([
        jwt.sign({ userId: user.id, email: user.email, exp: ACCESS_TOKEN_EXP }),
        jwt.sign({ userId: user.id, type: 'refresh', exp: REFRESH_TOKEN_EXP }),
      ])

      await authService.saveRefreshToken(user.id, newRefreshToken)

      return { accessToken, refreshToken: newRefreshToken }
    },
    {
      body: t.Object({ refreshToken: t.String() }),
      detail: { tags: [SWAGGER_TAGS.AUTH], summary: 'Refresh access token' },
    }
  )
  // ─── Logout ───────────────────────────────────────────────────────────────
  .use(authMiddleware)
  .post(
    '/logout',
    async ({ userId }) => {
      await authService.clearRefreshToken(userId!)
      return { message: 'Logged out successfully' }
    },
    {
      detail: { tags: [SWAGGER_TAGS.AUTH], summary: 'Logout — revoke refresh token' },
    }
  )
