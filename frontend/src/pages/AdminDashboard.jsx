import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  ShieldCheck, BookOpen, UserCheck, Users, AlertCircle,
  RotateCw, Loader2, Calendar, Clock, User, ChevronDown,
  FileCheck, CheckCircle2, Filter, Send,
} from 'lucide-react';

const STATUS_OPTS = ['pending', 'confirmed', 'completed', 'cancelled'];

const STATUS_STYLES = {
  pending:   { background: 'var(--warning-50)', color: 'var(--warning-600)', border: '1px solid #fde68a' },
  confirmed: { background: 'var(--primary-50)', color: 'var(--primary-600)', border: '1px solid var(--primary-200)' },
  completed: { background: 'var(--success-50)', color: 'var(--success-700)', border: '1px solid #a7f3d0' },
  cancelled: { background: 'var(--danger-50)', color: 'var(--danger-700)', border: '1px solid #fecdd3' },
};

function AdminBookingRow({ booking, onStatusUpdate, updatingId }) {
  const [selectedStatus, setSelectedStatus] = useState(booking.status);
  const isUpdating = updatingId === booking._id;
  const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
  const scheduleDate = booking.schedule?.date
    ? new Date(booking.schedule.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD';

  const handleUpdate = () => {
    if (selectedStatus !== booking.status) onStatusUpdate(booking._id, selectedStatus);
  };

  return (
    <div className="card" style={{ marginBottom: '0.75rem', padding: '0.85rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
              {booking.courseId?.title || 'Course'}
            </span>
            <span className="badge" style={statusStyle}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: 'monospace' }}>
              ID: {booking._id}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
              <User size={12} color="var(--primary-600)" />
              <span>Student: <strong>{booking.userId?.name || '—'}</strong> ({booking.userId?.email || '—'})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
              <User size={12} color="var(--warning-600)" />
              <span>Instructor: <strong>{booking.instructorId?.name || '—'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
              <Calendar size={12} color="var(--primary-600)" />
              <span>{scheduleDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
              <Clock size={12} color="var(--primary-600)" />
              <span>{booking.schedule?.timeSlot || 'TBD'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isUpdating}
              aria-label={`Update status for booking ${booking._id}`}
              style={{
                appearance: 'none',
                padding: '0.3rem 1.75rem 0.3rem 0.55rem',
                fontSize: '0.75rem',
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
            <ChevronDown size={11} style={{ position: 'absolute', right: '0.4rem', pointerEvents: 'none', color: 'var(--slate-500)' }} />
          </div>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating || selectedStatus === booking.status}
            className="btn btn-primary"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            {isUpdating
              ? <Loader2 size={12} className="spinner" style={{ borderWidth: '2px' }} />
              : <span>Update</span>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState('all');

  // Instructor approval state
  const [instructorIdInput, setInstructorIdInput] = useState('');
  const [approvingInstructor, setApprovingInstructor] = useState(false);
  const [approvalResult, setApprovalResult] = useState(null);
  const [approvalError, setApprovalError] = useState(null);

  // Document review state
  const [documentIdInput, setDocumentIdInput] = useState('');
  const [documentStatusInput, setDocumentStatusInput] = useState('approved');
  const [reviewingDocument, setReviewingDocument] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [reviewError, setReviewError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bData, cData] = await Promise.all([
        api.get('/bookings'),
        api.get('/courses'),
      ]);
      setBookings(Array.isArray(bData) ? bData : []);
      setCourses(Array.isArray(cData) ? cData : []);
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusUpdate = useCallback(async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    setActionError(null);
    setActionSuccess(null);
    try {
      const updated = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status: updated.status || newStatus } : b));
      setActionSuccess('Booking status updated.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err.message || 'Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  }, []);

  const handleApproveInstructor = async (e) => {
    e.preventDefault();
    const id = instructorIdInput.trim();
    if (!id) return;
    setApprovingInstructor(true);
    setApprovalError(null);
    setApprovalResult(null);
    try {
      const result = await api.put(`/auth/approve-instructor/${id}`);
      setApprovalResult(result);
      setInstructorIdInput('');
    } catch (err) {
      setApprovalError(err.message || 'Failed to approve instructor.');
    } finally {
      setApprovingInstructor(false);
    }
  };

  const handleReviewDocument = async (e) => {
    e.preventDefault();
    const id = documentIdInput.trim();
    if (!id) return;
    setReviewingDocument(true);
    setReviewError(null);
    setReviewResult(null);
    try {
      const result = await api.put(`/documents/${id}/review`, { status: documentStatusInput });
      setReviewResult(result);
      setDocumentIdInput('');
    } catch (err) {
      setReviewError(err.message || 'Failed to review document.');
    } finally {
      setReviewingDocument(false);
    }
  };

  // Known instructors extracted from courses and bookings
  const knownInstructors = useMemo(() => {
    const map = new Map();
    courses.forEach((c) => {
      if (c.instructorId && typeof c.instructorId === 'object' && c.instructorId._id) {
        map.set(c.instructorId._id, {
          id: c.instructorId._id,
          name: c.instructorId.name,
          email: c.instructorId.email,
          source: `Course: ${c.title}`,
        });
      }
    });
    bookings.forEach((b) => {
      if (b.instructorId && typeof b.instructorId === 'object' && b.instructorId._id) {
        if (!map.has(b.instructorId._id)) {
          map.set(b.instructorId._id, {
            id: b.instructorId._id,
            name: b.instructorId.name,
            email: b.instructorId.email,
            source: 'Booking assignment',
          });
        }
      }
    });
    return Array.from(map.values());
  }, [courses, bookings]);

  // Derived stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;

  const filteredBookings = useMemo(() => {
    if (bookingFilter === 'all') return bookings;
    return bookings.filter((b) => b.status === bookingFilter);
  }, [bookings, bookingFilter]);

  const tabStyle = (tab) => ({
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: activeTab === tab ? 700 : 500,
    color: activeTab === tab ? 'var(--primary-600)' : 'var(--slate-600)',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid var(--primary-600)' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
  });

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

        {/* Stats Row */}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-600)' }}>{totalBookings}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Total Bookings</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning-600)' }}>{pendingBookings}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Pending</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success-600)' }}>{completedBookings}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Completed</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--slate-700)' }}>{courses.length}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Courses</div>
            </div>
          </div>
        )}

        {/* Action Alerts */}
        {actionError && (
          <div className="alert alert-danger" role="alert" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{actionError}</div>
          </div>
        )}
        {actionSuccess && (
          <div className="alert alert-success" role="status" style={{ marginBottom: '1rem' }}>
            <div>{actionSuccess}</div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }} role="status" aria-live="polite">
            <div className="spinner" style={{ width: '36px', height: '36px', margin: '0 auto 1rem auto', borderWidth: '3px', borderColor: 'var(--primary-200)', borderTopColor: 'var(--primary-600)' }} />
            <p style={{ color: 'var(--slate-600)', margin: 0 }}>Loading admin dashboard&hellip;</p>
          </div>
        )}

        {/* Fetch Error */}
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

        {/* Tabs */}
        {!loading && !error && (
          <>
            <div style={{ borderBottom: '1px solid var(--slate-200)', marginBottom: '1.5rem', display: 'flex', gap: '0', overflowX: 'auto' }}>
              <button type="button" style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>
                <ShieldCheck size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Overview
              </button>
              <button type="button" style={tabStyle('bookings')} onClick={() => setActiveTab('bookings')}>
                <Calendar size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                All Bookings ({totalBookings})
              </button>
              <button type="button" style={tabStyle('courses')} onClick={() => setActiveTab('courses')}>
                <BookOpen size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Courses ({courses.length})
              </button>
              <button type="button" style={tabStyle('approvals')} onClick={() => setActiveTab('approvals')}>
                <UserCheck size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Instructor Approvals
              </button>
              <button type="button" style={tabStyle('documents')} onClick={() => setActiveTab('documents')}>
                <FileCheck size={14} style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
                Document Reviews
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--primary-50)', borderRadius: '8px', padding: '0.5rem', display: 'flex' }}>
                      <UserCheck size={20} color="var(--primary-600)" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Booking Status Breakdown</h3>
                  </div>
                  {(['pending', 'confirmed', 'completed', 'cancelled']).map((s) => {
                    const count = bookings.filter((b) => b.status === s).length;
                    const pct = totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0;
                    const style = STATUS_STYLES[s];
                    return (
                      <div key={s} style={{ marginBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', textTransform: 'capitalize' }}>{s}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: style.color }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: style.color, borderRadius: '3px', transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--success-50)', borderRadius: '8px', padding: '0.5rem', display: 'flex' }}>
                      <BookOpen size={20} color="var(--success-600)" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Available Courses</h3>
                  </div>
                  {courses.slice(0, 4).map((course) => (
                    <div key={course._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--slate-100)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)', fontWeight: 500 }}>{course.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>NPR {course.price?.toLocaleString() || '—'}</span>
                    </div>
                  ))}
                  {courses.length > 4 && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      +{courses.length - 4} more courses
                    </p>
                  )}
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ background: 'var(--warning-50)', borderRadius: '8px', padding: '0.5rem', display: 'flex' }}>
                      <Users size={20} color="var(--warning-600)" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Admin Operations</h3>
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 1.25rem', fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 2 }}>
                    <li>View and update all booking statuses</li>
                    <li>Monitor system-wide booking activity</li>
                    <li>View all available courses</li>
                    <li>Approve instructor registrations (PUT /api/auth/approve-instructor/:id)</li>
                    <li>Review uploaded user documents (PUT /api/documents/:id/review)</li>
                  </ul>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => setActiveTab('approvals')} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                      <UserCheck size={13} /><span>Approve Instructor</span>
                    </button>
                    <button type="button" onClick={() => setActiveTab('documents')} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                      <FileCheck size={13} /><span>Review Document</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} color="var(--primary-600)" />
                      All System Bookings
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                      Showing {filteredBookings.length} of {bookings.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                      <Filter size={14} />
                      <select
                        value={bookingFilter}
                        onChange={(e) => setBookingFilter(e.target.value)}
                        aria-label="Filter bookings by status"
                        style={{
                          padding: '0.3rem 0.6rem',
                          fontSize: '0.8rem',
                          border: '1px solid var(--slate-300)',
                          borderRadius: '6px',
                          background: 'white',
                          color: 'var(--slate-700)',
                        }}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button type="button" onClick={fetchData} className="btn btn-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} title="Refresh">
                      <RotateCw size={14} />
                    </button>
                  </div>
                </div>
                {filteredBookings.length === 0 ? (
                  <div className="placeholder-box">
                    <Calendar className="placeholder-icon" />
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--slate-800)' }}>No Bookings Match Filter</h3>
                    <p style={{ margin: 0 }}>
                      {bookings.length === 0 ? 'No bookings exist in the system yet.' : 'Try changing or clearing the status filter.'}
                    </p>
                  </div>
                ) : (
                  filteredBookings.map((booking) => (
                    <AdminBookingRow
                      key={booking._id}
                      booking={booking}
                      onStatusUpdate={handleStatusUpdate}
                      updatingId={updatingId}
                    />
                  ))
                )}
              </>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={18} color="var(--primary-600)" />
                    Course Catalog ({courses.length})
                  </h2>
                </div>
                {courses.length === 0 ? (
                  <div className="placeholder-box">
                    <BookOpen className="placeholder-icon" />
                    <p style={{ margin: 0 }}>No courses found in database.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {courses.map((course) => (
                      <div key={course._id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>{course.title}</h3>
                          <span className="badge" style={{ background: course.isActive ? 'var(--success-50)' : 'var(--slate-100)', color: course.isActive ? 'var(--success-700)' : 'var(--slate-500)', border: 'none', fontSize: '0.7rem' }}>
                            {course.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.8rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
                          {course.description?.slice(0, 100)}{course.description?.length > 100 ? '…' : ''}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate-600)', marginBottom: '0.5rem' }}>
                          <span>NPR {course.price?.toLocaleString() || '—'}</span>
                          <span>{course.durationHours || course.duration || '—'} hrs</span>
                        </div>
                        {course.instructorId && typeof course.instructorId === 'object' && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', borderTop: '1px solid var(--slate-100)', paddingTop: '0.4rem' }}>
                            Instructor: {course.instructorId.name} ({course.instructorId.email})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Instructor Approvals Tab */}
            {activeTab === 'approvals' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserCheck size={18} color="var(--primary-600)" />
                    Approve Instructor
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0 0 1rem 0' }}>
                    Submit an instructor&apos;s User ID to grant teaching approval via the backend admin API.
                  </p>

                  <div className="alert alert-info" style={{ marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                    <strong>Backend Endpoint Note:</strong> The backend supports <code>PUT /api/auth/approve-instructor/:id</code>. It does not provide an endpoint to query all unapproved instructors (no <code>GET /api/users</code> or <code>GET /api/instructors</code>). Enter the target instructor ID below.
                  </div>

                  {approvalError && (
                    <div className="alert alert-danger" role="alert" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <div>{approvalError}</div>
                    </div>
                  )}

                  {approvalResult && (
                    <div className="alert alert-success" role="status" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Instructor Approved:</strong> {approvalResult.name} ({approvalResult.email}) &mdash; isApproved: true
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleApproveInstructor}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="instructor-id-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                        Instructor User ID (MongoDB ObjectId)
                      </label>
                      <input
                        id="instructor-id-input"
                        type="text"
                        value={instructorIdInput}
                        onChange={(e) => setInstructorIdInput(e.target.value)}
                        placeholder="e.g. 507f1f77bcf86cd799439011"
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          border: '1px solid var(--slate-300)',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                        }}
                        disabled={approvingInstructor}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={approvingInstructor || !instructorIdInput.trim()}
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', width: '100%' }}
                    >
                      {approvingInstructor ? (
                        <><Loader2 size={14} className="spinner" style={{ borderWidth: '2px' }} /><span>Approving&hellip;</span></>
                      ) : (
                        <><Send size={14} /><span>Approve Instructor</span></>
                      )}
                    </button>
                  </form>
                </div>

                <div className="card">
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={18} color="var(--primary-600)" />
                    Instructors In Active Records
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0 0 1rem 0' }}>
                    Instructors associated with system courses or bookings:
                  </p>
                  {knownInstructors.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: 0 }}>No instructor records discovered in loaded courses or bookings.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {knownInstructors.map((ins) => (
                        <div key={ins.id} style={{ padding: '0.65rem 0.85rem', background: 'var(--slate-50)', borderRadius: '6px', border: '1px solid var(--slate-200)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--slate-800)' }}>{ins.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{ins.email}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>{ins.source}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setInstructorIdInput(ins.id)}
                              className="btn btn-outline"
                              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                              title="Copy ID to approval input"
                            >
                              Use ID
                            </button>
                          </div>
                          <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--primary-700)', marginTop: '0.35rem', wordBreak: 'break-all' }}>
                            {ins.id}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Document Reviews Tab */}
            {activeTab === 'documents' && (
              <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                <div className="card">
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileCheck size={18} color="var(--primary-600)" />
                    Review Document
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', margin: '0 0 1rem 0' }}>
                    Update the verification status of an uploaded document using the backend admin review endpoint.
                  </p>

                  <div className="alert alert-info" style={{ marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                    <strong>Backend Endpoint Note:</strong> The backend supports <code>PUT /api/documents/:id/review</code> with body <code>{'{ status: "approved" | "rejected" }'}</code>. It does not currently expose a <code>GET /api/documents</code> listing endpoint. Enter the Document ID below.
                  </div>

                  {reviewError && (
                    <div className="alert alert-danger" role="alert" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <div>{reviewError}</div>
                    </div>
                  )}

                  {reviewResult && (
                    <div className="alert alert-success" role="status" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Document Review Saved:</strong> Document ID {reviewResult._id} status is now <strong>{reviewResult.status}</strong>.
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleReviewDocument}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="document-id-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                        Document ID (MongoDB ObjectId)
                      </label>
                      <input
                        id="document-id-input"
                        type="text"
                        value={documentIdInput}
                        onChange={(e) => setDocumentIdInput(e.target.value)}
                        placeholder="e.g. 64b8a21f7e34b9d8820c71a3"
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          border: '1px solid var(--slate-300)',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                        }}
                        disabled={reviewingDocument}
                      />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label htmlFor="document-status-select" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                        Review Decision
                      </label>
                      <select
                        id="document-status-select"
                        value={documentStatusInput}
                        onChange={(e) => setDocumentStatusInput(e.target.value)}
                        disabled={reviewingDocument}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.875rem',
                          border: '1px solid var(--slate-300)',
                          borderRadius: '6px',
                          background: 'white',
                          color: 'var(--slate-700)',
                        }}
                      >
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={reviewingDocument || !documentIdInput.trim()}
                      className="btn btn-primary"
                      style={{ fontSize: '0.875rem', width: '100%' }}
                    >
                      {reviewingDocument ? (
                        <><Loader2 size={14} className="spinner" style={{ borderWidth: '2px' }} /><span>Submitting Review&hellip;</span></>
                      ) : (
                        <><Send size={14} /><span>Submit Review</span></>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

