import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import ADHDToolbar from './ADHDToolbar';
import UnstickModal from './UnstickModal';
import BrainDumpModal from './BrainDumpModal';
import HyperfocusOverlay from './HyperfocusOverlay';

const links = [
  { to: '/', label: 'Dashboard', end: true, icon: '📊' },
  { to: '/adhd', label: '⚡ ADHD Hub', icon: '🧠', highlight: true },
  { to: '/subjects', label: 'Subjects', icon: '📚' },
  { to: '/planner', label: 'Planner', icon: '📅' },
  { to: '/notes', label: 'Notes', icon: '📝' },
];

export default function Layout() {
  const { user, loading, signOut, isGuest } = useAuth();
  const [unstickOpen, setUnstickOpen] = useState(false);
  const [brainDumpOpen, setBrainDumpOpen] = useState(false);
  const [activeHyperfocus, setActiveHyperfocus] = useState(null);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      {/* Hyperfocus Shield (Single Task Mode) */}
      {activeHyperfocus && (
        <HyperfocusOverlay
          task={activeHyperfocus}
          onExit={() => setActiveHyperfocus(null)}
          onOpenBrainDump={() => setBrainDumpOpen(true)}
        />
      )}

      {/* Unstick Paralysis Breaker Modal */}
      <UnstickModal
        isOpen={unstickOpen}
        onClose={() => setUnstickOpen(false)}
        onStartTask={(task) => setActiveHyperfocus(task)}
      />

      {/* Brain Dump Intrusive Thought Parking Lot */}
      <BrainDumpModal
        isOpen={brainDumpOpen}
        onClose={() => setBrainDumpOpen(false)}
      />

      <aside className="sidebar">
        <div className="wordmark">
          study<span>OS</span>
        </div>
        <div className="tagline">ADHD-Friendly Study Workspace</div>

        {/* Quick Action Floating Bar inside Sidebar */}
        <div className="adhd-sidebar-quick-actions" style={{ marginBottom: 20 }}>
          <button
            className="btn btn-primary-adhd btn-sm"
            style={{ width: '100%', marginBottom: 6, fontSize: 12, padding: '7px 10px' }}
            onClick={() => setUnstickOpen(true)}
          >
            ⚡ Unstick Me!
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', fontSize: 12, padding: '7px 10px' }}
            onClick={() => setBrainDumpOpen(true)}
          >
            🧠 Mind Dump
          </button>
        </div>

        <ul className="nav-list">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  'nav-link' +
                  (isActive ? ' active' : '') +
                  (l.highlight ? ' adhd-nav-highlight' : '')
                }
              >
                <span style={{ marginRight: 6 }}>{l.icon}</span>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div style={{ fontSize: 11, color: isGuest ? 'var(--amber)' : 'var(--paper-dim)' }}>
            {isGuest ? '⚡ Instant ADHD Guest Mode' : user.email}
          </div>
          <button onClick={signOut} style={{ marginTop: 4 }}>
            {isGuest ? 'Exit Guest Mode' : 'Sign out'}
          </button>
        </div>
      </aside>

      <main className="main" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Top ADHD Ambient Toolbar */}
        <ADHDToolbar
          onOpenUnstick={() => setUnstickOpen(true)}
          onOpenBrainDump={() => setBrainDumpOpen(true)}
        />

        <div className="main-content-scroll" style={{ flex: 1, padding: '24px 32px' }}>
          <Outlet context={{ launchHyperfocus: (task) => setActiveHyperfocus(task) }} />
        </div>
      </main>
    </div>
  );
}
