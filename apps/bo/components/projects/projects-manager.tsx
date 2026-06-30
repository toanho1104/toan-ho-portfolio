'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@repo/ui'
import { projectsApi } from '@/lib/api/projects'
import { queryKeys } from '@/lib/query-keys'
import type { Project } from '@/lib/types/project'
import { formatI18n } from '@/lib/types/common'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertMessage } from '@/components/ui/alert-message'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ProjectFormModal } from '@/components/projects/project-form-modal'

export function ProjectsManager() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Project | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.projects({ limit: 50 }),
    queryFn: () => projectsApi.list({ limit: 50 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setDeleting(null)
    },
  })

  if (isLoading) return <LoadingState />
  if (error) return <AlertMessage message={error.message} />

  const projects = data?.data ?? []

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage portfolio projects"
        action={
          <Button type="button" onClick={() => setCreating(true)}>
            + Add project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Add your first project to show on the portfolio."
          action={
            <Button type="button" onClick={() => setCreating(true)}>
              + Add project
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto card bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Featured</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <div className="font-medium">{formatI18n(project.title)}</div>
                    <div className="text-xs text-base-content/50 truncate max-w-xs">
                      {formatI18n(project.summary)}
                    </div>
                  </td>
                  <td><span className="badge badge-ghost badge-sm">{project.type}</span></td>
                  <td><span className="badge badge-outline badge-sm">{project.status}</span></td>
                  <td>{project.isFeatured ? '★' : '—'}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(project)}>
                        Edit
                      </Button>
                      <Button type="button" variant="error" size="sm" onClick={() => setDeleting(project)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProjectFormModal
        open={creating || !!editing}
        project={editing}
        onClose={() => {
          setCreating(false)
          setEditing(null)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete project"
        message={`Delete "${deleting ? formatI18n(deleting.title) : ''}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
