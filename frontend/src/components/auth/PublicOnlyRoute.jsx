import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
 * PublicOnlyRoute Guard
 * - Redirects already authenticated users away from guest routes (/login, /register) to their role dashboard.
 */
export function PublicOnlyRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container" aria-live="polite">
        <div className="spinner" />
        <p>Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleDashboard(user?.role)} replace />;
  }

  return children ? children : <Outlet />;
}

export default PublicOnlyRoute;
