'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { mergeRefs, useSyncSelectDisplay } from '@/lib/utils/merge-refs'

type SelectFieldProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'children'
> & {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, className = '', disabled, onChange, onBlur, name, ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const [displayValue, setDisplayValue] = useState(options[0]?.value ?? '')
    const selectRef = useRef<HTMLSelectElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const syncDisplay = useSyncSelectDisplay(selectRef, setDisplayValue)

    useEffect(() => {
      const onDocMouseDown = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', onDocMouseDown)
      return () => document.removeEventListener('mousedown', onDocMouseDown)
    }, [])

    useEffect(() => {
      if (props.value !== undefined) setDisplayValue(String(props.value))
    }, [props.value])

    const selectedLabel =
      options.find((opt) => opt.value === displayValue)?.label ?? 'Select...'

    const handleSelect = (value: string) => {
      const select = selectRef.current
      if (!select) return

      select.value = value
      setDisplayValue(value)
      setOpen(false)

      const event = new Event('change', { bubbles: true })
      select.dispatchEvent(event)

      onChange?.({
        target: select,
        currentTarget: select,
      } as React.ChangeEvent<HTMLSelectElement>)
    }

    return (
      <div className="flex flex-col gap-1" ref={containerRef}>
        {label && (
          <label className="label py-0">
            <span className="label-text">{label}</span>
          </label>
        )}

        {/* Native select — ẩn, dùng cho react-hook-form */}
        <select
          ref={mergeRefs(ref, selectRef)}
          name={name}
          disabled={disabled}
          onChange={(event) => {
            setDisplayValue(event.target.value)
            onChange?.(event)
          }}
          onBlur={onBlur}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className={`relative ${className}`}>
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => {
              syncDisplay()
              setOpen((prev) => !prev)
            }}
            className={`bo-select-trigger flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm ${
              error ? 'border-error' : ''
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <span className="truncate">{selectedLabel}</span>
            <span className="text-base-content/50 shrink-0" aria-hidden>
              ▾
            </span>
          </button>

          {open && (
            <ul
              role="listbox"
              className="bo-select-menu absolute left-0 right-0 top-[calc(100%+4px)] z-[200] max-h-56 overflow-y-auto rounded-lg border shadow-xl"
            >
              {options.map((opt) => {
                const isSelected = opt.value === displayValue
                return (
                  <li key={opt.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={`bo-select-option w-full px-3 py-2.5 text-left text-sm transition-colors ${
                        isSelected ? 'font-semibold' : ''
                      }`}
                      onClick={() => handleSelect(opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {error && <span className="text-error text-xs">{error}</span>}
      </div>
    )
  },
)

SelectField.displayName = 'SelectField'
