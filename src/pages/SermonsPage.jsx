import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './AdminPages.css'; // Reusing the clean admin & watermark layout styles

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    async function fetchSermons() {
      const { data, error } = await supabase
        .from('sermon')
        .select('*')
        .order('date', { ascending: false });
      
      if (!error && data) setSermons(data);
      setLoading(false);
    }
    fetchSermons();
  }, []);

  // Safe direct download handling
  const handleDownload = async (fileUrl, title, id) => {
    if (!fileUrl) return;

    try {
      setDownloadingId(id);

      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title ? title.replace(/[^a-zA-Z0-9]/g, '_') : 'Sermon'}.mp3`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      window.open(fileUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-inner">
        
        {/* Navigation back home */}
        <div className="admin-nav">
          <Link to="/" className="admin-link">
            ← Back to Home
          </Link>
          <Link to="/admin" className="admin-link">
            Pastor&apos;s Portal →
          </Link>
        </div>

        {/* Header Banner */}
        <div className="admin-card" style={{ textAlign: 'center', borderTop: '5px solid var(--gold)' }}>
          <h1 style={{ fontSize: '26px', color: 'var(--blue-accent)', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>
            Proskeun Messages Archive
          </h1>
          <p className="admin-muted" style={{ margin: 0 }}>
            Listen online or download powerful audio messages from our ministry.
          </p>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <p className="admin-muted" style={{ textAlign: 'center', padding: '40px' }}>Loading messages…</p>
        ) : sermons.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
            <p className="admin-muted" style={{ margin: 0 }}>No messages uploaded yet. Check back soon!</p>
          </div>
        ) : (
          
          /* Sermon List */
          <div className="admin-list">
            {sermons.map((sermon) => {
              const fileUrl = sermon.audio_url || sermon.audio_file_url;
              const isDownloading = downloadingId === sermon.id;

              return (
                <div key={sermon.id} className="admin-list-item" style={{ flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--blue-accent)', fontFamily: 'var(--font-display)' }}>
                      {sermon.title}
                    </h4>
                    <span style={{ fontSize: '12px', background: 'rgba(197, 155, 39, 0.15)', color: 'var(--gold)', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>
                      {sermon.date}
                    </span>
                  </div>
                  
                  {/* Custom Audio Player */}
                  <audio controls preload="metadata" style={{ width: '100%', borderRadius: '8px' }}>
                    <source src={fileUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>

                  {/* Download Button */}
                  <div>
                    <button 
                      onClick={() => handleDownload(fileUrl, sermon.title, sermon.id)}
                      disabled={isDownloading}
                      className="admin-btn"
                      style={{ 
                        background: 'var(--blue-accent)',
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: isDownloading ? 'wait' : 'pointer',
                        opacity: isDownloading ? 0.7 : 1
                      }}
                    >
                      {isDownloading ? '⏳ Downloading...' : '⬇ Download Message (.mp3)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}