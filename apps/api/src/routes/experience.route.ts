import { Elysia } from 'elysia'
import { authMiddleware } from '@/middleware/auth'
import { experienceService } from '@/services/experience.service'
import {
  createExperienceBodyValidator,
  updateExperienceBodyValidator,
  experienceQueryValidator,
} from '@/validators/experience.validator'
import { SWAGGER_TAGS } from '@/constants/swagger'

const publicExperienceRoutes = new Elysia({ prefix: '/experiences' })
  .get('/', ({ query }) => experienceService.getAll(query), {
    query: experienceQueryValidator,
    detail: { tags: [SWAGGER_TAGS.EXPERIENCES], summary: 'Get all experiences (public)' },
  })
  .get('/:id', async ({ params, set }) => {
    const exp = await experienceService.getById(params.id)
    if (!exp) { set.status = 404; return { message: 'Experience not found' } }
    return exp
  }, {
    detail: { tags: [SWAGGER_TAGS.EXPERIENCES], summary: 'Get experience by ID (public)' },
  })

const protectedExperienceRoutes = new Elysia({ prefix: '/experiences' })
  .use(authMiddleware)
  .post('/', ({ userId, body }) => experienceService.create(userId!, body), {
    body: createExperienceBodyValidator,
    detail: { tags: [SWAGGER_TAGS.EXPERIENCES], summary: 'Create experience (BO only)' },
  })
  .put('/:id', async ({ params, body, set }) => {
    const existing = await experienceService.getById(params.id)
    if (!existing) { set.status = 404; return { message: 'Experience not found' } }
    return experienceService.update(params.id, body)
  }, {
    body: updateExperienceBodyValidator,
    detail: { tags: [SWAGGER_TAGS.EXPERIENCES], summary: 'Update experience (BO only)' },
  })
  .delete('/:id', async ({ params, set }) => {
    const existing = await experienceService.getById(params.id)
    if (!existing) { set.status = 404; return { message: 'Experience not found' } }
    await experienceService.delete(params.id)
    set.status = 204
  }, {
    detail: { tags: [SWAGGER_TAGS.EXPERIENCES], summary: 'Delete experience (BO only)' },
  })

export const experienceRoutes = new Elysia()
  .use(publicExperienceRoutes)
  .use(protectedExperienceRoutes)
