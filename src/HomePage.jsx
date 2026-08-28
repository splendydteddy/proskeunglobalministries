import React, { useState, useEffect } from 'react';
import './HomePage.css';

const scheduleData = [
  { day: 'Monday', title: 'General Fasting Day', type: 'Spiritual Discipline', time: 'All Day' },
  { day: 'Wednesday', title: 'Midweek Service & Bible Study', type: 'Word & Worship', time: '5:00 PM – 7:00 PM' },
  { day: 'Thursday', title: 'Home Cell Meetings', type: 'Fellowship', time: '4:00 PM – 5:00 PM' },
  { day: 'Friday', title: 'Prayer Session', type: 'Intercession', time: '5:00 PM – 6:00 PM' },
  { day: 'Saturday', title: 'Evangelism', type: 'Outreach', time: '4:00 PM' },
  { day: 'Sunday', title: 'Glorious Service', type: 'Main Service', time: "Starts 7:30 AM (Believers' Institute)", highlight: true },
];

const cellsData = [
  { 
    name: '19th Street Cell', 
    location: '19th Street Center, BDPA, Ugbowo, Benin City', 
    leader: 'Bro. Emmanuel',
    details: 'A vibrant home cell focused on word study, intercession, and spiritual growth in the BDPA community.' 
  },
  { 
    name: 'Uwasota Cell', 
    location: 'The Proskeun Center, 15 Nova Road, Opp Uwasota Busstop Ugbowo, Benin city.', 
    leader: 'Pastor Chinonso',
    details: 'for inquiries, contact: +2347034539013'
  },
  { 
    name: 'UNIBEN Cell', 
    location: 'Behind Auditorium university of Benin,', 
    leader: 'Pastor Gershom',
    details: 'for inquiries, contact: +2348149413186' 
  },
  { 
    name: 'Precious Palm Cell', 
    location: 'Precious Palm Royal Hotel Area, Ugbowo', 
    leader: 'Bro. Daniel',
    details: 'Fostering tight-knit fellowship and apostolic teaching for young adults and families in the Precious Palm axis.' 
  },
  { 
    name: 'Uselu Cell', 
    location: 'Uselu Market Axis, Benin City', 
    leader: 'Sis. Grace',
    details: 'Dedicated to outreach, fervent intercession, and discipleship in the Uselu neighborhood.' 
  },
];

const faqData = [
  {
    q: 'What should I expect on my first visit?',
    a: 'Expect an atmosphere filled with sincere worship, clear apostolic teaching, intense prayer, and a warm community welcoming you.'
  },
  {
    q: 'What time does the Sunday Service start?',
    a: "Believers' Institute starts at 7:30 AM, followed immediately by the main Glorious Service."
  },
  {
    q: 'How do I join a House Cell near me?',
    a: 'Check our House Cell Centers list above to find a location in your axis, or send us a message through the contact form.'
  }
];

const HomePage = () => {
  const [showSundayModal, setShowSundayModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Smooth scroll handler & auto-closes mobile navigation drawer
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsNavOpen(false); // Close mobile drawer menu
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Lock body scroll and handle Escape key listener when any modal is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSundayModal(false);
        setSelectedCell(null);
      }
    };

    if (showSundayModal || selectedCell) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSundayModal, selectedCell]);

  return (
    <div className="church-site">
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

        {/* Mobile Hamburger Toggle Button */}
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
          <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</a></li>
          <li><a href="#schedule" onClick={(e) => handleNavClick(e, 'schedule')}>Schedule</a></li>
          <li><a href="#cells" onClick={(e) => handleNavClick(e, 'cells')}>House Cells</a></li>
          <li><a href="#media" onClick={(e) => handleNavClick(e, 'media')}>Media</a></li>
          <li><a href="#giving" onClick={(e) => handleNavClick(e, 'giving')}>Giving</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
        </ul>

        <div className="nav-cta">
          <button onClick={() => setShowSundayModal(true)} className="btn-primary">Join Us Sunday</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section 
        id="home" 
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6, 15, 38, 0.75) 0%, rgba(10, 26, 60, 0.90) 100%), url('/path-to-your-congregation-image.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-content">
          <span className="badge">Welcome to Proskeun</span>
          <h1>Proskeun Global Ministry</h1>
          <h2>Atmosphere of Joy and Fire</h2>
          <p>
            Experience dynamic worship, sound apostolic teaching, and the tangible presence of God. Join a vibrant community moving in spiritual fervor and joy.
          </p>
          <div className="hero-actions">
            <button onClick={() => setShowSundayModal(true)} className="btn-primary">Join Us This Sunday</button>
            <a href="#cells" onClick={(e) => handleNavClick(e, 'cells')} className="btn-secondary">Find a Cell Near You</a>
          </div>
        </div>
      </section>

      {/* RECAP SPOTLIGHT */}
      <section id="ablaze" className="recap-banner">
        <div className="recap-card">
          <div className="recap-details">
            <span className="recap-tag">Recap Spotlight</span>
            <h3>Concluded: The Ablaze Conference</h3>
            <p>Catch up on powerful ministrations, testimonies, and moments from our recent gathering.</p>
          </div>
          <div className="recap-action">
            <a 
              href="https://www.tiktok.com/@proskeunministry?_r=1&_t=ZS-98xLb1Id5xX" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-light"
            >
              Watch Highlights →
            </a>
          </div>
        </div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section id="about" className="about-section">
        <div className="section-header">
          <h2>Our Vision & Leadership</h2>
          <p>Proskeun Global Ministry is built on the foundation of sincere worship, word accuracy, prayer, and authentic community.</p>
        </div>

        <div className="leadership-cards">
          <div className="leader-card">
            <div className="pastor-bg-container">
              <img 
                src="/IMG_9565.WEBP" 
                alt="Pastor Osasumwen Eghianruwa" 
                className="pastor-img"
                loading="lazy"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src="https://via.placeholder.com/400x500?text=Pastor+Osas"; 
                }} 
              />
            </div>
            <div className="leader-card-content">
              <span className="role">Head Pastor</span>
              <h3>Pastor Osasumwen Eghianruwa</h3>
              <p>Leading Proskeun Global Ministry with apostolic passion, raising believers operating in spiritual fire, joy, and structural maturity.</p>
            </div>
          </div>

          <div className="leader-card">
            <div className="pastor-bg-container">
              <img 
                src="/IMG_9572.WEBP" 
                alt="Pastor Joy Eghianruwa" 
                className="pastor-img"
                loading="lazy"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src="https://via.placeholder.com/400x500?text=Pastor+Joy"; 
                }} 
              />
            </div>
            <div className="leader-card-content">
              <span className="role">Resident Pastor</span>
              <h3>Pastor Joy Eghianruwa</h3>
              <p>Serving the body with grace, shepherding the local congregation, and driving key spiritual and administrative arms of the ministry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WEEKLY SCHEDULE */}
      <section id="schedule" className="schedule-section">
        <div className="section-header">
          <h2>Weekly Worship Schedule</h2>
          <p>Join us live across our various weekly gatherings and services.</p>
        </div>

        <div className="schedule-grid">
          {scheduleData.map((item) => (
            <div key={item.day} className={`schedule-item${item.highlight ? ' highlight' : ''}`}>
              <span className="day">{item.day}</span>
              <h4>{item.title}</h4>
              <p>Type: {item.type}</p>
              <p>Time: {item.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOUSECELLS SECTION */}
      <section id="cells" className="cells-section">
        <div className="section-header">
          <h2>House Cell Centers</h2>
          <p>Every Thursday from 4:00 PM – 5:00 PM. Click any center for full location details.</p>
        </div>

        <div className="cells-grid">
          {cellsData.map((cell) => (
            <div 
              key={cell.name} 
              className="cell-card clickable" 
              onClick={() => setSelectedCell(cell)}
            >
              <span className="icon" aria-hidden="true">📍</span>
              <h3>{cell.name}</h3>
              <p>Location: {cell.location}</p>
              <span className="click-hint">View Directions →</span>
            </div>
          ))}
        </div>
      </section>

      {/* MEDIA SECTION */}
      <section id="media" className="media-section">
        <div className="section-header">
          <h2>Sermons & Media</h2>
          <p>All pastors messages are available on the telegram channel.</p>
        </div>
        <div className="media-card">
          <div className="media-info">
            <span className="recap-tag">Audio & Messages</span>
            <h3>Telegram Audio Library</h3>
            <p>Access full teachings, sermon series, and ministration recordings directly on Telegram.</p>
          </div>
          <a 
            href="https://t.me/YOUR_TELEGRAM_CHANNEL_LINK" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-telegram"
          >
            Join Telegram Channel 📲
          </a>
        </div>
      </section>

      {/* GIVING SECTION */}
      <section id="giving" className="giving-section">
        <div className="section-header">
          <h2>Partner & Give</h2>
          <p>Support the gospel spread and operations of Proskeun Global Ministry.</p>
        </div>
        <div className="giving-grid">
          <div className="giving-card">
            <span className="icon" aria-hidden="true">💳</span>
            <h3>Bank Transfer</h3>
            <p><strong>Bank:</strong> [Bank Name]</p>
            <p><strong>Account Name:</strong> Proskeun Global Ministry</p>
            <p><strong>Account Number:</strong> [0000000000]</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2>Prayer & Counseling</h2>
          <p>Connect with our pastoral team for guidance, prayer, and one-on-one counseling.</p>
        </div>

        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="user-fullname">Full Name</label>
            <input id="user-fullname" type="text" placeholder="Full Name" required />
          </div>

          <div className="form-group">
            <label htmlFor="user-email">Email Address</label>
            <input id="user-email" type="email" placeholder="Email Address" required />
          </div>

          <div className="form-group">
            <label htmlFor="user-message">Prayer Request / Inquiry</label>
            <textarea id="user-message" placeholder="Write your prayer request or counseling inquiry here..." rows="5" required></textarea>
          </div>

          <button type="submit" className="btn-primary">Send Request</button>
        </form>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="faq-section">
        <div className="section-header">
          <h2>First-Time Visitors FAQ</h2>
          <p>Common questions answered to make your first visit smooth.</p>
        </div>
        <div className="faq-grid">
          {faqData.map((item, index) => (
            <div key={index} className="faq-card">
              <h4>{item.q}</h4>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUNDAY SERVICE MODAL */}
      {showSundayModal && (
        <div className="modal-overlay" onClick={() => setShowSundayModal(false)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowSundayModal(false)} aria-label="Close modal">✕</button>
            <h2>Join Us This Sunday</h2>
            <p className="modal-subtitle">Starts 7:30 AM | Believers' Institute & Main Glorious Service</p>
            
            <div className="modal-gallery">
              <img src="/assets/church-1.jpg" alt="Church Service" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x200?text=Church+Interior"; }} />
              <img src="/assets/church-2.jpg" alt="Church Worship" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x200?text=Worship+Service"; }} />
            </div>

            <h3>Location & Directions</h3>
            <p className="modal-address">📍 The Proskeun Center, 15 Nova Road, Opp Uwasota Busstop Ugbowo, Benin city.</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("The Proskeun Center, 15 Nova Road, Opp Uwasota Busstop Ugbowo, Benin city")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary modal-directions-btn"
            >
              Get Directions on Google Maps 📍
            </a>
          </div>
        </div>
      )}

      {/* HOMECELL LOCATION MODAL */}
      {selectedCell && (
        <div className="modal-overlay" onClick={() => setSelectedCell(null)} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCell(null)} aria-label="Close modal">✕</button>
            <h2>{selectedCell.name}</h2>
            
            <p className="cell-modal-location" style={{ marginTop: '0.8rem', fontSize: '0.98rem' }}>
              📍 <strong>Location:</strong> {selectedCell.location}
            </p>
            
            {selectedCell.leader && (
              <p style={{ marginTop: '0.4rem', fontSize: '0.95rem', color: 'var(--gold-bright)' }}>
                👤 <strong>Cell Leader:</strong> {selectedCell.leader}
              </p>
            )}

            {selectedCell.details && (
              <p className="cell-modal-details" style={{ marginTop: '0.8rem', color: 'var(--white-dim)' }}>
                {selectedCell.details}
              </p>
            )}

            <div className="cell-modal-time-box" style={{ marginTop: '1.2rem' }}>
              <p><strong>Meeting Time:</strong> Thursdays @ 4:00 PM – 5:00 PM</p>
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCell.location)}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary modal-directions-btn"
              style={{ marginTop: '1.2rem' }}
            >
              Open Location in Maps 🗺️
            </a>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>PROSKEUN GLOBAL MINISTRY</h3>
            <p>"Atmosphere of Joy and Fire"</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</a></li>
              <li><a href="#schedule" onClick={(e) => handleNavClick(e, 'schedule')}>Service Schedule</a></li>
              <li><a href="#cells" onClick={(e) => handleNavClick(e, 'cells')}>House Cells</a></li>
              <li><a href="#giving" onClick={(e) => handleNavClick(e, 'giving')}>Giving</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Social Handles</h4>
            <p>Follow <strong>@Proskeun global ministries</strong></p>
            <ul className="social-links">
              <li>
                <a href="https://www.tiktok.com/@proskeunministry?_r=1&_t=ZS-98xLb1Id5xX" target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </li>
              <li>
                <a href="https://t.me/YOUR_TELEGRAM_CHANNEL_LINK" target="_blank" rel="noreferrer">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=61567927055011" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/YOUR_INSTAGRAM_HANDLE" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Proskeun Global Ministry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;