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
    leader: 'Pastor Ibrahim',
    details: 'for inquiries, contact: +2347039689755'
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
    name: 'Uselu Cell', 
    location: 'Uselu Market Axis, Benin City', 
    leader: 'Pastor Favour',
    details: 'for inquiries, contact: +2349065697493' 
  },
];
const ministriesData = [
  { 
    title: 'Choir', 
    tag: 'Worship & Sound',
    icon: '🔥',
    desc: 'Setting the atmosphere for divine encounters through spirit-led praise and deep worship.',
    time: 'Rehearsals: Saturdays, 4:00 PM',
    bg: '/choristers.jpg'
  },
  { 
    title: 'Technical', 
    tag: 'Technical & Sound',
    icon: '🎛️', 
    desc: 'Managing the sound systems, acoustics, and stage tech to ensure an uninterrupted flow of service.',
    time: 'Service: Sundays',
    bg: '/technical.jpg'
  },
  { 
    title: 'Media', 
    tag: 'Media & Broadcast',
    icon: '💻', 
    desc: 'Leveraging digital tools, audio-visual production, and streaming to broadcast the gospel globally.',
    time: 'Service: Sundays',
    bg: '/media.jpg'
  },
  { 
    title: 'Ushering', 
    tag: 'Hospitality',
    icon: '🤝', 
    desc: 'Creating an orderly, warm, and welcoming environment for every guest and member entering the sanctuary.',
    time: 'Service: Sundays',
    bg: '/ushering.jpg'
  }
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

const galleryData = [
  { id: 1, category: 'worship', title: 'Atmosphere of Praise', img: '/prsise.jpg', desc: 'Deep moments of worship during our Sunday service.' },
  { id: 2, category: 'services', title: 'The Word Ministration', img: '/word.jpg', desc: 'Pastor sharing life-transforming truths.' },
  { id: 3, category: 'outreach', title: 'Community Impact', img: '/impact.jpg', desc: 'Reaching out and spreading love in the city.' },
  { id: 4, category: 'worship', title: 'Lifted Hands', img: '/liftedhands.jpg', desc: 'An altar filled with total surrender and joy.' },
  { id: 5, category: 'services', title: 'Prayer Altar', img: '/pray.jpg', desc: 'Calling down fire and breakthrough.' },
  { id: 6, category: 'Togetherness', title: 'Proskeun Family', img: '/proskeun.jpg', desc: 'The young generation on fire for God.' },
];

const HomePage = () => {
  const [showSundayModal, setShowSundayModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Gallery States
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [activeImage, setActiveImage] = useState(null);

  const filteredGalleryItems = galleryFilter === 'all' 
    ? galleryData 
    : galleryData.filter(item => item.category === galleryFilter);

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
        setActiveImage(null);
      }
    };

    if (showSundayModal || selectedCell || activeImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSundayModal, selectedCell, activeImage]);

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
          <li><a href="#cells" onClick={(e) => handleNavClick(e, 'cells')}>Cells</a></li>
          <li><a href="#media" onClick={(e) => handleNavClick(e, 'media')}>Media</a></li>
          <li><a href="#ministries" onClick={(e) => handleNavClick(e, 'ministries')}>Ministries</a></li>
          <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a></li>
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
              href="https://www.tiktok.com/@proskeunministry/video/7674680799458888980?is_from_webapp=1&sender_device=pc&web_id=7674951370042033672" 
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
                src="/pastor1.jpg" 
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
            href="https://t.me/proskeuncity" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-telegram"
          >
            Join Telegram Channel 📲
          </a>
        </div>
      </section>

      {/* DIGITAL GALLERY SECTION */}
      <section className="gallery-section" id="gallery">
        <div className="section-header">
          <span className="badge">Visual Archive</span>
          <h2>Ministry Moments</h2>
          <p>A glimpse into the joy, power, and fellowship of Proskeun Global Ministry.</p>
        </div>

        {/* Filter Buttons */}
        <div className="gallery-filters">
          <button className={galleryFilter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('all')}>All</button>
          <button className={galleryFilter === 'worship' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('worship')}>Worship</button>
          <button className={galleryFilter === 'services' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('services')}>Services</button>
          <button className={galleryFilter === 'outreach' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('outreach')}>Outreach</button>
        </div>

        {/* Image Grid */}
        <div className="gallery-grid">
          {filteredGalleryItems.map(item => (
            <div key={item.id} className="gallery-item" onClick={() => setActiveImage(item)}>
              <img src={item.img} alt={item.title} loading="lazy" />
              <div className="gallery-overlay">
                <span className="gallery-cat">{item.category}</span>
                <h4>{item.title}</h4>
              </div>
            </div>
          ))}
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
            <p><strong>Bank:</strong> Wema Bank</p>
            <p><strong>Account Name:</strong> Proskeun Global Ministries</p>
            <p><strong>Account Number:</strong> 0126408317</p>
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

      {/* MINISTRIES & DEPARTMENTS SECTION WITH BACKGROUND IMAGES */}
      <section id="ministries" className="departments-section">
        <div className="section-header">
          <span className="badge">Serve With Us</span>
          <h2>Ministries & Departments</h2>
          <p>There is a place for you to use your gifts and grow. Join one of our dynamic service arms in the house.</p>
        </div>

        <div className="departments-grid">
          {ministriesData.map((item, index) => (
            <div 
              key={index} 
              className="dept-card" 
              style={{ backgroundImage: `url('${item.bg}')` }}
            >
              <div className="icon" aria-hidden="true">{item.icon}</div>
              <span className="dept-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="dept-footer">
                <span className="dept-time">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
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
              <img src="/front.webp" alt="Church Front View" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x200?text=Church+Front"; }} />
              <img src="/side.webp" alt="Church Side View" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x200?text=Church+Side"; }} />
            </div>

            <h3>Location & Directions</h3>
            <p className="modal-address">📍 The Proskeun Center, 15 Nova Road, Opp Uwasota Busstop Ugbowo, Benin city.</p>
            <a 
              href="https://www.google.com/maps/dir//Proskeun+global+ministry,+12a+Ogbeide+St,+Uselu,+Benin+City+300103,+Edo/@6.394096,5.6094877,7360m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x10472d004e8f03cb:0x2a72fc5135325510!2m2!1d5.6119774!2d6.384577?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D" 
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

      {/* GALLERY LIGHTBOX MODAL */}
      {activeImage && (
        <div className="modal-overlay" onClick={() => setActiveImage(null)} role="dialog" aria-modal="true">
          <div className="modal-content gallery-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveImage(null)} aria-label="Close modal">×</button>
            <img src={activeImage.img} alt={activeImage.title} className="lightbox-img" />
            <div className="lightbox-info">
              <span className="recap-tag">{activeImage.category}</span>
              <h3>{activeImage.title}</h3>
              <p>{activeImage.desc}</p>
            </div>
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
              <li><a href="#ministries" onClick={(e) => handleNavClick(e, 'ministries')}>Ministries</a></li>
              <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a></li>
              <li><a href="#giving" onClick={(e) => handleNavClick(e, 'giving')}>Giving</a></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Connect</h4>
            <p>Follow <strong>@Proskeun global ministries</strong></p>
            <ul className="social-icons-list">
              <li>
                <a href="https://www.tiktok.com/@proskeunministry?_r=1&_t=ZS-98xLb1Id5xX" target="_blank" rel="noreferrer" aria-label="TikTok">
                  <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://t.me/proskeuncity" target="_blank" rel="noreferrer" aria-label="Telegram">
                  <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m5.05 7.15-1.55 7.31c-.12.54-.44.67-.89.42l-2.47-1.82-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.52 4.59-4.15c.2-.18-.04-.28-.31-.1l-5.67 3.57-2.44-.76c-.53-.17-.54-.53.11-.78l9.53-3.67c.44-.16.83.1.69.78Z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/profile.php?id=61567927055011" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://youtube.com/@houseofshamba?si=gJzWZ4r9Reo2sUhx" target="_blank" rel="noreferrer" aria-label="YouTube">
                  <svg className="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
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