CREATE TYPE "public"."skill_type" AS ENUM('technical', 'soft', 'language', 'tool', 'ai');--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "youtube_url" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "education_school" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "education_degree" jsonb DEFAULT '{"vi":"","en":""}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "experience_id" text;--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "type" "skill_type" DEFAULT 'technical' NOT NULL;