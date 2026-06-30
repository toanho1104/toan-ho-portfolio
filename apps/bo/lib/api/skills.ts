import { apiFetch } from '@/lib/api'
import type {
  Skill,
  SkillCategory,
  SkillCategoryInput,
  SkillInput,
} from '@/lib/types/skill'

export const skillsApi = {
  getCategories: () => apiFetch<SkillCategory[]>('/skills/categories'),
  createCategory: (data: SkillCategoryInput) =>
    apiFetch<SkillCategory>('/skills/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: Partial<SkillCategoryInput>) =>
    apiFetch<SkillCategory>(`/skills/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  removeCategory: (id: string) =>
    apiFetch<void>(`/skills/categories/${id}`, { method: 'DELETE' }),
  create: (data: SkillInput) =>
    apiFetch<Skill>('/skills/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<SkillInput>) =>
    apiFetch<Skill>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch<void>(`/skills/${id}`, { method: 'DELETE' }),
}
