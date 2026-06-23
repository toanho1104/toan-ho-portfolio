import { Elysia } from 'elysia'
import { authRoutes } from '@/routes/auth.route'
import { profileRoutes } from '@/routes/profile.route'
import { projectRoutes } from '@/routes/project.route'

export const routes = new Elysia()
  .use(authRoutes)
  .use(profileRoutes)
  .use(projectRoutes)
