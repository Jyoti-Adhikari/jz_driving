import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--danger-50)', color: 'var(--danger-600)', borderRadius: '50%', marginBottom: '1.25rem' }}>
            <AlertCircle size={36} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>404</h1>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: 'var(--slate-800)' }}>
            Road Not Found
          </h2>
          <p style={{ color: 'var(--slate-600)', marginBottom: '1.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            The page you are looking for doesn&apos;t exist or may have been moved. Let&apos;s steer you back in the right direction.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
