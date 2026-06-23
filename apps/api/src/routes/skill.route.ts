import { Elysia } from 'elysia'
import { authMiddleware } from '@/middleware/auth'
import { skillService } from '@/services/skill.service'
import {
  createSkillBodyValidator,
  updateSkillBodyValidator,
  createSkillCategoryBodyValidator,
  updateSkillCategoryBodyValidator,
  skillQueryValidator,
} from '@/validators/skill.validator'
import { SWAGGER_TAGS } from '@/constants/swagger'

const publicSkillRoutes = new Elysia({ prefix: '/skills' })
  .get('/', ({ query }) => skillService.getAll(query), {
    query: skillQueryValidator,
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Get all skills (public)' },
  })
  .get('/categories', () => skillService.getAllCategories(''), {
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Get skill categories with skills (public)' },
  })

const protectedSkillRoutes = new Elysia({ prefix: '/skills' })
  .use(authMiddleware)
  // Categories
  .post('/categories', ({ userId, body }) => skillService.createCategory(userId!, body), {
    body: createSkillCategoryBodyValidator,
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Create skill category (BO only)' },
  })
  .put('/categories/:id', ({ params, body }) => skillService.updateCategory(params.id, body), {
    body: updateSkillCategoryBodyValidator,
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Update skill category (BO only)' },
  })
  .delete('/categories/:id', async ({ params, set }) => {
    await skillService.deleteCategory(params.id)
    set.status = 204
  }, {
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Delete skill category (BO only)' },
  })
  // Skills
  .post('/', ({ body }) => skillService.create(body), {
    body: createSkillBodyValidator,
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Create a skill (BO only)' },
  })
  .put('/:id', async ({ params, body, set }) => {
    const existing = await skillService.getById(params.id)
    if (!existing) { set.status = 404; return { message: 'Skill not found' } }
    return skillService.update(params.id, body)
  }, {
    body: updateSkillBodyValidator,
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Update a skill (BO only)' },
  })
  .delete('/:id', async ({ params, set }) => {
    const existing = await skillService.getById(params.id)
    if (!existing) { set.status = 404; return { message: 'Skill not found' } }
    await skillService.delete(params.id)
    set.status = 204
  }, {
    detail: { tags: [SWAGGER_TAGS.SKILLS], summary: 'Delete a skill (BO only)' },
  })

export const skillRoutes = new Elysia()
  .use(publicSkillRoutes)
  .use(protectedSkillRoutes)
