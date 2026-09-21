import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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

      // Attempt to fetch the file directly via fetch to create a reliable blob download
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
      // Fallback: open URL in a new tab if direct blob download fails due to CORS
      window.open(fileUrl, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a192f',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Navigation back home */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Home
          </Link>
        </div>

        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0a192f 0%, #1d3557 100%)',
          padding: '30px 40px',
          borderRadius: '12px',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '30px',
          borderBottom: '4px solid #d4af37',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <h1 style={{ margin: '0 0 8px 0', color: '#d4af37', fontSize: '28px' }}>Proskeun Messages Archive</h1>
          <p style={{ margin: 0, color: '#e0e0e0', fontSize: '15px' }}>Listen online or download powerful audio messages from our ministry.</p>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#aaa', padding: '40px' }}>Loading messages…</p>
        ) : sermons.length === 0 ? (
          <div style={{ background: '#112240', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <p style={{ color: '#aaa', fontSize: '16px', margin: 0 }}>No messages uploaded yet. Check back soon!</p>
          </div>
        ) : (
          
          /* Sermon List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {sermons.map((sermon) => {
              const fileUrl = sermon.audio_url || sermon.audio_file_url;
              const isDownloading = downloadingId === sermon.id;

              return (
                <div key={sermon.id} style={{ 
                  background: '#112240', 
                  padding: '25px', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  borderLeft: '5px solid #d4af37',
                  color: '#ffffff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ margin: 0, color: '#ffffff', fontSize: '20px' }}>{sermon.title}</h3>
                    <span style={{ fontSize: '13px', background: '#1d3557', color: '#d4af37', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' }}>
                      {sermon.date}
                    </span>
                  </div>
                  
                  {/* Custom Audio Player */}
                  <audio controls preload="metadata" style={{ width: '100%', marginBottom: '15px', borderRadius: '8px' }}>
                    <source src={fileUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>

                  {/* Download Button */}
                  <div>
                    <button 
                      onClick={() => handleDownload(fileUrl, sermon.title, sermon.id)}
                      disabled={isDownloading}
                      style={{ 
                        background: '#d4af37', 
                        color: '#0a192f', 
                        border: 'none',
                        padding: '10px 18px', 
                        borderRadius: '6px', 
                        fontSize: '14px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: isDownloading ? 'wait' : 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
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