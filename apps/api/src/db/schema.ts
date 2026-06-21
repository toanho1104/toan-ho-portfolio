import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const projectTypeEnum = pgEnum("project_type", [
  "work",
  "personal",
  "open-source",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "completed",
  "in-progress",
  "archived",
]);
export const skillLevelEnum = pgEnum("skill_level", [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

// ─── Users ───────────────────────────────────────────────────────────────────
// Chỉ có 1 user (bạn) dùng để login BO

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Profiles ────────────────────────────────────────────────────────────────

export const profiles = pgTable("profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  title: jsonb("title").notNull().default({ vi: "", en: "" }),
  bio: jsonb("bio").notNull().default({ vi: "", en: "" }),
  avatarUrl: text("avatar_url"),
  location: text("location"),
  email: text("email"),
  phone: text("phone"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  websiteUrl: text("website_url"),
  resumeUrl: text("resume_url"),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  title: jsonb("title").notNull().default({ vi: "", en: "" }),
  summary: jsonb("summary").notNull().default({ vi: "", en: "" }),
  description: jsonb("description").notNull().default({ vi: "", en: "" }),
  type: projectTypeEnum("type").notNull().default("personal"),
  status: projectStatusEnum("status").notNull().default("completed"),
  techStack: text("tech_stack").array().notNull().default([]),
  thumbnailUrl: text("thumbnail_url"),
  images: text("images").array().notNull().default([]),
  demoUrl: text("demo_url"),
  appStoreUrl: text("app_store_url"),
  playStoreUrl: text("play_store_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skillCategories = pgTable("skill_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  name: jsonb("name").notNull().default({ vi: "", en: "" }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  categoryId: text("category_id")
    .notNull()
    .references(() => skillCategories.id),
  name: text("name").notNull(),
  level: skillLevelEnum("level").notNull().default("intermediate"),
  iconUrl: text("icon_url"),
  yearsOfExperience: integer("years_of_experience"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Experiences ─────────────────────────────────────────────────────────────

export const experiences = pgTable("experiences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  company: text("company").notNull(),
  companyLogoUrl: text("company_logo_url"),
  companyUrl: text("company_url"),
  position: jsonb("position").notNull().default({ vi: "", en: "" }),
  description: jsonb("description").notNull().default({ vi: "", en: "" }),
  techStack: text("tech_stack").array().notNull().default([]),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isCurrent: boolean("is_current").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
