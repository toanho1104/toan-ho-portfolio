import { Elysia, t } from 'elysia'
import { authMiddleware } from '@/middleware/auth'
import { projectService } from '@/services/project.service'
import {
  createProjectBodyValidator,
  updateProjectBodyValidator,
  projectQueryValidator,
} from '@/validators/project.validator'
import { SWAGGER_TAGS } from '@/constants/swagger'

// Public routes
const publicProjectRoutes = new Elysia({ prefix: '/projects' })
  .get('/', async ({ query }) => {
    return projectService.getAll({
      type: query.type,
      status: query.status,
      featured: query.featured,
      page: query.page,
      limit: query.limit,
    })
  }, {
    query: projectQueryValidator,
    detail: { tags: [SWAGGER_TAGS.PROJECTS], summary: 'Get all projects (public)' },
  })
  .get('/:id', async ({ params, set }) => {
    const project = await projectService.getById(params.id)

    if (!project) {
      set.status = 404
      return { message: 'Project not found' }
    }

    return project
  }, {
    detail: { tags: [SWAGGER_TAGS.PROJECTS], summary: 'Get project by ID (public)' },
  })

// Protected routes
const protectedProjectRoutes = new Elysia({ prefix: '/projects' })
  .use(authMiddleware)
  .post('/', async ({ userId, body }) => {
    return projectService.create(userId!, body)
  }, {
    body: createProjectBodyValidator,
    detail: { tags: [SWAGGER_TAGS.PROJECTS], summary: 'Create a project (BO only)' },
  })
  .put('/:id', async ({ params, body, set }) => {
    const existing = await projectService.getById(params.id)

    if (!existing) {
      set.status = 404
      return { message: 'Project not found' }
    }

    return projectService.update(params.id, body)
  }, {
    body: updateProjectBodyValidator,
    detail: { tags: [SWAGGER_TAGS.PROJECTS], summary: 'Update a project (BO only)' },
  })
  .delete('/:id', async ({ params, set }) => {
    const existing = await projectService.getById(params.id)

    if (!existing) {
      set.status = 404
      return { message: 'Project not found' }
    }

    await projectService.delete(params.id)
    set.status = 204
  }, {
    detail: { tags: [SWAGGER_TAGS.PROJECTS], summary: 'Delete a project (BO only)' },
  })

export const projectRoutes = new Elysia()
  .use(publicProjectRoutes)
  .use(protectedProjectRoutes)
