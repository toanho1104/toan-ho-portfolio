'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Input } from '@repo/ui'
import { skillsApi } from '@/lib/api/skills'
import { queryKeys } from '@/lib/query-keys'
import type { Skill, SkillCategory } from '@/lib/types/skill'
import { SKILL_LEVELS } from '@/lib/types/common'
import { skillSchema, type SkillFormValues } from '@/lib/schemas/skill.schema'
import { Modal } from '@/components/ui/modal'
import { SelectField } from '@/components/ui/select-field'
import { AlertMessage } from '@/components/ui/alert-message'

type SkillFormModalProps = {
  open: boolean
  skill?: Skill
  defaultCategoryId?: string
  categories: SkillCategory[]
  onClose: () => void
}

export function SkillFormModal({
  open,
  skill,
  defaultCategoryId,
  categories,
  onClose,
}: SkillFormModalProps) {
  const queryClient = useQueryClient()
  const isEdit = !!skill

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: { level: 'intermediate', sortOrder: 0 },
  })

  useEffect(() => {
    if (open) {
      reset(
        skill
          ? {
              categoryId: skill.categoryId,
              name: skill.name,
              level: skill.level,
              iconUrl: skill.iconUrl ?? '',
              yearsOfExperience: skill.yearsOfExperience ?? undefined,
              sortOrder: skill.sortOrder,
            }
          : {
              categoryId: defaultCategoryId ?? categories[0]?.id ?? '',
              name: '',
              level: 'intermediate',
              sortOrder: 0,
              iconUrl: '',
            },
      )
    }
  }, [open, skill, defaultCategoryId, categories, reset])

  const mutation = useMutation({
    mutationFn: (values: SkillFormValues) => {
      const payload = {
        categoryId: values.categoryId,
        name: values.name,
        level: values.level,
        iconUrl: values.iconUrl || undefined,
        yearsOfExperience: values.yearsOfExperience,
        sortOrder: values.sortOrder,
      }
      return isEdit ? skillsApi.update(skill!.id, payload) : skillsApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skillCategories })
      onClose()
    },
  })

  return (
    <Modal open={open} title={isEdit ? 'Edit skill' : 'New skill'} onClose={onClose}>
      <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-4">
        <SelectField
          label="Category"
          options={categories.map((c) => ({
            value: c.id,
            label: c.name.en || c.name.vi || 'Unnamed',
          }))}
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />
        <Input label="Skill name" error={errors.name?.message} {...register('name')} />
        <SelectField
          label="Level"
          options={SKILL_LEVELS.map((l) => ({ value: l, label: l }))}
          error={errors.level?.message}
          {...register('level')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Years of experience" type="number" {...register('yearsOfExperience', { valueAsNumber: true })} />
          <Input label="Sort order" type="number" error={errors.sortOrder?.message} {...register('sortOrder', { valueAsNumber: true })} />
        </div>
        <Input label="Icon URL" error={errors.iconUrl?.message} {...register('iconUrl')} />
        {mutation.error && <AlertMessage message={mutation.error.message} />}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Save' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  )
}
