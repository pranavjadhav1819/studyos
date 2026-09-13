import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import SubjectDetail from './pages/SubjectDetail'
import Planner from './pages/Planner'
import Notes from './pages/Notes'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:id" element={<SubjectDetail />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/notes" element={<Notes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
