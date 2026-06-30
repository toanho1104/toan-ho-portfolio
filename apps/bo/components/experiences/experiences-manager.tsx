'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@repo/ui'
import { experiencesApi } from '@/lib/api/experiences'
import { queryKeys } from '@/lib/query-keys'
import type { Experience } from '@/lib/types/experience'
import { formatI18n } from '@/lib/types/common'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertMessage } from '@/components/ui/alert-message'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ExperienceFormModal } from '@/components/experiences/experience-form-modal'

export function ExperiencesManager() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Experience | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<Experience | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.experiences({ limit: 50 }),
    queryFn: () => experiencesApi.list({ limit: 50 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experiencesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
      setDeleting(null)
    },
  })

  if (isLoading) return <LoadingState />
  if (error) return <AlertMessage message={error.message} />

  const experiences = data?.data ?? []

  return (
    <div>
      <PageHeader
        title="Experiences"
        description="Manage work history"
        action={
          <Button type="button" onClick={() => setCreating(true)}>
            + Add experience
          </Button>
        }
      />

      {experiences.length === 0 ? (
        <EmptyState
          title="No experiences yet"
          action={
            <Button type="button" onClick={() => setCreating(true)}>
              + Add experience
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto card bg-base-100 shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Period</th>
                <th>Current</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp.id}>
                  <td className="font-medium">{exp.company}</td>
                  <td>{formatI18n(exp.position)}</td>
                  <td className="text-sm text-base-content/70">
                    {exp.startDate.slice(0, 10)}
                    {' → '}
                    {exp.isCurrent ? 'Present' : exp.endDate?.slice(0, 10) ?? '—'}
                  </td>
                  <td>{exp.isCurrent ? '✓' : '—'}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(exp)}>
                        Edit
                      </Button>
                      <Button type="button" variant="error" size="sm" onClick={() => setDeleting(exp)}>
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

      <ExperienceFormModal
        open={creating || !!editing}
        experience={editing}
        onClose={() => {
          setCreating(false)
          setEditing(null)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete experience"
        message={`Delete experience at "${deleting?.company}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}
