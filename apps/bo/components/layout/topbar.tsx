export function Topbar() {
  return (
    <header className="h-14 bg-base-100 border-b border-base-300 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-8">
            <span className="text-xs">TH</span>
          </div>
        </div>
      </div>
    </header>
  )
}
