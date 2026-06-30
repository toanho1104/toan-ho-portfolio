'use client'

import type { FieldErrors, Path, UseFormRegister } from 'react-hook-form'
import { Input } from '@repo/ui'
import { TextareaField } from './textarea-field'

type I18nFieldsProps<T extends Record<string, unknown>> = {
  label: string
  viKey: Path<T>
  enKey: Path<T>
  register: UseFormRegister<T>
  errors?: FieldErrors<T>
  multiline?: boolean
}

export function I18nFields<T extends Record<string, unknown>>({
  label,
  viKey,
  enKey,
  register,
  errors,
  multiline,
}: I18nFieldsProps<T>) {
  const viError = errors?.[viKey]?.message as string | undefined
  const enError = errors?.[enKey]?.message as string | undefined

  return (
    <fieldset className="border border-base-300 rounded-lg p-4">
      <legend className="text-sm font-medium px-2">{label}</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {multiline ? (
          <>
            <TextareaField label="Tiếng Việt" error={viError} rows={3} {...register(viKey)} />
            <TextareaField label="English" error={enError} rows={3} {...register(enKey)} />
          </>
        ) : (
          <>
            <Input label="Tiếng Việt" error={viError} {...register(viKey)} />
            <Input label="English" error={enError} {...register(enKey)} />
          </>
        )}
      </div>
    </fieldset>
  )
}
