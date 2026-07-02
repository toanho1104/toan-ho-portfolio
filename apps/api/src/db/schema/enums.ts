import { pgEnum } from 'drizzle-orm/pg-core'

export const projectTypeEnum = pgEnum('project_type', ['work', 'personal', 'open-source'])
export const projectStatusEnum = pgEnum('project_status', ['completed', 'in-progress', 'archived'])
export const skillLevelEnum = pgEnum('skill_level', ['beginner', 'intermediate', 'advanced', 'expert'])
export const skillTypeEnum = pgEnum('skill_type', ['technical', 'soft', 'language', 'tool', 'ai'])

// TypeScript types extracted từ enums — single source of truth
export type ProjectType = (typeof projectTypeEnum.enumValues)[number]
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number]
export type SkillLevel = (typeof skillLevelEnum.enumValues)[number]
export type SkillType = (typeof skillTypeEnum.enumValues)[number]
