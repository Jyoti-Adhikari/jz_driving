import { Link } from 'react-router-dom';
import { Award, CalendarCheck, Shield, ChevronRight } from 'lucide-react';

export function Home() {
  return (
    <div className="page-container">
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '3rem 1rem 4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
          <span className="badge badge-customer" style={{ marginBottom: '1.25rem', padding: '0.35rem 0.85rem' }}>
            Professional Driving Academy
          </span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 1.25rem 0', lineHeight: 1.2 }}>
            Master the Road with Confidence & Skill
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--slate-600)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Top-rated manual and automatic driving courses tailored for beginners, highway safety, and parking mastery. Certified instructors and modern vehicles.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              <span>Explore Courses</span>
              <ChevronRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-outline" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              <span>Create Account</span>
            </Link>
          </div>
        </div>

        {/* Value Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.65rem', background: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: '0.5rem' }}>
                <Award size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Certified Instructors</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Learn from government-accredited driving tutors with years of defensive and real-world city driving experience.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.65rem', background: 'var(--success-50)', color: 'var(--success-600)', borderRadius: '0.5rem' }}>
                <CalendarCheck size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Flexible Scheduling</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Pick morning, afternoon, or evening lesson slots that easily fit around your work and study routine.
            </p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.65rem', background: '#fef3c7', color: 'var(--warning-600)', borderRadius: '0.5rem' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Dual-Control Vehicles</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Train safely in modern dual-pedal vehicles inspected regularly for the highest passenger and driver safety standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
