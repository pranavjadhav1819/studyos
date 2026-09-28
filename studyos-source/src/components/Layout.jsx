import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/subjects', label: 'Subjects' },
  { to: '/planner', label: 'Planner' },
  { to: '/notes', label: 'Notes' },
]

export default function Layout() {
  const { user, loading, signOut } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="wordmark">Study<span>OS</span></div>
        <div className="tagline">Your syllabus learns with you.</div>
        <ul className="nav-list">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          {user.email}
          <br />
          <button onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
