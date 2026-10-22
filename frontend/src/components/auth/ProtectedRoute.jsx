import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Helper to determine default authorized dashboard by role
 */
function getRoleDashboard(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'instructor':
      return '/instructor/dashboard';
    case 'customer':
    default:
      return '/dashboard';
  }
}

/**
 * ProtectedRoute Guard
 * - Redirects unauthenticated users to /login preserving intended location.
 * - Enforces role-based permissions (allowedRoles).
 * - Redirects unauthorized authenticated users to their own dashboard to avoid loops.
 */
export function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="spinner-container" aria-live="polite">
        <div className="spinner" />
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user?.role)) {
    // Redirect to user's own authorized dashboard to prevent loops
    return <Navigate to={getRoleDashboard(user?.role)} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
