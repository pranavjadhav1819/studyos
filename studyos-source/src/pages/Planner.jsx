import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { daysUntil, priorityScore, scoreTone, allocateMinutes } from '../lib/priority'

export default function Planner() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [progress, setProgress] = useState({})
  const [minutes, setMinutes] = useState(120)
  const [loading, setLoading] = useState(true)
  const [logged, setLogged] = useState({})

  useEffect(() => {
    async function load() {
      const [{ data: subjRows }, { data: topicRows }, { data: progRows }] = await Promise.all([
        supabase.from('subjects').select('*'),
        supabase.from('topics').select('*'),
        supabase.from('topic_progress').select('topic_id, knowledge_score').eq('user_id', user.id),
      ])
      setSubjects(subjRows || [])
      setTopics(topicRows || [])
      const map = {}
      ;(progRows || []).forEach((p) => (map[p.topic_id] = p.knowledge_score))
      setProgress(map)
      setLoading(false)
    }
    load()
  }, [user.id])

  const subjectsById = useMemo(() => Object.fromEntries(subjects.map((s) => [s.id, s])), [subjects])

  const ranked = useMemo(() => {
    return topics
      .map((t) => {
        const subj = subjectsById[t.subject_id]
        const score = progress[t.id] ?? 30
        const dLeft = subj ? daysUntil(subj.exam_date) : null
        return { topic: t, subject: subj, score, priority: priorityScore(score, dLeft) }
      })
      .sort((a, b) => b.priority - a.priority)
  }, [topics, progress, subjectsById])

  const allocated = allocateMinutes(ranked, minutes)

  async function logSession(topicId, plannedMinutes) {
    const { error } = await supabase.from('study_sessions').insert({
      user_id: user.id,
      topic_id: topicId,
      planned_minutes: plannedMinutes,
    })
    if (!error) setLogged((l) => ({ ...l, [topicId]: true }))
  }

  return (
    <div>
      <div className="page-head">
        <h1>Planner</h1>
        <p>Tell it how much time you have — it splits that time across your weakest, most urgent topics first.</p>
      </div>

      <div className="section">
        <div className="panel row" style={{ alignItems: 'center' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="minutes">Time available today</label>
            <select id="minutes" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
              <option value={300}>5 hours</option>
              <option value={360}>6 hour</option>
              <option value={420}>7 hours</option>
              <option value={480}>8 hours</option>
              <option value={540}>9 hours</option>
              <option value={600}>10 hours</option>
              <option value={660}>11 hours</option>
              <option value={720}>12 hour</option>
              <option value={780}>13 hours</option>
              <option value={840}>14 hours</option>
              <option value={900}>15 hours</option>
              <option value={960}>16 hours</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--paper-faint)' }}>Loading…</p>
      ) : ranked.length === 0 ? (
        <div className="empty">
          <strong>Nothing to plan yet.</strong>
          <Link to="/subjects">Add subjects and topics</Link> first, then come back here.
        </div>
      ) : (
        <div className="section">
          <div className="section-title">Study order for today</div>
          {ranked.map((item, i) => (
            <div className="planner-item" key={item.topic.id}>
              <div className="planner-rank">{i + 1}</div>
              <div className="ledger-row-main">
                <div className="ledger-row-title">{item.topic.name}</div>
                <div className="ledger-row-sub">{item.subject?.name}</div>
              </div>
              <div className={`pill`}>
                <span className={`dot bg-tone-${scoreTone(item.score)}`} />
                {item.score}%
              </div>
              <div className="planner-minutes">{allocated[i]}m</div>
              <button
                className="btn btn-ghost btn-sm"
                disabled={!!logged[item.topic.id]}
                onClick={() => logSession(item.topic.id, allocated[i])}
              >
                {logged[item.topic.id] ? 'Logged' : 'Log session'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
