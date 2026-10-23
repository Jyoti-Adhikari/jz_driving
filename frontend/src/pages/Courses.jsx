import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  BookOpen,
  Clock,
  User,
  Mail,
  AlertCircle,
  RotateCw,
  Search,
  CheckCircle2,
  Filter,
  Calendar,
  X,
  Loader2,
} from 'lucide-react';

export function Courses() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Booking Modal State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('07:00 AM - 09:00 AM');
  const [bookingError, setBookingError] = useState(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);



  const minDate = new Date().toISOString().split('T')[0];

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.get('/courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load driving courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleOpenBooking = useCallback((course) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          bookingCourseId: course._id,
        },
      });
      return;
    }

    // Default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDateStr = tomorrow.toISOString().split('T')[0];

    setSelectedCourse(course);
    setBookingDate(defaultDateStr);
    setBookingTimeSlot('07:00 AM - 09:00 AM');
    setBookingError(null);
    setBookingSuccess(null);
    setIsBookingOpen(true);
  }, [isAuthenticated, navigate, location]);

  const handleCloseBooking = useCallback(() => {
    if (isSubmittingBooking) return;
    setIsBookingOpen(false);
    setSelectedCourse(null);
    setBookingError(null);
    setBookingSuccess(null);
  }, [isSubmittingBooking]);

  // Check if returning from login with a preserved booking course request
  useEffect(() => {
    if (location.state?.bookingCourseId && courses.length > 0 && user?.role === 'customer') {
      const courseToBook = courses.find((c) => c._id === location.state.bookingCourseId);
      if (courseToBook && courseToBook.status === 'active') {
        handleOpenBooking(courseToBook);
        // Clear history state so modal doesn't reopen upon refreshed render
        window.history.replaceState({}, document.title);
      }
    }
  }, [courses, location.state, user, handleOpenBooking]);

  // Escape key handler for accessible modal dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isBookingOpen && !isSubmittingBooking) {
        handleCloseBooking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookingOpen, isSubmittingBooking, handleCloseBooking]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate) {
      setBookingError('Please select a lesson start date.');
      return;
    }
    if (!bookingTimeSlot) {
      setBookingError('Please select a training time slot.');
      return;
    }
    if (!selectedCourse) return;

    const instructorId = selectedCourse.instructorId?._id || selectedCourse.instructorId;
    if (!instructorId) {
      setBookingError('Course does not currently have an assigned instructor.');
      return;
    }

    setIsSubmittingBooking(true);
    setBookingError(null);

    try {
      const payload = {
        courseId: selectedCourse._id,
        instructorId: typeof instructorId === 'string' ? instructorId : instructorId.toString(),
        schedule: {
          date: bookingDate,
          timeSlot: bookingTimeSlot,
        },
      };

      const result = await api.post('/bookings', payload);
      setBookingSuccess(result);
    } catch (err) {
      setBookingError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Client-side search and status filtering over real API data
  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      course.title?.toLowerCase().includes(term) ||
      course.description?.toLowerCase().includes(term) ||
      course.instructorId?.name?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'all' || course.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-customer">Licensed Curriculum</span>
          </div>
          <h1 className="page-title">Available Driving Courses</h1>
          <p className="page-subtitle">
            Explore certified practical lessons taught by accredited instructors across Kathmandu.
          </p>
        </div>

        {/* Toolbar: Search, Filter, Refresh */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            padding: '1rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', flex: '1', minWidth: '240px', maxWidth: '420px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--slate-400)',
                }}
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses or instructors..."
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                aria-label="Search courses"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label
              htmlFor="course-status-filter"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--slate-600)',
              }}
            >
              <Filter size={15} />
              Status:
            </label>
            <select
              id="course-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.5rem 0.85rem' }}
            >
              <option value="all">All Courses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>

            <button
              type="button"
              onClick={fetchCourses}
              disabled={loading}
              className="btn btn-outline"
              title="Refresh courses catalog"
              aria-label="Refresh courses catalog"
              style={{ padding: '0.5rem 0.85rem' }}
            >
              <RotateCw size={16} className={loading ? 'spinner' : ''} />
              <span style={{ fontSize: '0.875rem' }}>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{ textAlign: 'center', padding: '4rem 1rem' }}
            role="status"
            aria-live="polite"
          >
            <div
              className="spinner"
              style={{
                width: '36px',
                height: '36px',
                margin: '0 auto 1rem auto',
                borderWidth: '3px',
                borderColor: 'var(--primary-200)',
                borderTopColor: 'var(--primary-600)',
              }}
            />
            <p style={{ color: 'var(--slate-600)', fontSize: '0.975rem', fontWeight: 500, margin: 0 }}>
              Loading driving courses catalog...
            </p>
          </div>
        )}

        {/* Error State with Retry */}
        {!loading && error && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} style={{ color: 'var(--danger-600)' }} />
              <strong style={{ fontSize: '1rem' }}>Unable to load courses</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.925rem' }}>{error}</p>
            <button
              type="button"
              onClick={fetchCourses}
              className="btn btn-primary"
              style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}
            >
              <RotateCw size={15} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty Catalog State */}
        {!loading && !error && courses.length === 0 && (
          <div className="placeholder-box">
            <BookOpen className="placeholder-icon" />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--slate-800)' }}>
              No Courses Currently Available
            </h3>
            <p style={{ margin: '0 auto 1.5rem auto', maxWidth: '480px', fontSize: '0.95rem' }}>
              We are updating our seasonal driving curriculum. Please check back shortly or retry.
            </p>
            <button type="button" onClick={fetchCourses} className="btn btn-secondary">
              <RotateCw size={15} />
              <span>Reload Catalog</span>
            </button>
          </div>
        )}

        {/* Filtered Empty State */}
        {!loading && !error && courses.length > 0 && filteredCourses.length === 0 && (
          <div className="placeholder-box" style={{ padding: '2.5rem 1.5rem' }}>
            <Search className="placeholder-icon" style={{ color: 'var(--slate-400)', width: '2.5rem', height: '2.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--slate-800)' }}>
              No Matching Courses Found
            </h3>
            <p style={{ margin: '0 auto 1.25rem auto', maxWidth: '420px', fontSize: '0.925rem' }}>
              No courses matched your search &quot;{searchTerm}&quot; or status filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.875rem' }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <>
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> available courses
            </div>

            <div className="courses-grid">
              {filteredCourses.map((course) => {
                const statusKey = course.status || 'active';
                const isStatusActive = statusKey === 'active';

                return (
                  <article key={course._id} className="course-card">
                    <div className="course-header">
                      <h2 className="course-title">{course.title}</h2>
                      <span
                        className={`badge ${isStatusActive
                          ? 'badge-active'
                          : statusKey === 'draft'
                            ? 'badge-draft'
                            : 'badge-inactive'
                          }`}
                        title={`Course status: ${statusKey}`}
                      >
                        {isStatusActive ? 'Active' : statusKey}
                      </span>
                    </div>

                    <p className="course-desc">{course.description}</p>

                    <div className="course-meta">
                      <div className="course-meta-item">
                        <Clock size={16} className="course-meta-icon" aria-hidden="true" />
                        <span>
                          <strong>Duration:</strong> {course.durationHours} Hours
                        </span>
                      </div>

                      <div className="course-meta-item">
                        <User size={16} className="course-meta-icon" aria-hidden="true" />
                        <span>
                          <strong>Instructor:</strong>{' '}
                          {course.instructorId?.name || 'Certified Instructor'}
                        </span>
                      </div>

                      {course.instructorId?.email && (
                        <div className="course-meta-item">
                          <Mail size={16} className="course-meta-icon" aria-hidden="true" />
                          <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                            {course.instructorId.email}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="course-footer">
                      <div className="course-price">
                        <span className="course-price-label">Tuition Fee</span>
                        <span className="course-price-value">
                          Rs. {Number(course.price).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        {!isStatusActive ? (
                          <button
                            type="button"
                            disabled
                            className="btn btn-outline"
                            style={{ opacity: 0.6, cursor: 'not-allowed', fontSize: '0.85rem' }}
                          >
                            Unavailable
                          </button>
                        ) : !user || user.role === 'customer' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenBooking(course)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          >
                            <Calendar size={15} />
                            <span>Book Course</span>
                          </button>
                        ) : (
                          <span
                            className="badge"
                            style={{
                              background: 'var(--slate-100)',
                              color: 'var(--slate-600)',
                              border: '1px solid var(--slate-300)',
                              padding: '0.45rem 0.65rem',
                              fontSize: '0.75rem',
                            }}
                            title="Instructors and administrators manage courses via their dedicated portals"
                          >
                            {user.role === 'admin' ? 'Admin View' : 'Instructor View'}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {/* Accessible Booking Modal */}
        {isBookingOpen && selectedCourse && (
          <div
            className="modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseBooking();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
          >
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      padding: '0.5rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-50)',
                      color: 'var(--primary-600)',
                      display: 'inline-flex',
                    }}
                  >
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h2 id="booking-modal-title" className="modal-title">
                      {bookingSuccess ? 'Booking Confirmed' : 'Book Driving Course'}
                    </h2>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      {bookingSuccess
                        ? 'Your lesson request has been sent to the instructor.'
                        : 'Select your preferred starting schedule.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseBooking}
                  disabled={isSubmittingBooking}
                  className="modal-close-btn"
                  aria-label="Close booking modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Success View */}
              {bookingSuccess ? (
                <div>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '1.25rem 0 1.5rem 0',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'var(--success-50)',
                        color: 'var(--success-600)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--slate-900)' }}>
                      Lesson Scheduled Successfully!
                    </h3>
                    <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: '0.925rem' }}>
                      Your booking is now in <strong>pending</strong> status awaiting instructor confirmation.
                    </p>
                  </div>

                  <div className="booking-summary-box">
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Course:</span>
                      <span style={{ fontWeight: 600 }}>{selectedCourse.title}</span>
                    </div>
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Instructor:</span>
                      <span>{selectedCourse.instructorId?.name || 'Assigned Instructor'}</span>
                    </div>
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Start Date:</span>
                      <span>
                        {new Date(bookingDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Time Slot:</span>
                      <span>{bookingTimeSlot}</span>
                    </div>
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Tuition:</span>
                      <span style={{ color: 'var(--primary-600)' }}>
                        Rs. {Number(selectedCourse.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="alert alert-info" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    A confirmation notification has been dispatched to your account. You can view all upcoming lessons and payment status in your customer dashboard.
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      className="btn btn-outline"
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="btn btn-primary"
                    >
                      Go to My Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleConfirmBooking} noValidate>
                  {/* Course Summary Box */}
                  <div className="booking-summary-box">
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Selected Course:</span>
                      <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{selectedCourse.title}</span>
                    </div>
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Instructor:</span>
                      <span>{selectedCourse.instructorId?.name || 'Assigned Instructor'}</span>
                    </div>
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Total Training:</span>
                      <span>{selectedCourse.durationHours} Hours</span>
                    </div>
                    <div className="booking-summary-row">
                      <span style={{ color: 'var(--slate-500)' }}>Tuition Fee:</span>
                      <span style={{ color: 'var(--primary-600)' }}>
                        Rs. {Number(selectedCourse.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Backend Error Alert */}
                  {bookingError && (
                    <div className="alert alert-danger" role="alert" aria-live="polite">
                      <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>{bookingError}</div>
                    </div>
                  )}

                  {/* Schedule Date */}
                  <div className="form-group">
                    <label htmlFor="booking-date" className="form-label">
                      Training Start Date
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      min={minDate}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      disabled={isSubmittingBooking}
                      className="form-input"
                      required
                    />
                    <span className="form-helper">
                      Select your desired date to begin lessons with {selectedCourse.instructorId?.name || 'the instructor'}.
                    </span>
                  </div>

                  {/* Time Slot */}
                  <div className="form-group">
                    <label htmlFor="booking-timeslot" className="form-label">
                      Daily Training Time Slot
                    </label>
                    <select
                      id="booking-timeslot"
                      value={bookingTimeSlot}
                      onChange={(e) => setBookingTimeSlot(e.target.value)}
                      disabled={isSubmittingBooking}
                      className="form-select"
                      required
                    >
                      <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM (Early Morning Shift)</option>
                      <option value="09:30 AM - 11:30 AM">09:30 AM - 11:30 AM (Mid-Morning Shift)</option>
                      <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM (Afternoon Shift)</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Late Afternoon Shift)</option>
                    </select>
                  </div>

                  {/* Modal Actions */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      disabled={isSubmittingBooking}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="btn btn-primary"
                    >
                      {isSubmittingBooking ? (
                        <>
                          <Loader2 size={16} className="spinner" style={{ borderWidth: '2px' }} />
                          <span>Confirming Booking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Confirm & Book</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;


