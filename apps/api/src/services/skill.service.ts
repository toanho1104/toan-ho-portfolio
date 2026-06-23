import { eq, and, asc, count } from 'drizzle-orm'
import { db } from '@/db'
import { skills, skillCategories } from '@/db/schema'
import { getPaginationOffset, buildPaginationMeta } from '@/validators/common.validator'
import type { SkillQuery } from '@/validators/skill.validator'

export const skillService = {
  // Categories
  async getAllCategories(userId: string) {
    return db.query.skillCategories.findMany({
      where: eq(skillCategories.userId, userId),
      orderBy: [asc(skillCategories.sortOrder)],
      with: { skills: { orderBy: [asc(skills.sortOrder)] } },
    })
  },

  async createCategory(userId: string, data: Partial<typeof skillCategories.$inferInsert>) {
    const [created] = await db.insert(skillCategories).values({ userId, name: {}, ...data }).returning()
    return created
  },

  async updateCategory(id: string, data: Partial<typeof skillCategories.$inferInsert>) {
    const [updated] = await db.update(skillCategories).set(data).where(eq(skillCategories.id, id)).returning()
    return updated
  },

  async deleteCategory(id: string) {
    await db.delete(skillCategories).where(eq(skillCategories.id, id))
  },

  // Skills
  async getAll(filters: SkillQuery = {}) {
    const { page, limit, offset } = getPaginationOffset(filters.page, filters.limit)
    const where = filters.categoryId ? eq(skills.categoryId, filters.categoryId) : undefined

    const [data, countResult] = await Promise.all([
      db.query.skills.findMany({ where, orderBy: [asc(skills.sortOrder)], limit, offset }),
      db.select({ total: count() }).from(skills).where(where),
    ])

    return { data, meta: buildPaginationMeta(countResult[0]?.total ?? 0, page, limit) }
  },

  async getById(id: string) {
    return db.query.skills.findFirst({ where: eq(skills.id, id) })
  },

  async create(data: typeof skills.$inferInsert) {
    const [created] = await db.insert(skills).values(data).returning()
    return created
  },

  async update(id: string, data: Partial<typeof skills.$inferInsert>) {
    const [updated] = await db.update(skills).set(data).where(eq(skills.id, id)).returning()
    return updated
  },

  async delete(id: string) {
    await db.delete(skills).where(eq(skills.id, id))
  },
}
