export const queryKeys = {
  profile: ['profile'] as const,
  avatar: ['avatar'] as const,
  resume: ['resume'] as const,
  projects: (params?: Record<string, string | number | boolean>) => ['projects', params] as const,
  project: (id: string) => ['projects', id] as const,
  skillCategories: ['skills', 'categories'] as const,
  experiences: (params?: Record<string, string | number | boolean>) => ['experiences', params] as const,
  dashboard: ['dashboard'] as const,
}
