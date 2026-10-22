import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

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

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const user = await login(formData.email.trim(), formData.password);

      // Determine redirect destination (intended page or role dashboard)
      const intendedDestination = location.state?.from?.pathname;
      const destination = intendedDestination && intendedDestination !== '/login'
        ? intendedDestination
        : getRoleDashboard(user.role);

      navigate(destination, { replace: true, state: location.state });
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', minHeight: '65vh' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '0.75rem',
                background: 'var(--primary-50)',
                color: 'var(--primary-600)',
                borderRadius: '50%',
                marginBottom: '1rem',
              }}
            >
              <LogIn size={26} />
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>
              Sign In to JZ Driving
            </h1>
            <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: '0.925rem' }}>
              Access your lesson schedule, courses, or instructor portal.
            </p>
          </div>

          {serverError && (
            <div className="alert alert-danger" role="alert" aria-live="polite">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="email"
                placeholder="name@example.com"
                className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                required
              />
              {fieldErrors.email && (
                <span id="email-error" className="form-error">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                required
              />
              {fieldErrors.password && (
                <span id="password-error" className="form-error">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              New to JZ Driving?{' '}
              <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
