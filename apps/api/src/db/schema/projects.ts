import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { projectTypeEnum, projectStatusEnum } from './enums'

export const projects = pgTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  experienceId: text('experience_id'),
  title: jsonb('title').notNull().default({ vi: '', en: '' }),
  summary: jsonb('summary').notNull().default({ vi: '', en: '' }),
  description: jsonb('description').notNull().default({ vi: '', en: '' }),
  type: projectTypeEnum('type').notNull().default('personal'),
  status: projectStatusEnum('status').notNull().default('completed'),
  techStack: text('tech_stack').array().notNull().default([]),
  thumbnailUrl: text('thumbnail_url'),
  images: text('images').array().notNull().default([]),
  githubUrl: text('github_url'),
  demoUrl: text('demo_url'),
  appStoreUrl: text('app_store_url'),
  playStoreUrl: text('play_store_url'),
  isFeatured: boolean('is_featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}))
