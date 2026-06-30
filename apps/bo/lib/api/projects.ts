import { apiFetch } from '@/lib/api'
import type { Project, ProjectInput, ProjectsResponse } from '@/lib/types/project'

function buildQuery(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value))
  })
  const q = search.toString()
  return q ? `?${q}` : ''
}

export const projectsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiFetch<ProjectsResponse>(`/projects/${buildQuery(params)}`),
  get: (id: string) => apiFetch<Project>(`/projects/${id}`),
  create: (data: ProjectInput) =>
    apiFetch<Project>('/projects/', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ProjectInput>) =>
    apiFetch<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id: string) => apiFetch<void>(`/projects/${id}`, { method: 'DELETE' }),
}
