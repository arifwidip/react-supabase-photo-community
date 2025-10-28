import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface PublicRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function PublicRoute({ children, fallback }: PublicRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If user is authenticated, show the authenticated content
  if (user) {
    return <>{children}</>
  }

  // If user is not authenticated and fallback is provided, show fallback
  if (fallback) {
    return <>{fallback}</>
  }

  // Otherwise, show the children (public content)
  return <>{children}</>
}