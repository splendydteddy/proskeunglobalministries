import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const ensureSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!session) {
        navigate('/login', { replace: true });
        setChecking(false);
        return;
      }
      setAuthed(true);
      setChecking(false);
    };

    ensureSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthed(false);
        navigate('/login', { replace: true });
      } else {
        setAuthed(true);
        setChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking) {
    return (
      <div className="admin-page admin-page--centered">
        <p className="admin-muted">Verifying your session…</p>
      </div>
    );
  }

  if (!authed) return null;

  return children;
}
