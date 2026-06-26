import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { profiles } from "@/db/schema/profiles";
import { projects } from "@/db/schema/projects";
import { skillCategories } from "@/db/schema/skills";
import { experiences } from "@/db/schema/experiences";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  refreshToken: text("refresh_token"),  // null = logged out
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  projects: many(projects),
  skillCategories: many(skillCategories),
  experiences: many(experiences),
}));
