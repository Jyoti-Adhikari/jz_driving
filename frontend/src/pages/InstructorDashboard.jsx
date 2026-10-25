import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Users, CalendarCheck2, AlertCircle, RotateCw, Loader2,
  Clock, User, BookOpen, ChevronDown,
} from 'lucide-react';

const STATUS_OPTS = ['pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_STYLES = {
  pending:   { background: 'var(--warning-50)', color: 'var(--warning-600)', border: '1px solid #fde68a' },
  confirmed: { background: 'var(--primary-50)', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' },
  completed: { background: 'var(--success-50)', color: 'var(--success-700)', border: '1px solid #a7f3d0' },
  cancelled: { background: 'var(--danger-50)', color: 'var(--danger-700)', border: '1px solid #fecdd3' },
};

const STATUS_STYLES = {
  pending:   { background: 'var(--warning-50)', color: 'var(--warning-600)', border: '1px solid #fde68a' },
  confirmed: { background: 'var(--primary-50)', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' },
  completed: { background: 'var(--success-50)', color: 'var(--success-700)', border: '1px solid #a7f3d0' },
  cancelled: { background: 'var(--danger-50)', color: 'var(--danger-700)', border: '1px solid #fecdd3' },
};

function LessonCard({ booking, onStatusUpdate, updatingId }) {
  const [selectedStatus, setSelectedStatus] = useState(booking.status);
  const isUpdating = updatingId === booking._id;
  const scheduleDate = booking.schedule?.date
    ? new Date(booking.schedule.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : 'TBD';

  const handleUpdate = () => {
    if (selectedStatus !== booking.status) {
      onStatusUpdate(booking._id, selectedStatus);
    }
  };

  const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
            {booking.courseId?.title || 'Driving Lesson'}
          </h3>
          <span className="badge" style={statusStyle}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
          {new Date(booking.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          <User size={14} color="var(--primary-600)" />
          <span><strong>Student:</strong> {booking.userId?.name || 'Unknown'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          <span style={{ fontSize: '0.8rem' }}>&#x2709;</span>
          <span>{booking.userId?.email || '—'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          <CalendarCheck2 size={14} color="var(--primary-600)" />
          <span><strong>Date:</strong> {scheduleDate}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          <Clock size={14} color="var(--primary-600)" />
          <span><strong>Time:</strong> {booking.schedule?.timeSlot || 'TBD'}</span>
        </div>
      </div>

      {booking.status !== 'cancelled' && (
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label htmlFor={`status-${booking._id}`} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-600)' }}>
            Update Status:
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              id={`status-${booking._id}`}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isUpdating}
              style={{
                appearance: 'none',
                padding: '0.35rem 2rem 0.35rem 0.65rem',
                fontSize: '0.8rem',
                border: '1px solid var(--slate-300)',
                borderRadius: '6px',
                background: 'white',
                cursor: 'pointer',
                color: 'var(--slate-700)',
              }}
            >
              {STATUS_OPTS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: '0.5rem', pointerEvents: 'none', color: 'var(--slate-500)' }} />
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating || selectedStatus === booking.status}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            {isUpdating
              ? <><Loader2 size={13} className="spinner" style={{ borderWidth: '2px' }} /><span>Saving&hellip;</span></>
              : <span>Save</span>
            }
          </button>
        </div>
      )}
    </div>
  );
}

export function InstructorDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/bookings');
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load lesson data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusUpdate = useCallback(async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      const updated = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: updated.status || newStatus } : b));
      setUpdateSuccess('Booking status updated successfully.');
      setTimeout(() => setUpdateSuccess(null), 3000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const activeCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const uniqueStudents = new Set(bookings.map((b) => b.userId?._id).filter(Boolean)).size;

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Instructor Portal</h1>
            <p className="page-subtitle">Welcome, {user?.name || 'Instructor'}. Manage your assigned lessons and student sessions.</p>
          </div>
          <span className="badge badge-instructor">Instructor Account</span>
        </div>

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-600)' }}>{bookings.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Total Lessons</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning-600)' }}>{activeCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Active</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success-600)' }}>{completedCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Completed</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--slate-700)' }}>{uniqueStudents}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Students</div>
            </div>
          </div>
        )}

        {updateError && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{updateError}</div>
          </div>
        )}
        {updateSuccess && (
          <div className="alert alert-success" role="status" style={{ marginBottom: '1rem' }}>
            <div>{updateSuccess}</div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }} role="status" aria-live="polite">
            <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem auto', borderWidth: '3px', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
            <p style={{ color: 'var(--slate-600)', margin: 0 }}>Loading your lesson schedule&hellip;</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              <strong>Unable to load lessons</strong>
            </div>
            <p style={{ margin: 0 }}>{error}</p>
            <button type="button" onClick={fetchBookings} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
              <RotateCw size={14} /><span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="var(--primary-600)" />
                Assigned Lessons
              </h2>
              <button type="button" onClick={fetchBookings} className="btn btn-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} title="Refresh">
                <RotateCw size={14} />
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="placeholder-box">
                <BookOpen className="placeholder-icon" />
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--slate-800)' }}>No Lessons Assigned</h3>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  You have no lessons assigned yet. Check back once students have booked.
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <LessonCard
                  key={booking._id}
                  booking={booking}
                  onStatusUpdate={handleStatusUpdate}
                  updatingId={updatingId}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InstructorDashboard;
