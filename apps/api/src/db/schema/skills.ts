import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { skillLevelEnum, skillTypeEnum } from './enums'

export const skillCategories = pgTable('skill_categories', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  name: jsonb('name').notNull().default({ vi: '', en: '' }),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const skills = pgTable('skills', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  categoryId: text('category_id').notNull().references(() => skillCategories.id),
  name: text('name').notNull(),
  type: skillTypeEnum('type').notNull().default('technical'),
  level: skillLevelEnum('level').notNull().default('intermediate'),
  iconUrl: text('icon_url'),
  yearsOfExperience: integer('years_of_experience'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const skillCategoriesRelations = relations(skillCategories, ({ one, many }) => ({
  user: one(users, {
    fields: [skillCategories.userId],
    references: [users.id],
  }),
  skills: many(skills),
}))

export const skillsRelations = relations(skills, ({ one }) => ({
  category: one(skillCategories, {
    fields: [skills.categoryId],
    references: [skillCategories.id],
  }),
}))
