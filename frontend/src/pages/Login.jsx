import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

export function Login() {
  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: '50%', marginBottom: '1rem' }}>
            <LogIn size={28} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ margin: '0 0 1.5rem 0', color: 'var(--slate-500)', fontSize: '0.925rem' }}>
            Sign in to access your bookings, lessons, or instructor portal.
          </p>

          <div className="placeholder-box" style={{ padding: '2rem 1rem', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--slate-600)' }}>
              Authentication form with email/password validation and role redirection will be wired in Part 4.
            </p>
          </div>

          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Don&apos;t have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
