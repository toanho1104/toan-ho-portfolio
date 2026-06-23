import { eq, and, asc, count } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import type { ProjectQuery } from "@/validators/project.validator";
import {
  getPaginationOffset,
  buildPaginationMeta,
} from "@/validators/common.validator";

type CreateProjectInput = typeof projects.$inferInsert;
type UpdateProjectInput = Partial<CreateProjectInput>;

// HTTP body dùng string cho dates, service lo việc convert
type ProjectBody = Omit<UpdateProjectInput, "startDate" | "endDate"> & {
  startDate?: string | null;
  endDate?: string | null;
};

export const projectService = {
  async getAll(filters: ProjectQuery = {}) {
    const { page, limit, offset } = getPaginationOffset(
      filters.page,
      filters.limit,
    );
    const rest = filters;

    const conditions = [];
    if (rest.type) conditions.push(eq(projects.type, rest.type));
    if (rest.status) conditions.push(eq(projects.status, rest.status));
    if (rest.featured !== undefined)
      conditions.push(eq(projects.isFeatured, rest.featured));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, countResult] = await Promise.all([
      db.query.projects.findMany({
        where,
        orderBy: [asc(projects.sortOrder)],
        limit,
        offset,
      }),
      db.select({ total: count() }).from(projects).where(where),
    ]);

    const total = countResult[0]?.total ?? 0;

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  },

  async getById(id: string) {
    return db.query.projects.findFirst({
      where: eq(projects.id, id),
    });
  },

  async create(userId: string, data: Omit<ProjectBody, "userId">) {
    const [created] = await db
      .insert(projects)
      .values({
        userId,
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      })
      .returning();
    return created;
  },

  async update(id: string, data: ProjectBody) {
    const [updated] = await db
      .update(projects)
      .set({
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(projects).where(eq(projects.id, id));
  },
};
