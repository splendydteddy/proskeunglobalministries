import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MAIN_CAMPUS } from '../constants/site';
import './About.css';

const galleryGrid = [
  { img: '/11.jpg', alt: 'Praise and Worship' },
  { img: '/12.jpg', alt: 'Word Ministration' },
  { img: '/13.jpg', alt: 'Worship Moments' },
  { img: '/14.jpg', alt: 'Prayer Altar' },
  { img: '/15.jpg', alt: 'Fellowship Family' },
  { img: '/16.jpg', alt: 'Community Outreach' },
];

const About = () => {
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
    <div className="about-page">
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
          <li><Link to="/about" onClick={() => setIsNavOpen(false)} className="active-nav-link">About Us</Link></li>
          <li><Link to="/#schedule" onClick={() => setIsNavOpen(false)}>Schedule</Link></li>
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

      {/* 1. HERO BANNER OVERLAY */}
      <header className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>About Proskeun Global Ministry</h1>
          <p className="hero-subtext">Atmosphere of Joy and Fire</p>
        </div>
      </header>

      {/* 2. ABOUT OUR CHURCH INTRO */}
      <section className="about-intro-section">
        <div className="about-container">
          <h2 className="section-title text-center">About Our Church</h2>
          <p className="about-intro-lead text-center">
            Proskeun Global Ministry: A dynamic household of God committed to making all men see Christ, experience the power of the Spirit, and step into His finished works.
          </p>

          <div className="about-intro-body">
            <p>
              Proskeun Global Ministry is a Christ-centered, Spirit-led assembly built on uncompromised biblical truth, intense prayer, dynamic worship, and apostolic ministration. We exist to raise believers who are spiritually grounded, morally upright, and empowered to transform their generation.
            </p>
            <p>
              We believe church is not merely a weekly gathering, but a spiritual training ground for Kingdom ambassadors. Through sound teaching, house cell fellowships, and community outreach, we equip men and women to walk in victory and impact cities with the gospel.
            </p>
          </div>
        </div>
      </section>

      {/* 3. VISION, MISSION, & CORE VALUES */}
      <section className="about-pillars-section">
        <div className="about-container">
          <div className="pillars-grid">
            <div className="pillar-col">
              <h3 className="pillar-title">OUR VISION</h3>
              <p className="pillar-text">
                To Make all Men see Christ and walk in His Kingdom truth.
              </p>
            </div>

            <div className="pillar-col">
              <h3 className="pillar-title">OUR MISSION</h3>
              <p className="pillar-text">
                To raise a spirit-filled generation and spread the gospel through:
              </p>
              <ul className="pillar-list">
                <li>Demonstrating the saving grace and gospel of Jesus Christ.</li>
                <li>Revealing the authority of Christ through sound teaching, intense prayer, and a transformed walk of faith.</li>
              </ul>
            </div>

            <div className="pillar-col">
              <h3 className="pillar-title">CORE VALUES</h3>
              <p className="pillar-text">
                Preaching, Sound Teaching, Spirit-led Praise, Intercessory Prayer & Kingdom Fellowship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="about-divider"></div>

      {/* 4. PHOTO GRID SHOWCASE */}
      <section className="about-gallery-section">
        <div className="about-container">
          <div className="about-photo-grid">
            {galleryGrid.map((item, idx) => (
              <div key={idx} className="photo-card">
                <img 
                  src={item.img} 
                  alt={item.alt} 
                  loading="lazy" 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/proskeun.jpg'; }} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR STORY SECTION */}
      <section className="about-story-section">
        <div className="about-container story-flex">
          <div className="story-content">
            <span className="story-tag">OUR STORY</span>
            <h2>Proskeun Global Ministry</h2>
            <p>
              Founded on the mandate of spiritual revival and apostolic truth, Proskeun Global Ministry continues to grow as a vibrant sanctuary of prayer, praise, and sound wisdom. Our commission remains centered on raising believers on fire for God and establishing His tangible presence in homes and cities.
            </p>
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP FEATURE CARD */}
      <section className="about-leadership-section">
        <div className="about-container">
          <div className="leadership-banner">
            <div className="leadership-info">
              <span className="leadership-num">01</span>
              <h3>Leadership</h3>

              <div className="leader-badge">Lead Pastor</div>

              <h2 className="leader-name">Pastoral Leadership</h2>
              <p className="leader-desc">
                Guiding the assembly with apostolic vision, uncompromised teaching, and spiritual oversight. Dedicated to building lives, cultivating prayer altars, and advancing the Kingdom of God.
              </p>

              <Link to="/#contact" className="btn-leader-action">
                Connect With Pastors →
              </Link>
            </div>

            <div className="leadership-photo-box">
              <img 
                src="/17.png" 
                alt="Proskeun Lead Pastor" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/17png'; }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. GET IN TOUCH CARDS */}
      <section className="about-contact-section">
        <div className="about-container">
          <div className="contact-header text-center">
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
                <span className="card-subnote">Send us an inquiry</span>
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
                <h4>Service Hours</h4>
                <p>Sundays: Starts 7:30 AM</p>
                <span className="card-subnote">Midweek: Wednesdays @ 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER WITH HOMEPAGE STYLE AND BACKGROUND */}
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
              <li><Link to="/#schedule">Service Schedule</Link></li>
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
          <p>© 2026 Proskeun Global Ministry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;