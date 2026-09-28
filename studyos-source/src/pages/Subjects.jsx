import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { daysUntil } from '../lib/priority'

export default function Subjects() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState(null)
  const [name, setName] = useState('')
  const [examName, setExamName] = useState('')
  const [examDate, setExamDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setSubjects(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function addSubject(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError('')
    const { error } = await supabase.from('subjects').insert({
      user_id: user.id,
      name: name.trim(),
      exam_name: examName.trim() || null,
      exam_date: examDate || null,
    })
    if (error) setError(error.message)
    else {
      setName('')
      setExamName('')
      setExamDate('')
      await load()
    }
    setSaving(false)
  }

  async function removeSubject(id) {
    if (!confirm('Delete this subject and everything under it (syllabus, notes, progress)?')) return
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (error) setError(error.message)
    else load()
  }

  return (
    <div>
      <div className="page-head">
        <h1>Subjects</h1>
        <p>Each subject holds its own syllabus, topics, and exam date.</p>
      </div>

      <div className="section">
        <div className="section-title">Add a subject</div>
        <form onSubmit={addSubject} className="panel">
          <div className="row">
            <div className="field" style={{ flex: '1 1 200px', marginBottom: 0 }}>
              <label htmlFor="subject-name">Subject name</label>
              <input id="subject-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Operating Systems" required />
            </div>
            <div className="field" style={{ flex: '1 1 160px', marginBottom: 0 }}>
              <label htmlFor="exam-name">Exam (optional)</label>
              <input id="exam-name" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Mid-sem" />
            </div>
            <div className="field" style={{ flex: '1 1 150px', marginBottom: 0 }}>
              <label htmlFor="exam-date">Exam date</label>
              <input id="exam-date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            </div>
            <button className="btn" type="submit" disabled={saving} style={{ marginBottom: 0 }}>
              {saving ? 'Adding…' : 'Add subject'}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>

      <div className="section">
        <div className="section-title">Your subjects</div>
        {subjects === null && <p style={{ color: 'var(--paper-faint)' }}>Loading…</p>}
        {subjects && subjects.length === 0 && (
          <div className="empty">
            <strong>No subjects yet.</strong>
            Add your first subject above, then break it into units and topics.
          </div>
        )}
        {subjects && subjects.length > 0 && (
          <div className="ledger">
            {subjects.map((s) => {
              const dLeft = daysUntil(s.exam_date)
              return (
                <div className="ledger-row" key={s.id}>
                  <div className="ledger-row-main">
                    <Link to={`/subjects/${s.id}`} className="ledger-row-title" style={{ color: 'var(--paper)' }}>
                      {s.name}
                    </Link>
                    <div className="ledger-row-sub">
                      {s.exam_name || s.exam_date
                        ? `${s.exam_name || 'Exam'}${dLeft != null ? ` · ${dLeft >= 0 ? `${dLeft} day${dLeft === 1 ? '' : 's'} left` : 'date passed'}` : ''}`
                        : 'No exam date set'}
                    </div>
                  </div>
                  <Link to={`/subjects/${s.id}`} className="btn btn-ghost btn-sm">
                    Open syllabus
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => removeSubject(s.id)}>
                    Delete
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
