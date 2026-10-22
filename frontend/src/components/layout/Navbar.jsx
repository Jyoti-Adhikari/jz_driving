import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, LogOut, LayoutDashboard, User } from 'lucide-react';

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

function getRoleBadgeClass(role) {
  switch (role) {
    case 'admin':
      return 'badge badge-admin';
    case 'instructor':
      return 'badge badge-instructor';
    case 'customer':
    default:
      return 'badge badge-customer';
  }
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardPath = user ? getRoleDashboard(user.role) : '/dashboard';

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand */}
        <Link to="/" className="nav-brand" aria-label="JZ Driving Home">
          <div className="nav-brand-icon">
            <Car size={22} />
          </div>
          <span>JZ Driving</span>
        </Link>

        {/* Public Navigation */}
        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Courses
          </NavLink>
        </nav>

        {/* Auth Actions */}
        <div className="nav-actions">
          {isAuthenticated && user ? (
            <>
              <span className={getRoleBadgeClass(user.role)}>
                {user.role}
              </span>
              <Link to={dashboardPath} className="btn btn-secondary" title="Go to Dashboard">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <span className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={16} />
                <strong>{user.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-danger-outline"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
