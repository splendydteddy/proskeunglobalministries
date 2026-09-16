import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function UploadPortal() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!audioFile) return alert('Please select an audio file!');
    setLoading(true);

    try {
      const fileName = `${Date.now()}-${audioFile.name}`;
      const { error: storageError } = await supabase.storage
        .from('sermon-audio')
        .upload(fileName, audioFile);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from('sermon-audio')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('sermon')
        .insert([{ title, date, audio_url: publicUrl }]);

      if (dbError) throw dbError;

      alert('Message published successfully!');
      setTitle('');
      setDate('');
      setAudioFile(null);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060c21', // Homepage dark navy background
      padding: '40px 20px',
      fontFamily: 'sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        background: '#1a2b51', // Homepage card dark royal blue
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        borderTop: '5px solid #e5ca6e' // Updated gold top border
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: '#e5ca6e', margin: 0, fontSize: '22px' }}>Upload New Message</h2>
          <button onClick={handleLogout} style={{
            background: 'transparent',
            border: '1px solid #e5ca6e',
            color: '#e5ca6e',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '12px',
            transition: 'background 0.2s'
          }}>
            Log Out
          </button>
        </div>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#e5ca6e', fontWeight: '500' }}>Message Title</label>
            <input 
              type="text" 
              placeholder="e.g., Walking in the Spirit" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#0e1835', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#e5ca6e', fontWeight: '500' }}>Date Preached</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#0e1835', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#e5ca6e', fontWeight: '500' }}>Audio File (.mp3)</label>
            <input 
              type="file" 
              accept="audio/mp3,audio/*" 
              onChange={(e) => setAudioFile(e.target.files[0])} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px dashed #e5ca6e', background: '#0e1835', color: '#fff', fontSize: '14px', boxSizing: 'border-box', cursor: 'pointer' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ 
            marginTop: '10px',
            padding: '12px', 
            background: '#e5ca6e', // Updated solid gold submit button
            color: '#060c21', // Dark blue text for contrast
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '16px', 
            fontWeight: '700', 
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Uploading File...' : 'Publish Message'}
          </button>
        </form>
      </div>
    </div>
  );
}