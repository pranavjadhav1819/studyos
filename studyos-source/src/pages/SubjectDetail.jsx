import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { daysUntil, scoreTone, scoreLabel } from '../lib/priority'

function TopicRow({ topic, initialScore, onChanged, onDelete }) {
  const [score, setScore] = useState(initialScore)
  const [dirty, setDirty] = useState(false)

  async function commit(value) {
    const { error } = await supabase
      .from('topic_progress')
      .upsert(
        { user_id: topic.user_id, topic_id: topic.id, knowledge_score: value, last_studied: new Date().toISOString() },
        { onConflict: 'user_id,topic_id' }
      )
    if (!error) onChanged(topic.id, value)
    setDirty(false)
  }

  const tone = scoreTone(score)

  return (
    <div className="ledger-row">
      <div className="ledger-row-main">
        <div className="ledger-row-title">{topic.name}</div>
        <div className="ledger-row-sub">
          <Link to={`/notes?topic=${topic.id}`}>Notes</Link>
        </div>
      </div>
      <div className="range-row" style={{ width: 220 }}>
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => {
            setScore(Number(e.target.value))
            setDirty(true)
          }}
          onMouseUp={(e) => commit(Number(e.target.value))}
          onTouchEnd={(e) => commit(Number(e.target.value))}
          onKeyUp={(e) => commit(Number(e.target.value))}
          aria-label={`Knowledge level for ${topic.name}`}
        />
      </div>
      <div className={`score-num tone-${tone}`}>{score}{dirty ? '·' : ''}</div>
      <div className="pill">
        <span className={`dot bg-tone-${tone}`} />
        {scoreLabel(score)}
      </div>
      <button className="btn btn-ghost btn-sm" onClick={() => onDelete(topic.id)}>
        Remove
      </button>
    </div>
  )
}

export default function SubjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [units, setUnits] = useState([])
  const [topics, setTopics] = useState([])
  const [progress, setProgress] = useState({})
  const [newUnit, setNewUnit] = useState('')
  const [newTopic, setNewTopic] = useState({})
  const [error, setError] = useState('')

  async function loadAll() {
    const [{ data: subj, error: e1 }, { data: unitRows, error: e2 }, { data: topicRows, error: e3 }, { data: progRows, error: e4 }] =
      await Promise.all([
        supabase.from('subjects').select('*').eq('id', id).single(),
        supabase.from('units').select('*').eq('subject_id', id).order('order_index', { ascending: true }),
        supabase.from('topics').select('*').eq('subject_id', id).order('order_index', { ascending: true }),
        supabase.from('topic_progress').select('topic_id, knowledge_score').eq('user_id', user.id),
      ])
    if (e1 || e2 || e3 || e4) setError((e1 || e2 || e3 || e4).message)
    setSubject(subj)
    setUnits(unitRows || [])
    setTopics(topicRows || [])
    const map = {}
    ;(progRows || []).forEach((p) => (map[p.topic_id] = p.knowledge_score))
    setProgress(map)
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function addUnit(e) {
    e.preventDefault()
    if (!newUnit.trim()) return
    const { error } = await supabase.from('units').insert({
      subject_id: id,
      name: newUnit.trim(),
      order_index: units.length,
    })
    if (error) setError(error.message)
    else {
      setNewUnit('')
      loadAll()
    }
  }

  async function addTopic(unitId, e) {
    e.preventDefault()
    const name = (newTopic[unitId] || '').trim()
    if (!name) return
    const { error } = await supabase.from('topics').insert({
      subject_id: id,
      unit_id: unitId,
      name,
      order_index: topics.filter((t) => t.unit_id === unitId).length,
    })
    if (error) setError(error.message)
    else {
      setNewTopic((s) => ({ ...s, [unitId]: '' }))
      loadAll()
    }
  }

  async function deleteUnit(unitId) {
    if (!confirm('Delete this unit and its topics?')) return
    await supabase.from('units').delete().eq('id', unitId)
    loadAll()
  }

  async function deleteTopic(topicId) {
    await supabase.from('topics').delete().eq('id', topicId)
    loadAll()
  }

  async function deleteSubject() {
    if (!confirm(`Delete "${subject.name}" and everything in it?`)) return
    await supabase.from('subjects').delete().eq('id', id)
    navigate('/subjects')
  }

  const overall = useMemo(() => {
    if (topics.length === 0) return null
    const total = topics.reduce((sum, t) => sum + (progress[t.id] ?? 30), 0)
    return Math.round(total / topics.length)
  }, [topics, progress])

  const dLeft = subject ? daysUntil(subject.exam_date) : null

  if (!subject) return <p style={{ color: 'var(--paper-faint)' }}>Loading…</p>

  return (
    <div>
      <div className="crumb">
        <Link to="/subjects">Subjects</Link> / {subject.name}
      </div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1>{subject.name}</h1>
          <p>
            {subject.exam_name || subject.exam_date
              ? `${subject.exam_name || 'Exam'}${dLeft != null ? ` · ${dLeft >= 0 ? `${dLeft} day${dLeft === 1 ? '' : 's'} left` : 'date passed'}` : ''}`
              : 'No exam date set for this subject.'}
            {overall != null && ` · Overall knowledge ${overall}%`}
          </p>
        </div>
        <button className="btn btn-danger btn-sm" onClick={deleteSubject}>
          Delete subject
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="section">
        <div className="section-title">Add a unit</div>
        <form onSubmit={addUnit} className="row">
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <input value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="e.g. Unit 2 — CPU Scheduling & Deadlocks" />
          </div>
          <button className="btn" type="submit">
            Add unit
          </button>
        </form>
      </div>

      {units.length === 0 && (
        <div className="empty">
          <strong>No units yet.</strong>
          Break the syllabus into units first, then add topics under each one.
        </div>
      )}

      {units.map((u) => {
        const unitTopics = topics.filter((t) => t.unit_id === u.id)
        return (
          <div className="section" key={u.id}>
            <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{u.name}</span>
              <button className="link-btn" style={{ color: 'var(--red)' }} onClick={() => deleteUnit(u.id)}>
                Delete unit
              </button>
            </div>

            {unitTopics.length > 0 && (
              <div className="ledger">
                {unitTopics.map((t) => (
                  <TopicRow
                    key={t.id}
                    topic={{ ...t, user_id: user.id }}
                    initialScore={progress[t.id] ?? 30}
                    onChanged={(topicId, val) => setProgress((p) => ({ ...p, [topicId]: val }))}
                    onDelete={deleteTopic}
                  />
                ))}
              </div>
            )}

            <form onSubmit={(e) => addTopic(u.id, e)} className="row" style={{ marginTop: 12 }}>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                <input
                  value={newTopic[u.id] || ''}
                  onChange={(e) => setNewTopic((s) => ({ ...s, [u.id]: e.target.value }))}
                  placeholder="Add a topic in this unit"
                />
              </div>
              <button className="btn btn-ghost btn-sm" type="submit">
                Add topic
              </button>
            </form>
          </div>
        )
      })}
    </div>
  )
}
