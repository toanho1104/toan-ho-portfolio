import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const experiences = pgTable('experiences', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  company: text('company').notNull(),
  companyLogoUrl: text('company_logo_url'),
  companyUrl: text('company_url'),
  position: jsonb('position').notNull().default({ vi: '', en: '' }),
  description: jsonb('description').notNull().default({ vi: '', en: '' }),
  techStack: text('tech_stack').array().notNull().default([]),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  isCurrent: boolean('is_current').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const experiencesRelations = relations(experiences, ({ one }) => ({
  user: one(users, {
    fields: [experiences.userId],
    references: [users.id],
  }),
}))
