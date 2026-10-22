import { useAuth } from '../context/AuthContext';
import { Users, CalendarCheck2, Star } from 'lucide-react';

export function InstructorDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Instructor Portal</h1>
            <p className="page-subtitle">Welcome, Instructor {user?.name || ''}. Manage your lessons and student sessions.</p>
          </div>
          <span className="badge badge-instructor">Instructor Account</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Users size={20} color="#d97706" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Assigned Students</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Track learners enrolled in your manual and automatic driving courses.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <CalendarCheck2 size={20} color="#2563eb" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Lesson Schedule</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Confirm, mark completed, or review upcoming timeslots for student drives.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Star size={20} color="#059669" />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>Student Reviews</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              View ratings, feedback, and student testimonials on completed lessons.
            </p>
          </div>
        </div>

        <div className="placeholder-box">
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--slate-600)' }}>
            Instructor dashboard workflows (booking status management, lesson updates) will be implemented in Part 4.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
