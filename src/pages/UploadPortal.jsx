import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function UploadPortal() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sermons, setSermons] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Fetch all sermons on load so admin can manage them
  useEffect(() => {
    fetchAdminSermons();
  }, []);

  const fetchAdminSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermon')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setSermons(data || []);
    } catch (err) {
      console.error('Error fetching sermons:', err.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !date || !audioFile) {
      alert('Please fill in all fields and select an audio file.');
      return;
    }

    try {
      setUploading(true);

      // 1. Upload audio file to Supabase storage bucket ('sermon-audio')
      const fileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
      const { error: storageError } = await supabase.storage
        .from('sermon-audio')
        .upload(fileName, audioFile);

      if (storageError) throw storageError;

      // 2. Get public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('sermon-audio')
        .getPublicUrl(fileName);

      const audioUrl = publicUrlData.publicUrl;

      // 3. Insert record into the 'sermon' table
      const { error: dbError } = await supabase
        .from('sermon')
        .insert([{ title, date, audio_url: audioUrl }]);

      if (dbError) throw dbError;

      alert('Message uploaded successfully!');
      setTitle('');
      setDate('');
      setAudioFile(null);
      fetchAdminSermons(); // Refresh list & count
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading message. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (sermonTitle, audioUrl) => {
    if (!window.confirm(`Are you sure you want to delete "${sermonTitle}"?`)) return;

    try {
      // 1. Delete the audio file from Supabase storage bucket if audioUrl exists
      if (audioUrl) {
        const urlParts = audioUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage
            .from('sermon-audio')
            .remove([fileName]);
        }
      }

      // 2. Delete the database row using 'title' as the key
      const { error } = await supabase
        .from('sermon')
        .delete()
        .eq('title', sermonTitle);

      if (error) throw error;

      alert('Message deleted successfully.');
      fetchAdminSermons(); // Refresh list & count
    } catch (error) {
      console.error('Delete error:', error);
      alert('Could not delete the message.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a192f', padding: '40px 20px', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* Navigation */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Home
          </Link>
          <Link to="/messages" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: 'bold' }}>
            View Public Archive →
          </Link>
        </div>

        {/* Dashboard Title & Stat Card */}
        <div style={{ background: '#112240', padding: '25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#d4af37', fontSize: '24px' }}>Admin Upload & Management Portal</h1>
          <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
            Total Messages in Archive: <strong style={{ color: '#fff', fontSize: '16px' }}>{sermons.length}</strong>
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} style={{ background: '#112240', padding: '25px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>Upload New Message</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>Message Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Walking in the Spirit"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #233554', background: '#0a192f', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>Date Preached</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #233554', background: '#0a192f', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>Audio File (.mp3)</label>
            <input 
              type="file" 
              accept="audio/*" 
              onChange={(e) => setAudioFile(e.target.files[0])} 
              style={{ color: '#ccc' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              background: '#d4af37', 
              color: '#0a192f', 
              border: 'none', 
              padding: '12px 20px', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: uploading ? 'wait' : 'pointer',
              width: '100%'
            }}
          >
            {uploading ? 'Uploading to database...' : 'Upload Message 🚀'}
          </button>
        </form>

        {/* Existing Messages Management List */}
        <h2 style={{ fontSize: '20px', marginBottom: '15px', color: '#fff' }}>Manage Existing Messages</h2>
        {loadingList ? (
          <p style={{ color: '#aaa' }}>Loading list...</p>
        ) : sermons.length === 0 ? (
          <p style={{ color: '#aaa' }}>No messages found in the database.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sermons.map((sermon) => (
              <div key={sermon.title} style={{ background: '#112240', padding: '15px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fff' }}>{sermon.title}</h4>
                  <span style={{ fontSize: '12px', color: '#d4af37' }}>{sermon.date}</span>
                </div>
                <button 
                  onClick={() => handleDelete(sermon.title, sermon.audio_url)}
                  style={{ 
                    background: '#ff4d4d', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Delete 🗑️
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}