import { Elysia } from 'elysia'
import { authMiddleware } from '@/middleware/auth'
import { resumeService } from '@/services/resume.service'
import { uploadResumeBodyValidator } from '@/validators/resume.validator'
import { SWAGGER_TAGS } from '@/constants/swagger'

const publicResumeRoutes = new Elysia({ prefix: '/resume' })
  .get(
    '/view',
    async ({ set }) => {
      try {
        const view = await resumeService.getPublicView()

        if (!view) {
          set.status = 404
          return { message: 'Resume not found' }
        }

        return view
      } catch (error) {
        console.error('[resume/view]', error)
        set.status = 503
        return { message: 'Resume storage is unavailable' }
      }
    },
    {
      detail: {
        tags: [SWAGGER_TAGS.RESUME],
        summary: 'Get CV preview URL (inline PDF)',
      },
    },
  )
  .get(
  '/download',
  async ({ set }) => {
    try {
      const download = await resumeService.getPublicDownload()

      if (!download) {
        set.status = 404
        return { message: 'Resume not found' }
      }

      set.status = 302
      set.headers['Location'] = download.url
      return
    } catch (error) {
      console.error('[resume/download]', error)
      set.status = 503
      return { message: 'Resume storage is unavailable' }
    }
  },
  {
    detail: {
      tags: [SWAGGER_TAGS.RESUME],
      summary: 'Download CV (redirect to S3 presigned URL)',
    },
  },
)

const protectedResumeRoutes = new Elysia({ prefix: '/resume' })
  .use(authMiddleware)
  .get(
    '/',
    async ({ userId }) => {
      const resume = await resumeService.getForUser(userId!)

      if (!resume) {
        return { resume: null }
      }

      return { resume }
    },
    {
      detail: {
        tags: [SWAGGER_TAGS.RESUME],
        summary: 'Get my uploaded CV metadata (BO only)',
      },
    },
  )
  .post(
    '/upload',
    async ({ userId, body, set }) => {
      try {
        const result = await resumeService.upload(userId!, body.file)
        return { message: 'Resume uploaded', resume: result }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Upload failed'

        if (message === 'Profile not found') {
          set.status = 404
          return { message }
        }

        if (
          message === 'Only PDF files are allowed' ||
          message === 'File size must be 5MB or less'
        ) {
          set.status = 422
          return { message }
        }

        if (message === 'AWS is not configured') {
          set.status = 503
          return { message }
        }

        console.error('[resume/upload]', error)
        set.status = 500
        return { message: 'Upload failed' }
      }
    },
    {
      body: uploadResumeBodyValidator,
      detail: {
        tags: [SWAGGER_TAGS.RESUME],
        summary: 'Upload CV PDF to S3 (BO only)',
      },
    },
  )
  .delete(
    '/',
    async ({ userId, set }) => {
      try {
        return await resumeService.remove(userId!)
      } catch (error) {
        console.error('[resume/delete]', error)
        set.status = 503
        return { message: 'Resume storage is unavailable' }
      }
    },
    {
      detail: {
        tags: [SWAGGER_TAGS.RESUME],
        summary: 'Delete CV from S3 (BO only)',
      },
    },
  )

export const resumeRoutes = new Elysia()
  .use(publicResumeRoutes)
  .use(protectedResumeRoutes)
