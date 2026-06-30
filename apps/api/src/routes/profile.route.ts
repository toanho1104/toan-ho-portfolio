import { Elysia } from 'elysia'
import { authMiddleware } from '@/middleware/auth'
import { profileService } from '@/services/profile.service'
import { avatarService } from '@/services/avatar.service'
import { updateProfileBodyValidator } from '@/validators/profile.validator'
import { uploadAvatarBodyValidator } from '@/validators/avatar.validator'
import { SWAGGER_TAGS } from '@/constants/swagger'

const publicProfileRoutes = new Elysia({ prefix: '/profile' })
  .get(
    '/',
    async ({ set }) => {
      const profile = await profileService.getPublic()

      if (!profile) {
        set.status = 404
        return { message: 'Profile not found' }
      }

      return profile
    },
    {
      detail: {
        tags: [SWAGGER_TAGS.PROFILE],
        summary: 'Get portfolio owner profile (public)',
      },
    },
  )
  .get(
    '/avatar',
    async ({ set }) => {
      try {
        const avatar = await avatarService.getPublicUrl()

        if (!avatar) {
          set.status = 404
          return { message: 'Avatar not found' }
        }

        set.status = 302
        set.headers['Location'] = avatar.url
        return
      } catch (error) {
        console.error('[profile/avatar/public]', error)
        set.status = 503
        return { message: 'Avatar storage is unavailable' }
      }
    },
    {
      detail: {
        tags: [SWAGGER_TAGS.PROFILE],
        summary: 'Get avatar image (redirect to S3 presigned URL)',
      },
    },
  )

const protectedProfileRoutes = new Elysia({ prefix: '/profile' })
  .use(authMiddleware)
  .put(
    '/',
    async ({ userId, body }) => {
      return profileService.upsert(userId!, body)
    },
    {
      body: updateProfileBodyValidator,
      detail: {
        tags: [SWAGGER_TAGS.PROFILE],
        summary: 'Upsert my profile (BO only)',
      },
    },
  )
  .get(
    '/avatar/me',
    async ({ userId }) => {
      const avatar = await avatarService.getForUser(userId!)
      return { avatar }
    },
    {
      detail: {
        tags: [SWAGGER_TAGS.PROFILE],
        summary: 'Get my uploaded avatar metadata (BO only)',
      },
    },
  )
  .post(
    '/avatar/upload',
    async ({ userId, body, set }) => {
      try {
        const result = await avatarService.upload(userId!, body.file)
        return { message: 'Avatar uploaded', avatar: result }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Upload failed'

        if (message === 'Profile not found') {
          set.status = 404
          return { message }
        }

        if (
          message === 'Only JPEG, PNG, or WebP images are allowed' ||
          message === 'Image size must be 2MB or less'
        ) {
          set.status = 422
          return { message }
        }

        if (message === 'AWS is not configured') {
          set.status = 503
          return { message }
        }

        console.error('[profile/avatar/upload]', error)
        set.status = 500
        return { message: 'Upload failed' }
      }
    },
    {
      body: uploadAvatarBodyValidator,
      detail: {
        tags: [SWAGGER_TAGS.PROFILE],
        summary: 'Upload avatar image to S3 (BO only)',
      },
    },
  )
  .delete(
    '/avatar',
    async ({ userId, set }) => {
      try {
        return await avatarService.remove(userId!)
      } catch (error) {
        console.error('[profile/avatar/delete]', error)
        set.status = 503
        return { message: 'Avatar storage is unavailable' }
      }
    },
    {
      detail: {
        tags: [SWAGGER_TAGS.PROFILE],
        summary: 'Delete avatar from S3 (BO only)',
      },
    },
  )

export const profileRoutes = new Elysia()
  .use(publicProfileRoutes)
  .use(protectedProfileRoutes)
