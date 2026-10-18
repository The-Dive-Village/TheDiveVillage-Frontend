import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const effectiveRole = role && role !== 'guest' ? role : 'customer'
  if (roles && !roles.includes(effectiveRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
