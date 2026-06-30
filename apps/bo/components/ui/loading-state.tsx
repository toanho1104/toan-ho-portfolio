type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-base-content/60 text-sm">{message}</p>
    </div>
  )
}
