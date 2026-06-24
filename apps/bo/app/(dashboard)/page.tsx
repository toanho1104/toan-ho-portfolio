export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: '—' },
          { label: 'Skills', value: '—' },
          { label: 'Experiences', value: '—' },
          { label: 'Profile', value: 'Active' },
        ].map((stat) => (
          <div key={stat.label} className="card bg-base-100 shadow">
            <div className="card-body">
              <p className="text-base-content/60 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
