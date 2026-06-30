import { forwardRef } from 'react'

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="label py-0">
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea
        ref={ref}
        className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-error text-xs">{error}</span>}
    </div>
  ),
)

TextareaField.displayName = 'TextareaField'
