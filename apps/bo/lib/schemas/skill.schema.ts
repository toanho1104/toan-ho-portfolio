import { z } from 'zod'
import { SKILL_LEVELS } from '@/lib/types/common'

export const skillCategorySchema = z.object({
  nameVi: z.string().min(1, 'Name (VI) is required'),
  nameEn: z.string().optional(),
  sortOrder: z.number().int().min(0),
})

export type SkillCategoryFormValues = z.infer<typeof skillCategorySchema>

export const skillSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Name is required'),
  level: z.enum(SKILL_LEVELS),
  iconUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  yearsOfExperience: z.number().min(0).optional(),
  sortOrder: z.number().int().min(0),
})

export type SkillFormValues = z.infer<typeof skillSchema>
