import { useAuth } from '../context/AuthContext';
import { Calendar, FileText, Clock } from 'lucide-react';

export function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Learner Portal</h1>
            <p className="page-subtitle">Welcome back, {user?.name || 'Student'}. Track your lessons and documents.</p>
          </div>
          <span className="badge badge-customer">Student Account</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Calendar size={20} color="#2563eb" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>My Bookings</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              View upcoming driving schedules, dates, and assigned instructors.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <FileText size={20} color="#059669" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Identity Verification</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Upload your citizenship, license, or passport for government verification.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Clock size={20} color="#d97706" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Payment Status</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Check course fees, eSewa receipts, and invoice status.
            </p>
          </div>
        </div>

        <div className="placeholder-box">
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--slate-600)' }}>
            Customer dashboard workflows (booking list, cancellation modal, Multer document uploads) will be implemented in Part 4.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
