import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="footer-brand">
              <Car size={22} color="#3b82f6" />
              <span>JZ Driving School</span>
            </div>
            <p className="footer-text">
              Certified professional driving instruction. We prepare you for safe, confident driving and official road testing.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">All Courses</Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">Student Portal</Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">Instructor Registration</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Contact & Support</h4>
            <ul className="footer-links">
              <li className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} />
                <span>+977 9800000000</span>
              </li>
              <li className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} />
                <span>support@jzdriving.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Government Accredited & Certified Driving Instructors</span>
          </div>
          <div>
            &copy; {currentYear} JZ Driving School. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
