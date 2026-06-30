'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Input } from '@repo/ui'
import { skillsApi } from '@/lib/api/skills'
import { queryKeys } from '@/lib/query-keys'
import type { SkillCategory } from '@/lib/types/skill'
import { skillCategorySchema, type SkillCategoryFormValues } from '@/lib/schemas/skill.schema'
import { Modal } from '@/components/ui/modal'
import { I18nFields } from '@/components/ui/i18n-fields'
import { AlertMessage } from '@/components/ui/alert-message'

type CategoryFormModalProps = {
  open: boolean
  category?: SkillCategory
  onClose: () => void
}

export function CategoryFormModal({ open, category, onClose }: CategoryFormModalProps) {
  const queryClient = useQueryClient()
  const isEdit = !!category

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SkillCategoryFormValues>({
    resolver: zodResolver(skillCategorySchema),
    defaultValues: { sortOrder: 0 },
  })

  useEffect(() => {
    if (open) {
      reset(
        category
          ? {
              nameVi: category.name.vi ?? '',
              nameEn: category.name.en ?? '',
              sortOrder: category.sortOrder,
            }
          : { nameVi: '', nameEn: '', sortOrder: 0 },
      )
    }
  }, [open, category, reset])

  const mutation = useMutation({
    mutationFn: (values: SkillCategoryFormValues) => {
      const payload = {
        name: { vi: values.nameVi, en: values.nameEn },
        sortOrder: values.sortOrder,
      }
      return isEdit
        ? skillsApi.updateCategory(category!.id, payload)
        : skillsApi.createCategory(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skillCategories })
      onClose()
    },
  })

  return (
    <Modal open={open} title={isEdit ? 'Edit category' : 'New category'} onClose={onClose}>
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-4">
        <I18nFields label="Category name" viKey="nameVi" enKey="nameEn" register={register} errors={errors} />
        <Input label="Sort order" type="number" error={errors.sortOrder?.message} {...register('sortOrder', { valueAsNumber: true })} />
        {mutation.error && <AlertMessage message={mutation.error.message} />}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Save' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}
