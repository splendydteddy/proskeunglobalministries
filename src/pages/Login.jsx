import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      navigate('/admin/upload');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#060c21',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: '#1a2b51',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '400px',
        borderTop: '5px solid #e5ca6e' // Updated gold
      }}>
        <h2 style={{ 
          marginBottom: '8px', 
          textAlign: 'center', 
          color: '#e5ca6e' // Updated gold
        }}>
          Pastor Portal
        </h2>
        <p style={{ 
          textAlign: 'center', 
          color: '#e0e0e0', 
          fontSize: '14px', 
          marginBottom: '25px' 
        }}>
          Proskeun Global Ministries
        </p>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '10px', 
            borderRadius: '6px', 
            marginBottom: '15px', 
            fontSize: '14px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontSize: '14px', 
              color: '#e5ca6e', // Updated gold
              fontWeight: '500' 
            }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="pastor@proskeun.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '6px', 
                border: '1px solid #555', 
                backgroundColor: '#0e1835', 
                color: '#fff', 
                fontSize: '14px', 
                boxSizing: 'border-box' 
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontSize: '14px', 
              color: '#e5ca6e', // Updated gold
              fontWeight: '500' 
            }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '6px', 
                border: '1px solid #555',
                backgroundColor: '#0e1835',
                color: '#fff',
                fontSize: '14px', 
                boxSizing: 'border-box' 
              }}
            />
          </div>

          <button type="submit" style={{ 
            marginTop: '10px', 
            padding: '12px', 
            background: '#e5ca6e', // Updated gold
            color: '#060c21', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '16px', 
            fontWeight: '700', 
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/" style={{ 
            color: '#e5ca6e', // Updated gold
            textDecoration: 'none', 
            fontSize: '14px', 
            fontWeight: '550' 
          }}>
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}