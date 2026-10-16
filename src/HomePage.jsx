import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import VerseOfTheDay from './VerseOfTheDay';
import { supabase } from './supabaseClient';
import {
  MAIN_CAMPUS,
  SUNDAY_SERVICE_DIRECTIONS_URL,
  IMAGE_FALLBACK,
  mapsSearchUrl,
} from './constants/site';
import './HomePage.css';

const scheduleData = [
  { day: 'Monday', title: 'General Fasting Day', type: 'Spiritual Discipline', time: 'All Day' },
  { day: 'Wednesday', title: 'Midweek Service & Bible Study', type: 'Word & Worship', time: '5:00 PM – 7:00 PM' },
  { day: 'Thursday', title: 'Evangelism', type: 'Outreach', time: '4:00 PM' },
  { day: 'Friday', title: 'Home Cell Meetings', type: 'Fellowship', time: '5:00 PM – 6:00 PM' },
  { day: 'Saturday', title: 'Prayer Session', type: 'Intercession', time: '4:00 PM' },
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
    location: MAIN_CAMPUS.display,
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
    desc: 'Managing sound systems, acoustics, and stage tech to ensure an uninterrupted flow of service.',
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
  },
  {
    q: 'Where is the church located?',
    a: `Sunday service and our main center are at ${MAIN_CAMPUS.display} Use "Get Directions" on the homepage or contact form for map links.`
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

  const [galleryFilter, setGalleryFilter] = useState('all');
  const [activeImage, setActiveImage] = useState(null);

  const [latestSermon, setLatestSermon] = useState(null);
  const [sermonsLoading, setSermonsLoading] = useState(true);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactFeedback, setContactFeedback] = useState(null);

  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [accountCopied, setAccountCopied] = useState(false);

  const GIVING_ACCOUNT = '0126408317';

  useEffect(() => {
    fetchLatestSermon();
  }, []);

  const fetchLatestSermon = async () => {
    try {
      const { data, error } = await supabase
        .from('sermon')
        .select('*')
        .order('date', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setLatestSermon(data[0]);
      }
    } catch (err) {
      console.error('Error fetching latest sermon:', err.message);
    } finally {
      setSermonsLoading(false);
    }
  };

  const filteredGalleryItems = galleryFilter === 'all'
    ? galleryData
    : galleryData.filter((item) => item.category === galleryFilter);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactFeedback(null);
    setContactSubmitting(true);

    try {
      const { error } = await supabase.from('prayer_request').insert([
        {
          full_name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
        },
      ]);

      if (error) throw error;

      setContactFeedback({
        type: 'success',
        text: 'Thank you. Your request has been sent to our pastoral team.',
      });
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch {
      setContactFeedback({
        type: 'error',
        text: 'We could not send your request right now. Please try again or contact us directly.',
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(GIVING_ACCOUNT);
      setAccountCopied(true);
      setTimeout(() => setAccountCopied(false), 2500);
    } catch {
      setAccountCopied(false);
    }
  };

  const galleryIndex = activeImage
    ? filteredGalleryItems.findIndex((item) => item.id === activeImage.id)
    : -1;

  const stepGallery = useCallback(
    (direction) => {
      if (galleryIndex < 0 || filteredGalleryItems.length === 0) return;
      const next =
        (galleryIndex + direction + filteredGalleryItems.length) %
        filteredGalleryItems.length;
      setActiveImage(filteredGalleryItems[next]);
    },
    [galleryIndex, filteredGalleryItems],
  );

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsNavOpen(false);
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSundayModal(false);
        setSelectedCell(null);
        setActiveImage(null);
      }
      if (activeImage && e.key === 'ArrowRight') stepGallery(1);
      if (activeImage && e.key === 'ArrowLeft') stepGallery(-1);
    };

    const modalOpen = showSundayModal || selectedCell || activeImage || isNavOpen;

    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSundayModal, selectedCell, activeImage, isNavOpen, stepGallery]);

  return (
    <div className="church-site">
      {/* High Visibility Static Fixed Center Logo Watermark */}
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
          <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
          <li><Link to="/about" onClick={() => setIsNavOpen(false)}>About Us</Link></li>
          <li><Link to="/services" onClick={() => setIsNavOpen(false)}>Services</Link></li>
          <li><a href="#cells" onClick={(e) => handleNavClick(e, 'cells')}>Cells</a></li>
          <li><a href="#media" onClick={(e) => handleNavClick(e, 'media')}>Media</a></li>
          <li><a href="#ministries" onClick={(e) => handleNavClick(e, 'ministries')}>Ministries</a></li>
          <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a></li>
          <li><a href="#giving" onClick={(e) => handleNavClick(e, 'giving')}>Giving</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a></li>
          <li><Link to="/login" onClick={() => setIsNavOpen(false)} className="nav-pastor-portal">🔑 Pastor's Portal</Link></li>
        </ul>

        <div className="nav-cta">
          <button onClick={() => setShowSundayModal(true)} className="btn-primary">Join Us Sunday</button>
        </div>
      </nav>

      {/* HERO SECTION WITH NATURAL FULL-COLOR PICTURE */}
      <section id="home" className="hero-section">
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

          <div className="hero-glass-badge" onClick={() => setShowSundayModal(true)}>
            <h4>Join Us This Sunday</h4>
            <p>Service Times: Starts 7:30 AM</p>
          </div>
        </div>
      </section>

      {/* VERSE OF THE DAY SECTION */}
      <VerseOfTheDay />

      {/* ABOUT OUR CHURCH BANNER SECTION */}
      <section className="about-church-section">
        <div className="about-church-container">
          <div className="about-church-text">
            <h2>About Our Church</h2>
            <p className="about-description">
              Proskeun Global Ministry is a vibrant, diverse congregation committed to making all men see God, experience His presence, and step into His finished works.
            </p>

            <div className="about-block">
              <h3>Our Vision</h3>
              <p>To make all men see Christ, experience the power of the Spirit, and walk in His Kingdom truth.</p>
            </div>

            <div className="about-block">
              <h3>Core Values</h3>
              <p>Preaching, Teaching, Praise, Prayer & Apostolic Ministration.</p>
            </div>

            <div className="about-values-grid">
              <div className="value-item">
                <div className="value-icon">🤍</div>
                <h4>Love</h4>
                <p>We love one another deeply as Christ loves the Church.</p>
              </div>

              <div className="value-item">
                <div className="value-icon">👥</div>
                <h4>Community</h4>
                <p>We build lives and help men walk together in faith and purpose.</p>
              </div>
            </div>
          </div>

          <div className="about-church-image">
            <img src="/pastor.png" alt="Proskeun Pastoral Leadership" onError={(e) => { e.target.onerror = null; e.target.src = '/proskeun.jpg'; }} />
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
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Time:</strong> {item.time}</p>
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
            <button
              type="button"
              key={cell.name}
              className="cell-card clickable"
              onClick={() => setSelectedCell(cell)}
            >
              <span className="icon" aria-hidden="true">📍</span>
              <h3>{cell.name}</h3>
              <p>{cell.location}</p>
              <span className="click-hint">View Directions →</span>
            </button>
          ))}
        </div>
      </section>

      {/* MEDIA SECTION */}
      <section id="media" className="media-section">
        <div className="section-header">
          <h2>Sermons & Media</h2>
          <p>Access audio messages uploaded by ministers or catch up via our telegram channel.</p>
        </div>

        <div className="sermons-archive-container">
          <h3>Latest Uploaded Message</h3>
          
          {sermonsLoading ? (
            <div className="sermons-empty-card">
              <div className="spinner"></div>
              <p>Loading latest message...</p>
            </div>
          ) : !latestSermon ? (
            <div className="sermons-empty-card">
              <span className="recap-tag">Audio & Messages</span>
              <h3>Fresh Archives Preparing</h3>
              <p>Our ministry media team is currently updating this week's apostolic teachings. In the meantime, dive straight into hundreds of hours of transforming sessions on our Telegram library.</p>
            </div>
          ) : (
            <div className="sermons-list">
              <div key={latestSermon.id} className="sermon-item-card">
                <div className="sermon-item-header">
                  <div>
                    <h4>{latestSermon.title}</h4>
                    <span className="sermon-date">Preached on: {latestSermon.date}</span>
                  </div>
                  <a 
                    href={latestSermon.audio_url} 
                    download 
                    target="_blank" 
                    rel="noreferrer"
                    className="sermon-download-btn"
                  >
                    Download Audio ⬇️
                  </a>
                </div>

                <audio controls className="sermon-audio-player">
                  <source src={latestSermon.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>

              <div className="sermon-archive-link">
                <Link to="/messages">View All Past Messages in the Archive →</Link>
              </div>
            </div>
          )}
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

        <div className="gallery-filters">
          <button className={galleryFilter === 'all' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('all')}>All</button>
          <button className={galleryFilter === 'worship' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('worship')}>Worship</button>
          <button className={galleryFilter === 'services' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('services')}>Services</button>
          <button className={galleryFilter === 'outreach' ? 'filter-btn active' : 'filter-btn'} onClick={() => setGalleryFilter('outreach')}>Outreach</button>
        </div>

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
            <p><strong>Account Number:</strong> {GIVING_ACCOUNT}</p>
            <button type="button" className="btn-copy-account" onClick={copyAccountNumber}>
              {accountCopied ? 'Copied!' : 'Copy account number'}
            </button>
            <p className="giving-note">Your giving supports ministry operations, outreach, and the spread of the gospel.</p>
          </div>
        </div>
      </section>

      {/* CONTACT / PRAYER SECTION */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2>Prayer & Counseling</h2>
          <p>Connect with our pastoral team for guidance, prayer, and one-on-one counseling.</p>
        </div>

        {contactFeedback && (
          <div className={`form-feedback form-feedback--${contactFeedback.type}`} role="status">
            {contactFeedback.text}
          </div>
        )}

        <form className="contact-form" onSubmit={handleContactSubmit}>
          <div className="form-group">
            <label htmlFor="user-fullname">Full Name</label>
            <input
              id="user-fullname"
              type="text"
              placeholder="Full Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-email">Email Address</label>
            <input
              id="user-email"
              type="email"
              placeholder="Email Address"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-message">Prayer Request / Inquiry</label>
            <textarea
              id="user-message"
              placeholder="Write your prayer request or counseling inquiry here..."
              rows="5"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={contactSubmitting}>
            {contactSubmitting ? 'Sending…' : 'Send Request'}
          </button>
        </form>
      </section>

      {/* MINISTRIES & DEPARTMENTS SECTION */}
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
        <div className="faq-accordion">
          {faqData.map((item, index) => {
            const isOpen = openFaqIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div key={item.q} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
                <button
                  type="button"
                  id={buttonId}
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-answer"
                  hidden={!isOpen}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
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
              <img src="/front.webp" alt="Church Front View" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = IMAGE_FALLBACK; }} />
              <img src="/side.webp" alt="Church Side View" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = IMAGE_FALLBACK; }} />
            </div>

            <h3>Location & Directions</h3>
            <p className="modal-address">📍 {MAIN_CAMPUS.display}</p>
            <a
              href={SUNDAY_SERVICE_DIRECTIONS_URL}
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
            
            <p className="cell-modal-location">
              📍 <strong>Location:</strong> {selectedCell.location}
            </p>
            
            {selectedCell.leader && (
              <p className="cell-modal-leader">
                👤 <strong>Cell Leader:</strong> {selectedCell.leader}
              </p>
            )}

            {selectedCell.details && (
              <p className="cell-modal-details">
                {selectedCell.details}
              </p>
            )}

            <div className="cell-modal-time-box">
              <p><strong>Meeting Time:</strong> Thursdays @ 4:00 PM – 5:00 PM</p>
            </div>

            <a
              href={mapsSearchUrl(selectedCell.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary modal-directions-btn"
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
            {filteredGalleryItems.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-nav gallery-nav--prev"
                  aria-label="Previous image"
                  onClick={() => stepGallery(-1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery-nav gallery-nav--next"
                  aria-label="Next image"
                  onClick={() => stepGallery(1)}
                >
                  ›
                </button>
              </>
            )}
            <div className="lightbox-image-wrapper">
              <img src={activeImage.img} alt={activeImage.title} className="lightbox-img" />
            </div>
            <div className="lightbox-info">
              <span className="recap-tag">{activeImage.category}</span>
              <h3>{activeImage.title}</h3>
              <p>{activeImage.desc}</p>
            </div>
          </div>
        </div>
      )}

      <section className="pre-footer-cta" aria-labelledby="pre-footer-heading">
        <h2 id="pre-footer-heading">Ready to connect with us?</h2>
        <p>Join us this Sunday for worship, the Word, and fellowship.</p>
        <button type="button" className="btn-primary" onClick={() => setShowSundayModal(true)}>
          Plan Your Visit
        </button>
      </section>

      {/* FOOTER WITH SOCIAL LINKS */}
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
              <li><Link to="/about">About Us</Link></li>
              <li><a href="#schedule" onClick={(e) => handleNavClick(e, 'schedule')}>Service Schedule</a></li>
              <li><a href="#cells" onClick={(e) => handleNavClick(e, 'cells')}>House Cells</a></li>
              <li><a href="#ministries" onClick={(e) => handleNavClick(e, 'ministries')}>Ministries</a></li>
              <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a></li>
              <li><a href="#giving" onClick={(e) => handleNavClick(e, 'giving')}>Giving</a></li>
              <li><Link to="/login">Pastor's Portal</Link></li>
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

export default HomePage;