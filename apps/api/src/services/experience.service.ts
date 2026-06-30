import { eq, asc, count } from 'drizzle-orm'
import { db } from '@/db'
import { experiences } from '@/db/schema'
import { getPaginationOffset, buildPaginationMeta } from '@/validators/common.validator'
import type { ExperienceQuery } from '@/validators/experience.validator'

type ExperienceBody = Omit<Partial<typeof experiences.$inferInsert>, 'startDate' | 'endDate'> & {
  startDate?: string
  endDate?: string | null
}

export const experienceService = {
  async getAll(filters: ExperienceQuery = {}) {
    const { page, limit, offset } = getPaginationOffset(filters.page, filters.limit)
    const where = filters.current ? eq(experiences.isCurrent, true) : undefined

    const [data, countResult] = await Promise.all([
      db.query.experiences.findMany({ where, orderBy: [asc(experiences.sortOrder)], limit, offset }),
      db.select({ total: count() }).from(experiences).where(where),
    ])

    return { data, meta: buildPaginationMeta(countResult[0]?.total ?? 0, page, limit) }
  },

  async getById(id: string) {
    return db.query.experiences.findFirst({ where: eq(experiences.id, id) })
  },

  async create(userId: string, data: ExperienceBody) {
    const { startDate, endDate, ...rest } = data

    const [created] = await db.insert(experiences).values({
      userId,
      ...rest,
      company: rest.company ?? '',
      position: rest.position ?? {},
      startDate: new Date(startDate!),
      endDate: endDate ? new Date(endDate) : null,
    }).returning()
    return created
  },

  async update(id: string, data: ExperienceBody) {
    const { startDate, endDate, ...rest } = data

    const [updated] = await db.update(experiences).set({
      ...rest,
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      updatedAt: new Date(),
    }).where(eq(experiences.id, id)).returning()
    return updated
  },

  async delete(id: string) {
    await db.delete(experiences).where(eq(experiences.id, id))
  },
}
