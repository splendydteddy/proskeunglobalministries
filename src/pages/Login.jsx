import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPages.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin/upload', { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Sign in failed. Please check your email and password and try again.');
      setSubmitting(false);
      return;
    }

    navigate('/admin/upload');
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <h2>Pastor Portal</h2>
        <p className="admin-login-sub">Proskeun Global Ministries</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleLogin} className="admin-form">
          <div>
            <label className="admin-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="pastor@proskeun.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="admin-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="admin-link">
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
