import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import type { UserRole } from '../../providers/AuthProvider';
import { PageLoader } from './PageLoader';

interface ProtectedRouteProps {
  children: ReactElement;
  redirectTo?: string;
  requiredRole?: UserRole;
  customerOnly?: boolean;
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  requiredRole,
  customerOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader />;

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  // Admin-only page: customer trying to access /admin → send home
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Customer-only page: admin trying to access /dashboard → send to admin panel
  if (customerOnly && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
