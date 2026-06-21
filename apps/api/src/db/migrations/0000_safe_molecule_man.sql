CREATE TYPE "public"."project_status" AS ENUM('completed', 'in-progress', 'archived');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('work', 'personal', 'open-source');--> statement-breakpoint
CREATE TYPE "public"."skill_level" AS ENUM('beginner', 'intermediate', 'advanced', 'expert');--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"company" text NOT NULL,
	"company_logo_url" text,
	"company_url" text,
	"position" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"description" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"tech_stack" text[] DEFAULT '{}' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"is_current" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"title" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"bio" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"avatar_url" text,
	"location" text,
	"email" text,
	"phone" text,
	"github_url" text,
	"linkedin_url" text,
	"website_url" text,
	"resume_url" text,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"summary" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"description" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"type" "project_type" DEFAULT 'personal' NOT NULL,
	"status" "project_status" DEFAULT 'completed' NOT NULL,
	"tech_stack" text[] DEFAULT '{}' NOT NULL,
	"thumbnail_url" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"demo_url" text,
	"app_store_url" text,
	"play_store_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"level" "skill_level" DEFAULT 'intermediate' NOT NULL,
	"icon_url" text,
	"years_of_experience" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_categories" ADD CONSTRAINT "skill_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_skill_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."skill_categories"("id") ON DELETE no action ON UPDATE no action;