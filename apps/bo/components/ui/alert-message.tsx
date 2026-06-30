type AlertMessageProps = {
  message: string
  type?: 'error' | 'success' | 'info'
}

export function AlertMessage({ message, type = 'error' }: AlertMessageProps) {
  const cls =
    type === 'success' ? 'alert-success' : type === 'info' ? 'alert-info' : 'alert-error'
  return (
    <div role="alert" className={`alert ${cls} alert-sm`}>
      <span>{message}</span>
    </div>
  )
}
