import { BookOpen } from 'lucide-react';

export function Courses() {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Available Driving Courses</h1>
          <p className="page-subtitle">
            Browse our licensed manual, automatic, and defensive driving programs.
          </p>
        </div>

        <div className="placeholder-box">
          <BookOpen className="placeholder-icon" />
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--slate-800)' }}>Course Catalog Placeholder</h3>
          <p style={{ margin: '0 auto 1.5rem auto', maxWidth: '500px', fontSize: '0.95rem' }}>
            Interactive course listings, pricing, instructor profiles, and booking modals will be connected to the backend courses API in Part 4.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Courses;
