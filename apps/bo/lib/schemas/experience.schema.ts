import { z } from 'zod'
import { optionalUrlSchema } from './common.schema'
import { parseTechStack, toIsoDate } from '@/lib/types/common'

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  companyLogoUrl: optionalUrlSchema,
  companyUrl: optionalUrlSchema,
  positionVi: z.string().min(1, 'Position (VI) is required'),
  positionEn: z.string().optional(),
  descriptionVi: z.string().optional(),
  descriptionEn: z.string().optional(),
  techStack: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  sortOrder: z.number().int().min(0),
})

export type ExperienceFormValues = z.infer<typeof experienceSchema>

export function experienceToForm(exp: {
  company: string
  companyLogoUrl?: string | null
  companyUrl?: string | null
  position: { vi?: string; en?: string }
  description: { vi?: string; en?: string }
  techStack: string[]
  startDate: string
  endDate?: string | null
  isCurrent: boolean
  sortOrder: number
}): ExperienceFormValues {
  return {
    company: exp.company,
    companyLogoUrl: exp.companyLogoUrl ?? '',
    companyUrl: exp.companyUrl ?? '',
    positionVi: exp.position.vi ?? '',
    positionEn: exp.position.en ?? '',
    descriptionVi: exp.description.vi ?? '',
    descriptionEn: exp.description.en ?? '',
    techStack: exp.techStack.join(', '),
    startDate: exp.startDate.slice(0, 10),
    endDate: exp.endDate ? exp.endDate.slice(0, 10) : '',
    isCurrent: exp.isCurrent,
    sortOrder: exp.sortOrder,
  }
}

export function formToExperiencePayload(values: ExperienceFormValues) {
  return {
    company: values.company,
    companyLogoUrl: values.companyLogoUrl || undefined,
    companyUrl: values.companyUrl || undefined,
    position: { vi: values.positionVi, en: values.positionEn },
    description: { vi: values.descriptionVi, en: values.descriptionEn },
    techStack: parseTechStack(values.techStack ?? ''),
    startDate: toIsoDate(values.startDate)!,
    endDate: values.isCurrent ? undefined : values.endDate ? toIsoDate(values.endDate) : undefined,
    isCurrent: values.isCurrent,
    sortOrder: values.sortOrder,
  }
}
