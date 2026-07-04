import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { routes } from '@/routes'
import { SWAGGER_TAG_DEFINITIONS } from '@/constants/swagger'
import { getAwsStorageStatus, isAwsConfigured } from '@/config/aws'

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Toan Ho Portfolio API',
          version: '1.0.0',
          description: 'API for portfolio back office management',
        },
        tags: SWAGGER_TAG_DEFINITIONS,
      },
    })
  )
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 422
      return {
        message: 'Validation failed',
        errors: error.all.map((e: { path: string; message: string }) => ({
          field: e.path.replace('/', '') || 'body',
          message: e.message,
        })),
      }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      return { message: 'Route not found' }
    }

    console.error(`[ERROR] ${code}:`, error)
    set.status = 500
    return { message: 'Internal server error' }
  })
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    storage: getAwsStorageStatus(),
  }))
  .use(routes)

app.listen(process.env.PORT ?? 3001)

if (!isAwsConfigured()) {
  console.warn('[aws] S3 uploads disabled:', getAwsStorageStatus().reason)
}

console.log(`API running at http://localhost:${app.server?.port}`)
console.log(`Swagger UI at http://localhost:${app.server?.port}/swagger`)
