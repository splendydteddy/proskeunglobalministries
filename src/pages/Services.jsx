import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const MAIN_CAMPUS = {
  display: 'The Proskeun Center, 15 Nova Road, Opp Uwasota Busstop, Ugbowo, Benin City.'
};

const Services = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isNavOpen]);

  return (
    <div className="services-page">
      {/* BACKGROUND WATERMARK */}
      <div className="site-bg-watermark"></div>

      {isNavOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      {/* CLEAN WHITE NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <img 
            src="/logo.png" 
            alt="Proskeun Global Ministry Logo" 
            className="brand-logo" 
            loading="lazy"
          />

          <div className="logo-text">
            <span className="brand-name">PROSKEUN</span>
            <span className="brand-sub">GLOBAL MINISTRY</span>
          </div>
        </div>

        <button 
          className={`mobile-menu-toggle ${isNavOpen ? 'active' : ''}`}
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isNavOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <ul className={`nav-links ${isNavOpen ? 'nav-active' : ''}`}>
          <li><Link to="/" onClick={() => setIsNavOpen(false)}>Home</Link></li>
          <li><Link to="/about" onClick={() => setIsNavOpen(false)}>About Us</Link></li>
          <li><Link to="/services" onClick={() => setIsNavOpen(false)} className="active-nav-link">Services</Link></li>
          <li><Link to="/#cells" onClick={() => setIsNavOpen(false)}>Cells</Link></li>
          <li><Link to="/#media" onClick={() => setIsNavOpen(false)}>Media</Link></li>
          <li><Link to="/#ministries" onClick={() => setIsNavOpen(false)}>Ministries</Link></li>
          <li><Link to="/#gallery" onClick={() => setIsNavOpen(false)}>Gallery</Link></li>
          <li><Link to="/#giving" onClick={() => setIsNavOpen(false)}>Giving</Link></li>
          <li><Link to="/#contact" onClick={() => setIsNavOpen(false)}>Contact</Link></li>
          <li><Link to="/login" onClick={() => setIsNavOpen(false)} className="nav-pastor-portal">🔑 Pastor's Portal</Link></li>
        </ul>

        <div className="nav-cta">
          <Link to="/#contact" className="btn-primary">Join Us Sunday</Link>
        </div>
      </nav>

      {/* HERO BANNER OVERLAY */}
      <header className="services-hero">
        <div className="services-hero-overlay"></div>
        <div className="services-hero-content">
          <h1>Service Times & Worship</h1>
          <p className="hero-subtext">Atmosphere of Joy and Fire</p>
        </div>
      </header>

      {/* SERVICE TIMES SECTION */}
      <section className="service-times-section">
        <div className="services-container">
          <div className="services-header text-center">
            <h2>Service Times</h2>
            <p>Come as you are and experience the power of God in our welcoming assembly.</p>
          </div>

          <div className="services-cards-grid">
            <div className="service-card">
              <div className="service-icon">🕒</div>
              <h3>Sunday Divine Celebration</h3>
              <div className="service-time-badge">7:30 AM</div>
              <p>Join us for an uplifting morning of intense worship, prayer, prophetic ministration, and sound biblical teaching.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">📅</div>
              <h3>Wednesday Word & Fire Service</h3>
              <div className="service-time-badge">5:00 PM</div>
              <p>Midweek spiritual recharge centered on deep scripture study, intercessory prayer, and apostolic empowerment.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">👥</div>
              <h3>House Cell Gatherings</h3>
              <div className="service-time-badge">Weekly Fellowships</div>
              <p>Close-knit community centers across Benin City focused on fellowship, mentorship, and building spiritual altars.</p>
            </div>
          </div>

          {/* CAMPUS LOCATION CARD */}
          <div className="location-card">
            <div className="location-icon">📍</div>
            <div className="location-info">
              <h3>Proskeun Global Ministry Location</h3>
              <p>{MAIN_CAMPUS.display}</p>
            </div>
            <a 
              href="https://maps.google.com/?q=The+Proskeun+Center+15+Nova+Road+Opp+Uwasota+Busstop+Ugbowo+Benin+City" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-directions"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </section>

      {/* GET IN TOUCH SECTION */}
      <section className="services-contact-section">
        <div className="services-container">
          <div className="services-header text-center">
            <h2>Get In Touch</h2>
            <p>We&apos;d love to hear from you. Reach out with any questions or to learn more about our church family.</p>
          </div>

          <div className="contact-cards-grid">
            <div className="contact-info-card">
              <div className="contact-card-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+234 703 968 9755</p>
                <span className="card-subnote">Call or message anytime</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-card-icon">✉️</div>
              <div>
                <h4>Email</h4>
                <p>proskeunglobal@gmail.com</p>
                <span className="card-subnote">Send us a message</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-card-icon">📍</div>
              <div>
                <h4>Address</h4>
                <p>{MAIN_CAMPUS.display}</p>
                <span className="card-subnote">Come worship with us</span>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-card-icon">⏰</div>
              <div>
                <h4>Office Hours</h4>
                <p>Mon - Fri: 9:00 AM - 4:00 PM</p>
                <span className="card-subnote">Always Open for Prayer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="site-footer-overlay"></div>
        <div className="footer-content">
          <div className="footer-info">
            <h3>PROSKEUN GLOBAL MINISTRY</h3>
            <p>&quot;Atmosphere of Joy and Fire&quot;</p>
            <p className="footer-address">📍 {MAIN_CAMPUS.display}</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/#cells">House Cells</Link></li>
              <li><Link to="/#ministries">Ministries</Link></li>
              <li><Link to="/#gallery">Gallery</Link></li>
              <li><Link to="/#giving">Giving</Link></li>
              <li><Link to="/login">Pastor&apos;s Portal</Link></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Connect With Us</h4>
            <ul className="social-links-grid">
              <li>
                <a 
                  href="https://www.tiktok.com/@proskeunministry?_r=1&_t=ZS-98xLb1Id5xX" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-link-item"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.69 6.33 6.33 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.33V9.17a8.21 8.21 0 0 0 4.93 1.58v-3.48a4.85 4.85 0 0 1-1-.58z"/></svg>
                  <span>TikTok</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-link-item"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-link-item"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-link-item"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span>YouTube</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Proskeun Global Ministry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Services;