export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Sign in</h2>
          <p className="text-base-content/60 text-sm">Back Office Management</p>
          <form className="mt-4 flex flex-col gap-4">
            <label className="floating-label">
              <span>Email</span>
              <input
                type="email"
                placeholder="admin@example.com"
                className="input input-bordered w-full"
              />
            </label>
            <label className="floating-label">
              <span>Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
              />
            </label>
            <button type="submit" className="btn btn-primary w-full mt-2">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
