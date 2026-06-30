import { apiFetch } from '@/lib/api'
import type {
  Experience,
  ExperienceInput,
  ExperiencesResponse,
} from '@/lib/types/experience'

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value))
  })
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const experiencesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<ExperiencesResponse>(`/experiences/${buildQuery(params)}`),
  get: (id: string) => apiFetch<Experience>(`/experiences/${id}`),
  create: (data: ExperienceInput) =>
    apiFetch<Experience>('/experiences/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ExperienceInput>) =>
    apiFetch<Experience>(`/experiences/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) => apiFetch<void>(`/experiences/${id}`, { method: 'DELETE' }),
}
