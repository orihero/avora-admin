import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores'

export function ProtectedRoute() {
  const sessionChecked = useAuthStore((s) => s.sessionChecked)
  const token = useAuthStore((s) => s.token)

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
