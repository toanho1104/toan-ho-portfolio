'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { profileApi } from '@/lib/api/profile'
import { projectsApi } from '@/lib/api/projects'
import { skillsApi } from '@/lib/api/skills'
import { experiencesApi } from '@/lib/api/experiences'
import { queryKeys } from '@/lib/query-keys'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'

export function DashboardStats() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const [profile, projects, categories, experiences] = await Promise.all([
        profileApi.get().catch(() => null),
        projectsApi.list({ limit: 1 }),
        skillsApi.getCategories(),
        experiencesApi.list({ limit: 1 }),
      ])

      const skillCount = categories.reduce((sum, c) => sum + c.skills.length, 0)

      return {
        profileName: profile?.name ?? '—',
        profileAvailable: profile?.isAvailable ?? false,
        hasResume: profile?.resume?.available ?? false,
        projectCount: projects.meta.total,
        skillCount,
        categoryCount: categories.length,
        experienceCount: experiences.meta.total,
      }
    },
  })

  if (isLoading) return <LoadingState />

  const stats = [
    { label: 'Projects', value: data?.projectCount ?? 0, href: '/projects' },
    { label: 'Skills', value: data?.skillCount ?? 0, href: '/skills' },
    { label: 'Categories', value: data?.categoryCount ?? 0, href: '/skills' },
    { label: 'Experiences', value: data?.experienceCount ?? 0, href: '/experiences' },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back${data?.profileName ? `, ${data.profileName}` : ''}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card bg-base-100 shadow hover:shadow-md transition-shadow">
            <div className="card-body">
              <p className="text-base-content/60 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-base">Profile status</h2>
            <ul className="text-sm space-y-2 mt-2">
              <li className="flex justify-between">
                <span className="text-base-content/60">Availability</span>
                <span className={data?.profileAvailable ? 'text-success' : 'text-base-content/50'}>
                  {data?.profileAvailable ? 'Open to work' : 'Not available'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-base-content/60">CV uploaded</span>
                <span>{data?.hasResume ? 'Yes' : 'No'}</span>
              </li>
            </ul>
            <Link href="/profile" className="btn btn-sm btn-outline mt-4 w-fit">
              Edit profile
            </Link>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-base">Quick links</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link href="/projects" className="btn btn-sm btn-ghost">Projects</Link>
              <Link href="/skills" className="btn btn-sm btn-ghost">Skills</Link>
              <Link href="/experiences" className="btn btn-sm btn-ghost">Experiences</Link>
              <Link href="/profile" className="btn btn-sm btn-ghost">Profile & CV</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
