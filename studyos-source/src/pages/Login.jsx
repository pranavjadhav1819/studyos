import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const { user } = useAuth();
  const [mode, setMode] = useState('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);

    if (mode === 'sign_in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setInfo('Account created. Check your inbox if email confirmation is required, then sign in.');
    }
    setBusy(false);
  }

  async function handleOAuthSignIn(provider) {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>
          <span style={{ color: 'var(--amber)' }}>study</span>
          OS
        </h1>
        <p className="sub">Your syllabus learns with you.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {info && <p style={{ color: 'var(--green)', fontSize: 13, marginTop: 4 }}>{info}</p>}

          <button className="btn" disabled={busy} type="submit" style={{ width: '100%', marginTop: 8 }}>
            {busy ? 'Working...' : mode === 'sign_in' ? 'Sign in' : 'Create an account'}
          </button>
        </form>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p>Or continue with:</p>
          <button className="btn" onClick={() => handleOAuthSignIn('google')} disabled={busy} style={{ width: '100%', marginTop: '8px' }}>
            Sign in with Google
          </button>
          <button className="btn" onClick={() => handleOAuthSignIn('github')} disabled={busy} style={{ width: '100%', marginTop: '8px' }}>
            Sign in with GitHub
          </button>
        </div>

        <p className="auth-toggle">
          <button
            className="link-btn"
            onClick={() => {
              setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in');
              setError('');
              setInfo('');
            }}
          >
            {mode === 'sign_in' ? 'Create an account' : 'Already have an account? Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
