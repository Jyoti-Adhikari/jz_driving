import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export function Register() {
  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--success-50)', color: 'var(--success-600)', borderRadius: '50%', marginBottom: '1rem' }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Join JZ Driving</h2>
          <p style={{ margin: '0 0 1.5rem 0', color: 'var(--slate-500)', fontSize: '0.925rem' }}>
            Sign up as a student driver or apply to become a verified instructor.
          </p>

          <div className="placeholder-box" style={{ padding: '2rem 1rem', marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--slate-600)' }}>
              Registration form with Customer / Instructor role selection, phone validation, and location fields will be wired in Part 4.
            </p>
          </div>

          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--slate-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
