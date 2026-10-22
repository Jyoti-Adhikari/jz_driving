import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Calendar, Clock, User, BookOpen, XCircle, AlertCircle,
  RotateCw, Loader2, CheckCircle2, CreditCard, Bell, ChevronRight,
} from 'lucide-react';

const STATUS_STYLES = {
  pending:   { badge: { background: 'var(--warning-50)', color: 'var(--warning-600)', border: '1px solid #fde68a' }, label: 'Pending' },
  confirmed: { badge: { background: 'var(--primary-50)', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' }, label: 'Confirmed' },
  completed: { badge: { background: 'var(--success-50)', color: 'var(--success-700)', border: '1px solid #a7f3d0' }, label: 'Completed' },
  cancelled: { badge: { background: 'var(--danger-50)', color: 'var(--danger-700)', border: '1px solid #fecdd3' }, label: 'Cancelled' },
};

const PAYMENT_STYLES = {
  unpaid:   { color: 'var(--danger-600)', label: 'Unpaid' },
  paid:     { color: 'var(--success-600)', label: 'Paid' },
  refunded: { color: 'var(--slate-500)', label: 'Refunded' },
};

function BookingCard({ booking, onCancel, cancellingId }) {
  const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
  const paymentStyle = PAYMENT_STYLES[booking.paymentStatus] || PAYMENT_STYLES.unpaid;
  const canCancel = booking.status !== 'cancelled' && booking.status !== 'completed';
  const isCancelling = cancellingId === booking._id;
  const scheduleDate = booking.schedule?.date
    ? new Date(booking.schedule.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    : 'TBD';

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
            {booking.courseId?.title || 'Driving Course'}
          </h3>
          <span className="badge" style={statusStyle.badge}>{statusStyle.label}</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
          Booked {new Date(booking.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          <User size={14} color="var(--primary-600)" />
          <span><strong>Instructor:</strong> {booking.instructorId?.name || 'Assigned'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          <Calendar size={14} color="var(--primary-600)" />
          <span><strong>Date:</strong> {scheduleDate}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
          <Clock size={14} color="var(--primary-600)" />
          <span><strong>Time:</strong> {booking.schedule?.timeSlot || 'TBD'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
          <CreditCard size={14} color={paymentStyle.color} />
          <span style={{ color: paymentStyle.color, fontWeight: 600 }}>Payment: {paymentStyle.label}</span>
        </div>
      </div>
      {canCancel && (
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            disabled={isCancelling}
            onClick={() => onCancel(booking._id)}
            className="btn btn-danger-outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            {isCancelling
              ? <><Loader2 size={13} className="spinner" style={{ borderWidth: '2px' }} /><span>Cancelling&hellip;</span></>
              : <><XCircle size={13} /><span>Cancel Booking</span></>
            }
          </button>
        </div>
      )}
    </div>
  );
}

export function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bData, nData] = await Promise.all([
        api.get('/bookings'),
        api.get('/notifications'),
      ]);
      setBookings(Array.isArray(bData) ? bData : []);
      setNotifications(Array.isArray(nData) ? nData : []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCancel = useCallback(async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    setCancelError(null);
    try {
      const updated = await api.put(`/bookings/${bookingId}/cancel`);
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: updated.status || 'cancelled' } : b));
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  }, []);

  const activeBookings = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">Learner Portal</h1>
            <p className="page-subtitle">Welcome back, {user?.name || 'Student'}. Track your lessons and booking status.</p>
          </div>
          <span className="badge badge-customer">Student Account</span>
        </div>

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-600)' }}>{bookings.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Total Bookings</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning-600)' }}>{activeBookings.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Active Lessons</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success-600)' }}>{completedBookings.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Completed</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: unreadNotifications.length > 0 ? 'var(--danger-600)' : 'var(--slate-400)' }}>
                  {unreadNotifications.length}
                </div>
                {unreadNotifications.length > 0 && <Bell size={16} color="var(--danger-600)" />}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Unread Alerts</div>
            </div>
          </div>
        )}

        {cancelError && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{cancelError}</div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }} role="status" aria-live="polite">
            <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem auto', borderWidth: '3px', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
            <p style={{ color: 'var(--slate-600)', margin: 0 }}>Loading your lesson dashboard&hellip;</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              <strong>Unable to load dashboard</strong>
            </div>
            <p style={{ margin: 0 }}>{error}</p>
            <button type="button" onClick={fetchData} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
              <RotateCw size={14} /><span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="var(--primary-600)" />
                My Bookings
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{bookings.length} total</span>
                <button type="button" onClick={fetchData} className="btn btn-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} title="Refresh">
                  <RotateCw size={14} />
                </button>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="placeholder-box">
                <Calendar className="placeholder-icon" />
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--slate-800)' }}>No Bookings Yet</h3>
                <p style={{ margin: '0 auto 1.25rem auto', maxWidth: '400px', fontSize: '0.95rem' }}>
                  Book your first driving lesson to get started.
                </p>
                <Link to="/courses" className="btn btn-primary">
                  <BookOpen size={15} /><span>Browse Courses</span>
                </Link>
              </div>
            ) : (
              bookings.map((booking) => (
                <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} cancellingId={cancellingId} />
              ))
            )}

            {notifications.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={18} color="var(--primary-600)" />
                  Recent Notifications
                  {unreadNotifications.length > 0 && (
                    <span className="badge badge-active" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                      {unreadNotifications.length} new
                    </span>
                  )}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n._id} className="card" style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flex: 1 }}>
                        {n.isRead
                          ? <CheckCircle2 size={15} color="var(--slate-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          : <Bell size={15} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        }
                        <span style={{ fontSize: '0.875rem', color: n.isRead ? 'var(--slate-500)' : 'var(--slate-800)' }}>{n.message}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', whiteSpace: 'nowrap' }}>
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/courses" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                  <BookOpen size={15} /><span>Browse &amp; Book Courses</span><ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;
