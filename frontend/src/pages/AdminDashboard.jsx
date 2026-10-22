import { useAuth } from '../context/AuthContext';
import { ShieldCheck, BookOpen, UserCheck, FileCheck } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Administrative Portal</h1>
            <p className="page-subtitle">Welcome, Admin {user?.name || ''}. System administration and oversight.</p>
          </div>
          <span className="badge badge-admin">Administrator</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <BookOpen size={20} color="#2563eb" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Course Management</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Create, update, price, and archive driving school training courses.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <UserCheck size={20} color="#059669" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Instructor Approvals</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Verify credentials and approve newly registered driving instructors.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <FileCheck size={20} color="#e11d48" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Document Verification</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Review government citizenship, license, and passport uploads.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} color="#d97706" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>All Bookings Oversight</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Monitor system bookings, instructor assignments, and payments.
            </p>
          </div>
        </div>

        <div className="placeholder-box">
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--slate-600)' }}>
            Administrative workflows (course CRUD, instructor approval, document reviews) will be implemented in Part 4.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
