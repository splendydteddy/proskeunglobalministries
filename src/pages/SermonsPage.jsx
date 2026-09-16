import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSermons() {
      const { data, error } = await supabase
        .from('sermon')
        .select('*')
        .order('date', { ascending: false });
      
      if (!error) setSermons(data);
      setLoading(false);
    }
    fetchSermons();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      padding: '60px 20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0a192f 0%, #1d3557 100%)',
          padding: '30px 40px',
          borderRadius: '12px',
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '30px',
          borderBottom: '4px solid #d4af37' // Gold accent border
        }}>
          <h1 style={{ margin: '0 0 8px 0', color: '#d4af37', fontSize: '28px' }}>Proskeun Messages</h1>
          <p style={{ margin: 0, color: '#e0e0e0', fontSize: '15px' }}>Listen online or download powerful audio messages from our ministry.</p>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Loading messages...</p>
        ) : sermons.length === 0 ? (
          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>No messages uploaded yet. Check back soon!</p>
          </div>
        ) : (
          
          /* Sermon List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {sermons.map((sermon) => (
              <div key={sermon.id} style={{ 
                background: '#ffffff', 
                padding: '25px', 
                borderRadius: '12px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                borderLeft: '5px solid #d4af37' // Elegant gold accent line on the left
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: '#0a192f', fontSize: '20px' }}>{sermon.title}</h3>
                  <span style={{ fontSize: '13px', background: '#f0f4f8', color: '#1d3557', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' }}>
                    {sermon.date}
                  </span>
                </div>
                
                {/* Custom Audio Player */}
                <audio controls preload="metadata" style={{ width: '100%', marginBottom: '15px', borderRadius: '8px' }}>
                  <source src={sermon.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                {/* Download Button */}
                <div>
                  <a 
                    href={sermon.audio_url} 
                    download={`${sermon.title}.mp3`} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      textDecoration: 'none', 
                      background: 'linear-gradient(135deg, #0a192f 0%, #1d3557 100%)', 
                      color: '#d4af37', 
                      padding: '10px 18px', 
                      borderRadius: '6px', 
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItem: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    ⬇ Download Message (.mp3)
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}