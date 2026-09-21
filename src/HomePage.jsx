import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

  // Gallery States
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
      {isNavOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsNavOpen(false)}
        />
      )}

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
          <p>At Proskeun Global Ministry, our mission is clear, To change and transform lives through the teaching of the Word and prayer. We are a ministry that prioritizes spiritual growth and maturity for every believer. Our heart is to see lives truly transformed by the power of God and to raise a family of believers rooted in love, truth, and service.</p>
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
                  e.target.src = IMAGE_FALLBACK;
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
                  e.target.src = IMAGE_FALLBACK;
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
            <button
              type="button"
              key={cell.name}
              className="cell-card clickable"
              onClick={() => setSelectedCell(cell)}
            >
              <span className="icon" aria-hidden="true">📍</span>
              <h3>{cell.name}</h3>
              <p>Location: {cell.location}</p>
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
            <img src={activeImage.img} alt={activeImage.title} className="lightbox-img" />
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

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>PROSKEUN GLOBAL MINISTRY</h3>
            <p>&quot;Atmosphere of Joy and Fire&quot;</p>
            <p className="footer-address">📍 {MAIN_CAMPUS.display}</p>
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
                <a href="https://www.tiktok.com/@proskeunministry?_r=1&_t=ZS-98xLb1Id5xX" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.69 6.33 6.33 0 0 0 9.33 22a6.33 6.33 0 0 0 6.33-6.33V9.17a8.21 8.21 0 0 0 4.93 1.58v-3.48a4.85 4.85 0 0 1-1-.58z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://t.me/proskeuncity" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Telegram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.89.03-.25.38-.51 1.07-.78 4.18-1.82 6.98-3.02 8.4-3.61 4-.1.66 4.99.78 4.99.08 0 .27.02.37.1.1.08.13.19.14.27 0 .06.01.24 0 .38z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-link" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

       <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Proskeun Global Ministry. All rights reserved.</p>
          <p>
            <Link to="/login" className="admin-portal-link">Pastor&apos;s Portal</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;