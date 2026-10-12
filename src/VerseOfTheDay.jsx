import React, { useEffect, useState, useRef } from 'react';
import './VerseOfTheDay.css';

export default function VerseOfTheDay() {
  const [verseData, setVerseData] = useState({ verse: '', reference: '' });
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementPosOnStart = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);

  // Format today's date (e.g. "Mon, Oct 12")
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  useEffect(() => {
    fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily&version=kjv')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.verse) {
          setVerseData({
            verse: data.verse.details.text,
            reference: `${data.verse.details.reference} (KJV)`,
          });
        }
        setLoading(false);
        setTimeout(() => setIsVisible(true), 300);
      })
      .catch((err) => {
        console.error('Failed to fetch verse of the day:', err);
        setVerseData({
          verse: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
          reference: 'Proverbs 3:5 (KJV)',
        });
        setLoading(false);
        setTimeout(() => setIsVisible(true), 300);
      });
  }, []);

  // --- DRAG HANDLERS ---
  const handlePointerDown = (e) => {
    if (e.target.closest('.votd-close-btn')) return;

    setIsDragging(true);
    hasDragged.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementPosOnStart.current = { ...position };

    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDragged.current = true;
    }

    setPosition({
      x: elementPosOnStart.current.x + deltaX,
      y: elementPosOnStart.current.y + deltaY,
    });
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch {
        // Safe catch for pointer release
      }
    }
  };

  const handleCardClick = () => {
    // Only toggle expand if the user tapped/clicked without dragging
    if (!hasDragged.current) {
      setIsExpanded((prev) => !prev);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`votd-floating-wrapper ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleCardClick}
    >
      <div className="votd-card">
        {/* Proskeun Watermark Background */}
        <div className="votd-bg-watermark" />

        <button
          type="button"
          className="votd-close-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          aria-label="Close Verse of the Day"
        >
          ✕
        </button>

        <div className="votd-header">
          <span className="votd-icon">📖</span>
          <span className="votd-badge">Verse of the Day</span>
          {isExpanded && <span className="votd-date">• {todayDate}</span>}
          {!isExpanded && <span className="votd-expand-hint">Tap to read ✨</span>}
        </div>

        {isExpanded && (
          <div className="votd-content">
            {loading ? (
              <p className="votd-loading">Fetching today's scripture...</p>
            ) : (
              <>
                <blockquote className="votd-text">“{verseData.verse}”</blockquote>
                <cite className="votd-ref">— {verseData.reference}</cite>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}