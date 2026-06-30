'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@repo/ui'
import { skillsApi } from '@/lib/api/skills'
import { queryKeys } from '@/lib/query-keys'
import type { Skill, SkillCategory } from '@/lib/types/skill'
import { formatI18n } from '@/lib/types/common'
import { PageHeader } from '@/components/ui/page-header'
import { LoadingState } from '@/components/ui/loading-state'
import { EmptyState } from '@/components/ui/empty-state'
import { AlertMessage } from '@/components/ui/alert-message'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { CategoryFormModal } from '@/components/skills/category-form-modal'
import { SkillFormModal } from '@/components/skills/skill-form-modal'

export function SkillsManager() {
  const queryClient = useQueryClient()
  const [categoryModal, setCategoryModal] = useState<{ mode: 'create' | 'edit'; category?: SkillCategory } | null>(null)
  const [skillModal, setSkillModal] = useState<{ mode: 'create' | 'edit'; skill?: Skill; categoryId?: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<
    { type: 'category'; item: SkillCategory } | { type: 'skill'; item: Skill } | null
  >(null)

  const { data: categories, isLoading, error } = useQuery({
    queryKey: queryKeys.skillCategories,
    queryFn: skillsApi.getCategories,
  })

  const deleteMutation = useMutation({
    mutationFn: async (target: NonNullable<typeof deleteTarget>) => {
      if (target.type === 'category') return skillsApi.removeCategory(target.item.id)
      return skillsApi.remove(target.item.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skillCategories })
      setDeleteTarget(null)
    },
  })

  if (isLoading) return <LoadingState />
  if (error) return <AlertMessage message={error.message} />

  const list = categories ?? []

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Manage skill categories and skills"
        action={
          <Button type="button" onClick={() => setCategoryModal({ mode: 'create' })}>
            + Add category
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          title="No skill categories"
          description="Create a category first, then add skills."
          action={
            <Button type="button" onClick={() => setCategoryModal({ mode: 'create' })}>
              + Add category
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {list.map((category) => (
            <div key={category.id} className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{formatI18n(category.name)}</h3>
                    <p className="text-xs text-base-content/50">{category.skills.length} skills</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSkillModal({ mode: 'create', categoryId: category.id })}
                    >
                      + Skill
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCategoryModal({ mode: 'edit', category })}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="error"
                      size="sm"
                      onClick={() => setDeleteTarget({ type: 'category', item: category })}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {category.skills.length > 0 && (
                  <div className="overflow-x-auto mt-2">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Level</th>
                          <th>Years</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.skills.map((skill) => (
                          <tr key={skill.id}>
                            <td>{skill.name}</td>
                            <td><span className="badge badge-ghost badge-sm">{skill.level}</span></td>
                            <td>{skill.yearsOfExperience ?? '—'}</td>
                            <td className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSkillModal({ mode: 'edit', skill, categoryId: category.id })}
                                >
                                  Edit
                                </Button>
                                <Button
                                  type="button"
                                  variant="error"
                                  size="sm"
                                  onClick={() => setDeleteTarget({ type: 'skill', item: skill })}
                                >
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
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal
        open={!!categoryModal}
        category={categoryModal?.category}
        onClose={() => setCategoryModal(null)}
      />

      <SkillFormModal
        open={!!skillModal}
        skill={skillModal?.skill}
        defaultCategoryId={skillModal?.categoryId}
        categories={list}
        onClose={() => setSkillModal(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title={deleteTarget?.type === 'category' ? 'Delete category' : 'Delete skill'}
        message={
          deleteTarget?.type === 'category'
            ? `Delete category "${formatI18n(deleteTarget.item.name)}" and all its skills?`
            : `Delete skill "${deleteTarget?.item.name}"?`
        }
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
