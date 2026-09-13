import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { daysUntil, priorityScore, scoreTone, allocateMinutes } from '../lib/priority'

export default function Dashboard() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)

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

  const topFocus = ranked.slice(0, 3)
  const focusMinutes = allocateMinutes(topFocus, 120)

  const overallKnowledge = useMemo(() => {
    if (topics.length === 0) return null
    const total = topics.reduce((sum, t) => sum + (progress[t.id] ?? 30), 0)
    return Math.round(total / topics.length)
  }, [topics, progress])

  const upcomingExams = subjects
    .filter((s) => s.exam_date)
    .map((s) => ({ ...s, dLeft: daysUntil(s.exam_date) }))
    .filter((s) => s.dLeft >= 0)
    .sort((a, b) => a.dLeft - b.dLeft)

  if (loading) return <p style={{ color: 'var(--paper-faint)' }}>Loading…</p>

  return (
    <div>
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>What to study next, based on what you actually know.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="empty">
          <strong>Nothing set up yet.</strong>
          <Link to="/subjects">Add your first subject</Link> and break it into topics — this page fills in once there's something to rank.
        </div>
      ) : (
        <>
          <div className="section grid-stats">
            <div className="panel stat">
              <div className="num">{overallKnowledge != null ? `${overallKnowledge}%` : '—'}</div>
              <div className="label">Overall knowledge</div>
            </div>
            <div className="panel stat">
              <div className="num">{subjects.length}</div>
              <div className="label">Subjects tracked</div>
            </div>
            <div className="panel stat">
              <div className="num">{upcomingExams[0] ? upcomingExams[0].dLeft : '—'}</div>
              <div className="label">{upcomingExams[0] ? `Days to ${upcomingExams[0].name}` : 'No exam set'}</div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Today's focus</div>
            {topFocus.length === 0 ? (
              <div className="empty">Add topics to a subject to get a focus list.</div>
            ) : (
              <div>
                {topFocus.map((item, i) => (
                  <div className="planner-item" key={item.topic.id}>
                    <div className="planner-rank">{i + 1}</div>
                    <div className="ledger-row-main">
                      <div className="ledger-row-title">{item.topic.name}</div>
                      <div className="ledger-row-sub">{item.subject?.name}</div>
                    </div>
                    <div className={`score-num tone-${scoreTone(item.score)}`}>{item.score}</div>
                    <div className="planner-minutes">{focusMinutes[i]}m</div>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: 12, color: 'var(--paper-faint)', marginTop: 10 }}>
              Based on a 2-hour study day. <Link to="/planner">Set your own time budget in Planner →</Link>
            </p>
          </div>

          <div className="section">
            <div className="section-title">Knowledge by subject</div>
            <div className="ledger">
              {subjects.map((s) => {
                const subjTopics = topics.filter((t) => t.subject_id === s.id)
                const avg =
                  subjTopics.length > 0
                    ? Math.round(subjTopics.reduce((sum, t) => sum + (progress[t.id] ?? 30), 0) / subjTopics.length)
                    : null
                const tone = avg != null ? scoreTone(avg) : 'amber'
                return (
                  <div className="ledger-row" key={s.id}>
                    <div className="ledger-row-main">
                      <Link to={`/subjects/${s.id}`} className="ledger-row-title" style={{ color: 'var(--paper)' }}>
                        {s.name}
                      </Link>
                      <div className="ledger-row-sub">{subjTopics.length} topic{subjTopics.length === 1 ? '' : 's'}</div>
                    </div>
                    <div className="score-track">
                      <div className={`score-fill bg-tone-${tone}`} style={{ width: `${avg ?? 0}%` }} />
                    </div>
                    <div className={`score-num tone-${tone}`}>{avg != null ? `${avg}` : '—'}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {upcomingExams.length > 0 && (
            <div className="section">
              <div className="section-title">Exam countdown</div>
              <div className="ledger">
                {upcomingExams.map((s) => (
                  <div className="ledger-row" key={s.id}>
                    <div className="ledger-row-main">
                      <div className="ledger-row-title">{s.exam_name || s.name}</div>
                      <div className="ledger-row-sub">{s.name}</div>
                    </div>
                    <div className="num" style={{ fontSize: 20 }}>
                      {s.dLeft} day{s.dLeft === 1 ? '' : 's'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
