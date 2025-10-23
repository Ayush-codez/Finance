import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo and Description */}
          <div className="footer-section">
            <div className="footer-logo">
              <Building size={32} />
              <span className="footer-logo-text">LoanCompare</span>
            </div>
            <p className="footer-description">
              Your trusted platform for comparing and finding the perfect loan for your organization. 
              We help connect businesses with the right financing solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search">Search Loans</Link></li>
              <li><Link to="/eligibility">Eligibility Check</Link></li>
              <li><Link to="/compare">Compare Loans</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          {/* Loan Categories */}
          <div className="footer-section">
            <h3 className="footer-title">Loan Categories</h3>
            <ul className="footer-links">
              <li><Link to="/search?category=startup">Startup Loans</Link></li>
              <li><Link to="/search?category=sme">SME Loans</Link></li>
              <li><Link to="/search?category=ngo">NGO Funding</Link></li>
              <li><Link to="/search?category=education">Education Loans</Link></li>
              <li><Link to="/search?category=agriculture">Agriculture Loans</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@loancompare.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 LoanCompare. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy" className="footer-link">Privacy Policy</a>
              <a href="#terms" className="footer-link">Terms of Service</a>
              <a href="#disclaimer" className="footer-link">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
