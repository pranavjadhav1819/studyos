import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';

export default function Login() {
  const { user, enterGuestMode } = useAuth();
  const [mode, setMode] = useState('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);

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
      <div className="auth-card adhd-auth-card">
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(232, 163, 61, 0.15)', border: '1px solid var(--amber)', color: 'var(--amber)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            ⚡ ADHD-Friendly Study Workspace
          </div>
          <h1>
            <span style={{ color: 'var(--amber)' }}>study</span>OS
          </h1>
          <p className="sub" style={{ maxWidth: 360, margin: '6px auto 0', lineHeight: 1.4 }}>
            Zero-friction productivity for neurodivergent minds. Break task paralysis, protect hyperfocus, and conquer your exams.
          </p>
        </div>

        {/* Big 1-Click Instant Guest Access Button */}
        <div className="adhd-quickstart-box" style={{ background: 'var(--panel-raised)', border: '1px solid var(--amber)', padding: 18, borderRadius: 10, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--paper)', marginBottom: 4 }}>
            Skip the Login Friction
          </div>
          <p style={{ fontSize: 12, color: 'var(--paper-dim)', margin: '0 0 12px', lineHeight: 1.3 }}>
            Executive dysfunction makes account setup hard. Start immediately with pre-loaded subjects &amp; full ADHD tools.
          </p>
          <button
            type="button"
            className="btn btn-primary-adhd"
            style={{ width: '100%', padding: '12px 16px', fontSize: 14, fontWeight: 700 }}
            onClick={enterGuestMode}
          >
            🚀 Launch Instant ADHD StudyOS (No Sign Up Needed)
          </button>
        </div>

        {/* Feature Pills */}
        <div className="adhd-features-preview">
          {[
            { icon: '⚡', title: 'Task Paralysis Breaker', desc: 'Converts big topics into 3 tiny 5m steps' },
            { icon: '🎧', title: 'Brown Noise Audio', desc: 'Masks background distractors' },
            { icon: '🎯', title: 'Single-Task Shield', desc: 'Eliminates visual clutter' },
            { icon: '🧠', title: 'Gemini Socratic AI', desc: 'ELI5 answers + memory mnemonics' },
          ].map((feat, idx) => (
            <div key={idx} className="adhd-feat-item">
              <span className="adhd-feat-icon">{feat.icon}</span>
              <div>
                <strong style={{ display: 'block', fontSize: 12, color: 'var(--paper)' }}>{feat.title}</strong>
                <span style={{ fontSize: 11, color: 'var(--paper-dim)' }}>{feat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Supabase Email/Password Collapsible */}
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16, marginTop: 16 }}>
          {!showPassForm ? (
            <button
              type="button"
              className="link-btn"
              style={{ display: 'block', width: '100%', textAlign: 'center', fontSize: 13 }}
              onClick={() => setShowPassForm(true)}
            >
              Have a saved Supabase account? Sign in with email →
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {mode === 'sign_in' ? 'Account Sign In' : 'Create New Account'}
                </span>
                <button
                  type="button"
                  className="link-btn"
                  style={{ fontSize: 11 }}
                  onClick={() => setShowPassForm(false)}
                >
                  Hide form
                </button>
              </div>

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
                <label htmlFor="password">Password (min 8 chars)</label>
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

              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in');
                    setError('');
                    setInfo('');
                  }}
                  style={{ fontSize: 12 }}
                >
                  {mode === 'sign_in' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
