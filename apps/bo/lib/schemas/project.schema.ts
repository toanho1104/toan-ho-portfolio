import { z } from 'zod'
import { optionalUrlSchema } from './common.schema'
import { PROJECT_STATUSES, PROJECT_TYPES, parseTechStack, toIsoDate } from '@/lib/types/common'

export const projectSchema = z.object({
  experienceId: z.string().optional(),
  titleVi: z.string().min(1, 'Title (VI) is required'),
  titleEn: z.string().optional(),
  summaryVi: z.string().optional(),
  summaryEn: z.string().optional(),
  descriptionVi: z.string().optional(),
  descriptionEn: z.string().optional(),
  type: z.enum(PROJECT_TYPES),
  status: z.enum(PROJECT_STATUSES),
  techStack: z.string().optional(),
  thumbnailUrl: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
  demoUrl: optionalUrlSchema,
  appStoreUrl: optionalUrlSchema,
  playStoreUrl: optionalUrlSchema,
  isFeatured: z.boolean(),
  sortOrder: z.number().int().min(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export function projectToForm(project: {
  experienceId?: string | null
  title: { vi?: string; en?: string }
  summary: { vi?: string; en?: string }
  description: { vi?: string; en?: string }
  type: string
  status: string
  techStack: string[]
  thumbnailUrl?: string | null
  githubUrl?: string | null
  demoUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  isFeatured: boolean
  sortOrder: number
  startDate?: string | null
  endDate?: string | null
}): ProjectFormValues {
  return {
    experienceId: project.experienceId ?? '',
    titleVi: project.title.vi ?? '',
    titleEn: project.title.en ?? '',
    summaryVi: project.summary.vi ?? '',
    summaryEn: project.summary.en ?? '',
    descriptionVi: project.description.vi ?? '',
    descriptionEn: project.description.en ?? '',
    type: project.type as ProjectFormValues['type'],
    status: project.status as ProjectFormValues['status'],
    techStack: project.techStack.join(', '),
    thumbnailUrl: project.thumbnailUrl ?? '',
    githubUrl: project.githubUrl ?? '',
    demoUrl: project.demoUrl ?? '',
    appStoreUrl: project.appStoreUrl ?? '',
    playStoreUrl: project.playStoreUrl ?? '',
    isFeatured: project.isFeatured,
    sortOrder: project.sortOrder,
    startDate: project.startDate ? project.startDate.slice(0, 10) : '',
    endDate: project.endDate ? project.endDate.slice(0, 10) : '',
  }
}

export function formToProjectPayload(values: ProjectFormValues) {
  return {
    experienceId: values.experienceId || undefined,
    title: { vi: values.titleVi, en: values.titleEn },
    summary: { vi: values.summaryVi, en: values.summaryEn },
    description: { vi: values.descriptionVi, en: values.descriptionEn },
    type: values.type,
    status: values.status,
    techStack: parseTechStack(values.techStack ?? ''),
    thumbnailUrl: values.thumbnailUrl || undefined,
    githubUrl: values.githubUrl || undefined,
    demoUrl: values.demoUrl || undefined,
    appStoreUrl: values.appStoreUrl || undefined,
    playStoreUrl: values.playStoreUrl || undefined,
    isFeatured: values.isFeatured,
    sortOrder: values.sortOrder,
    startDate: values.startDate ? toIsoDate(values.startDate) : undefined,
    endDate: values.endDate ? toIsoDate(values.endDate) : undefined,
  }
}
