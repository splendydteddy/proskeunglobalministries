import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  ALLOWED_AUDIO_TYPES,
  MAX_SERMON_AUDIO_BYTES,
} from '../constants/site';
import './AdminPages.css';

function getStoragePathFromSermon(sermon) {
  if (sermon.storage_path) return sermon.storage_path;
  if (!sermon.audio_url) return null;
  try {
    const path = new URL(sermon.audio_url).pathname;
    const parts = path.split('/');
    return decodeURIComponent(parts[parts.length - 1] || '');
  } catch {
    const urlParts = sermon.audio_url.split('/');
    return urlParts[urlParts.length - 1];
  }
}

function validateAudioFile(file) {
  if (!file) return 'Please select an audio file.';
  if (file.size > MAX_SERMON_AUDIO_BYTES) {
    return 'File is too large. Maximum size is 100 MB.';
  }
  const typeOk =
    ALLOWED_AUDIO_TYPES.includes(file.type) ||
    /\.(mp3|m4a|wav|aac|ogg)$/i.test(file.name);
  if (!typeOk) {
    return 'Please upload a valid audio file (MP3, M4A, WAV, AAC, or OGG).';
  }
  return null;
}

export default function UploadPortal() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sermons');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sermons, setSermons] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [status, setStatus] = useState(null);
  const [pendingDeleteSermonId, setPendingDeleteSermonId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoadingList(true);
    try {
      const [sermonRes, prayerRes] = await Promise.all([
        supabase.from('sermon').select('*').order('date', { ascending: false }),
        supabase.from('prayer_request').select('*').order('created_at', { ascending: false }),
      ]);

      if (sermonRes.error) throw sermonRes.error;
      setSermons(sermonRes.data || []);

      if (!prayerRes.error) {
        setPrayerRequests(prayerRes.data || []);
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'Could not load admin data. Please refresh the page.',
      });
    } finally {
      setLoadingList(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleBackToHome = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!title.trim() || !date || !audioFile) {
      setStatus({ type: 'error', message: 'Please fill in all fields and select an audio file.' });
      return;
    }

    const validationError = validateAudioFile(audioFile);
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    try {
      setUploading(true);

      const fileName = `${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`;
      const { error: storageError } = await supabase.storage
        .from('sermon-audio')
        .upload(fileName, audioFile, { contentType: audioFile.type || 'audio/mpeg' });

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from('sermon-audio')
        .getPublicUrl(fileName);

      const row = {
        title: title.trim(),
        date,
        audio_url: publicUrlData.publicUrl,
        storage_path: fileName,
      };

      const { error: dbError } = await supabase.from('sermon').insert([row]);

      if (dbError) {
        await supabase.storage.from('sermon-audio').remove([fileName]);
        throw dbError;
      }

      setStatus({ type: 'success', message: 'Message uploaded successfully.' });
      setTitle('');
      setDate('');
      setAudioFile(null);
      const fileInput = document.getElementById('sermon-audio-input');
      if (fileInput) fileInput.value = '';
      fetchAdminData();
    } catch (err) {
      console.error('Upload error:', err);
      setStatus({
        type: 'error',
        message: `Upload failed: ${err.message || 'Please try again.'}`,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSermon = async (sermon) => {
    if (pendingDeleteSermonId !== sermon.id) {
      setPendingDeleteSermonId(sermon.id);
      setStatus(null);
      return;
    }

    setDeletingId(sermon.id);
    setStatus(null);

    try {
      const storagePath = getStoragePathFromSermon(sermon);
      if (storagePath) {
        await supabase.storage.from('sermon-audio').remove([storagePath]);
      }

      const { error } = await supabase.from('sermon').delete().eq('id', sermon.id);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Message deleted successfully.' });
      setPendingDeleteSermonId(null);
      fetchAdminData();
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Could not delete this message. Please try again.' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDismissPrayer = async (id) => {
    const { error } = await supabase.from('prayer_request').delete().eq('id', id);
    if (error) {
      setStatus({ type: 'error', message: 'Could not remove this request.' });
      return;
    }
    setPrayerRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="admin-page">
      <div className="admin-inner">
        <div className="admin-nav">
          <a href="/" onClick={handleBackToHome} className="admin-link" style={{ cursor: 'pointer' }}>
            ← Back to Home
          </a>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link to="/messages" className="admin-link">
              Public archive →
            </Link>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>

        <div className="admin-card">
          <h1 style={{ fontSize: '24px', color: '#d4af37', margin: '0 0 8px' }}>
            Pastor Admin Portal
          </h1>
          <p className="admin-muted">
            Messages in archive: <strong style={{ color: '#fff' }}>{sermons.length}</strong>
            {' · '}
            Prayer requests: <strong style={{ color: '#fff' }}>{prayerRequests.length}</strong>
          </p>
        </div>

        {status && (
          <div className={`admin-status admin-status--${status.type}`}>{status.message}</div>
        )}

        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'sermons' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('sermons')}
          >
            Sermons
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'prayer' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('prayer')}
          >
            Prayer & counselling
          </button>
        </div>

        {activeTab === 'sermons' && (
          <>
            <form onSubmit={handleUpload} className="admin-card admin-form">
              <h3 style={{ color: '#fff', margin: 0 }}>Upload new message</h3>

              <div>
                <label className="admin-label" htmlFor="sermon-title">
                  Message title
                </label>
                <input
                  id="sermon-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Walking in the Spirit"
                />
              </div>

              <div>
                <label className="admin-label" htmlFor="sermon-date">
                  Date preached
                </label>
                <input
                  id="sermon-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="admin-label" htmlFor="sermon-audio-input">
                  Audio file (max 100 MB)
                </label>
                <input
                  id="sermon-audio-input"
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/x-m4a,audio/aac,audio/ogg"
                  onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <button type="submit" className="admin-btn" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload message'}
              </button>
            </form>

            <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Manage messages</h2>
            {loadingList ? (
              <p className="admin-muted">Loading messages…</p>
            ) : sermons.length === 0 ? (
              <p className="admin-muted">No messages in the database yet.</p>
            ) : (
              <div className="admin-list">
                {sermons.map((sermon) => (
                  <div key={sermon.id} className="admin-list-item">
                    <div>
                      <h4>{sermon.title}</h4>
                      <span style={{ fontSize: '12px', color: '#d4af37' }}>{sermon.date}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pendingDeleteSermonId === sermon.id ? (
                        <>
                          <span style={{ fontSize: '12px', color: '#ffcdd2' }}>Delete this message?</span>
                          <button
                            type="button"
                            className="admin-btn admin-btn--danger"
                            disabled={deletingId === sermon.id}
                            onClick={() => handleDeleteSermon(sermon)}
                          >
                            {deletingId === sermon.id ? 'Deleting…' : 'Yes, delete'}
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            onClick={() => setPendingDeleteSermonId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger"
                          onClick={() => handleDeleteSermon(sermon)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'prayer' && (
          <>
            <p className="admin-muted" style={{ marginBottom: '16px' }}>
              Submissions from the Prayer &amp; Counseling form on the homepage.
            </p>
            {loadingList ? (
              <p className="admin-muted">Loading requests…</p>
            ) : prayerRequests.length === 0 ? (
              <p className="admin-muted">No prayer or counselling requests yet.</p>
            ) : (
              <div className="admin-list">
                {prayerRequests.map((req) => (
                  <div key={req.id} className="admin-list-item" style={{ flexDirection: 'column' }}>
                    <div style={{ width: '100%' }}>
                      <h4>{req.full_name}</h4>
                      <p className="admin-muted" style={{ margin: '4px 0' }}>
                        {req.email}
                      </p>
                      <p style={{ color: '#e0e0e0', fontSize: '14px', lineHeight: 1.5 }}>
                        {req.message}
                      </p>
                      <p className="admin-muted" style={{ marginTop: '8px', fontSize: '12px' }}>
                        {req.created_at
                          ? new Date(req.created_at).toLocaleString()
                          : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      style={{ alignSelf: 'flex-start' }}
                      onClick={() => handleDismissPrayer(req.id)}
                    >
                      Mark as handled
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}