import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  title: jsonb('title').notNull().default({ vi: '', en: '' }),
  bio: jsonb('bio').notNull().default({ vi: '', en: '' }),
  avatarUrl: text('avatar_url'),
  location: text('location'),
  email: text('email'),
  phone: text('phone'),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  websiteUrl: text('website_url'),
  resumeUrl: text('resume_url'),
  isAvailable: boolean('is_available').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))
