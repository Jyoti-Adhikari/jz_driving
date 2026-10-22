import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // 'customer' or 'instructor'
    city: 'Kathmandu',
    country: 'Nepal',
    // Instructor specific
    experience: 0,
    specialization: 'Manual & Automatic Transmission',
    availabilityMorning: true,
    availabilityAfternoon: true,
    availabilityEvening: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Full name cannot exceed 50 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Phone number must be exactly 10 digits (e.g. 9800000000)';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (formData.role === 'instructor') {
      if (formData.experience < 0 || isNaN(formData.experience)) {
        errors.experience = 'Experience must be 0 or more years';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        address: {
          city: formData.city.trim(),
          country: formData.country.trim() || 'Nepal',
        },
      };

      if (formData.role === 'instructor') {
        const availability = [];
        if (formData.availabilityMorning) availability.push('Morning');
        if (formData.availabilityAfternoon) availability.push('Afternoon');
        if (formData.availabilityEvening) availability.push('Evening');

        payload.profile = {
          experience: Number(formData.experience) || 0,
          specialization: formData.specialization.trim() || 'General Driving Instruction',
          availability: availability.length > 0 ? availability : ['Morning', 'Afternoon'],
        };
      }

      const user = await register(payload);

      // Redirect to appropriate dashboard upon successful account creation
      if (user.role === 'instructor') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please review your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem 0 3rem 0' }}>
      <div className="container" style={{ maxWidth: '540px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '0.75rem',
                background: 'var(--success-50)',
                color: 'var(--success-600)',
                borderRadius: '50%',
                marginBottom: '1rem',
              }}
            >
              <UserPlus size={26} />
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>
              Create Your Account
            </h1>
            <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: '0.925rem' }}>
              Join JZ Driving as a learner or an accredited instructor.
            </p>
          </div>

          {/* Account Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--slate-100)', padding: '0.35rem', borderRadius: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`btn ${formData.role === 'customer' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none', padding: '0.6rem' }}
            >
              Student / Learner
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('instructor')}
              className={`btn ${formData.role === 'instructor' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none', padding: '0.6rem' }}
            >
              Driving Instructor
            </button>
          </div>

          {serverError && (
            <div className="alert alert-danger" role="alert" aria-live="polite">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{serverError}</div>
            </div>
          )}

          {formData.role === 'instructor' && (
            <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary-600)' }} />
              <div>
                <strong>Instructor Notice:</strong> Instructor accounts are created with pending approval and require administrator activation before receiving assigned student bookings.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="name"
                placeholder="e.g. Maya Gurung"
                className={`form-input ${fieldErrors.name ? 'input-error' : ''}`}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                required
              />
              {fieldErrors.name && (
                <span id="name-error" className="form-error">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  required
                />
                {fieldErrors.email && (
                  <span id="email-error" className="form-error">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone" className="form-label">
                  Phone (10 Digits)
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="tel"
                  placeholder="9800000000"
                  maxLength={10}
                  className={`form-input ${fieldErrors.phone ? 'input-error' : ''}`}
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                  required
                />
                {fieldErrors.phone && (
                  <span id="phone-error" className="form-error">
                    {fieldErrors.phone}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  placeholder="Min 6 characters"
                  className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'pwd-error' : undefined}
                  required
                />
                {fieldErrors.password && (
                  <span id="pwd-error" className="form-error">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="reg-confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className={`form-input ${fieldErrors.confirmPassword ? 'input-error' : ''}`}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? 'cpwd-error' : undefined}
                  required
                />
                {fieldErrors.confirmPassword && (
                  <span id="cpwd-error" className="form-error">
                    {fieldErrors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="reg-city" className="form-label">
                  City
                </label>
                <input
                  id="reg-city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Kathmandu"
                  className={`form-input ${fieldErrors.city ? 'input-error' : ''}`}
                  aria-invalid={!!fieldErrors.city}
                  aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                  required
                />
                {fieldErrors.city && (
                  <span id="city-error" className="form-error">
                    {fieldErrors.city}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reg-country" className="form-label">
                  Country
                </label>
                <input
                  id="reg-country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Nepal"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Instructor Specific Profile Fields */}
            {formData.role === 'instructor' && (
              <div style={{ padding: '1rem', background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: '0.5rem', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: 'var(--slate-800)' }}>
                  Instructor Professional Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="reg-experience" className="form-label">
                      Experience (Years)
                    </label>
                    <input
                      id="reg-experience"
                      type="number"
                      min={0}
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`form-input ${fieldErrors.experience ? 'input-error' : ''}`}
                    />
                    {fieldErrors.experience && (
                      <span className="form-error">{fieldErrors.experience}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-spec" className="form-label">
                      Specialization
                    </label>
                    <input
                      id="reg-spec"
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="e.g. Manual, Highway, Defensive"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Weekly Availability</span>
                  <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.35rem' }}>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="availabilityMorning"
                        checked={formData.availabilityMorning}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      Morning
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="availabilityAfternoon"
                        checked={formData.availabilityAfternoon}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      Afternoon
                    </label>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="availabilityEvening"
                        checked={formData.availabilityEvening}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      Evening
                    </label>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--slate-200)', paddingTop: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
