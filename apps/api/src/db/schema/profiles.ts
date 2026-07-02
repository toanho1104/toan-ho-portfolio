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
  avatarS3Key: text('avatar_s3_key'),
  location: text('location'),
  email: text('email'),
  phone: text('phone'),
  githubUrl: text('github_url'),
  linkedinUrl: text('linkedin_url'),
  youtubeUrl: text('youtube_url'),
  websiteUrl: text('website_url'),
  educationSchool: jsonb('education_school').notNull().default({ vi: '', en: '' }),
  educationDegree: jsonb('education_degree').notNull().default({ vi: '', en: '' }),
  resumeUrl: text('resume_url'),
  resumeS3Key: text('resume_s3_key'),
  resumeFileName: text('resume_file_name'),
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
