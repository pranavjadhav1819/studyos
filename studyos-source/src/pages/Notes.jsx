import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function Notes() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [subjects, setSubjects] = useState([])
  const [topics, setTopics] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [topicId, setTopicId] = useState(searchParams.get('topic') || '')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | saving | saved
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLists() {
      const [{ data: subjRows }, { data: topicRows }] = await Promise.all([
        supabase.from('subjects').select('*').order('created_at', { ascending: true }),
        supabase.from('topics').select('*').order('order_index', { ascending: true }),
      ])
      setSubjects(subjRows || [])
      setTopics(topicRows || [])
      const presetTopicId = searchParams.get('topic')
      if (presetTopicId) {
        const t = (topicRows || []).find((t) => t.id === presetTopicId)
        if (t) setSubjectId(t.subject_id)
      } else if ((subjRows || []).length > 0) {
        setSubjectId(subjRows[0].id)
      }
    }
    loadLists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const topicsForSubject = useMemo(() => topics.filter((t) => t.subject_id === subjectId), [topics, subjectId])

  useEffect(() => {
    if (!topicId && topicsForSubject.length > 0) setTopicId(topicsForSubject[0].id)
    if (topicId && !topicsForSubject.find((t) => t.id === topicId) && topicsForSubject.length > 0) {
      setTopicId(topicsForSubject[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsForSubject])

  useEffect(() => {
    if (!topicId) return
    setStatus('loading')
    setSearchParams(topicId ? { topic: topicId } : {}, { replace: true })
    supabase
      .from('notes')
      .select('content')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        setContent(data?.content || '')
        setStatus('idle')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId])

  async function save() {
    setStatus('saving')
    const { error } = await supabase
      .from('notes')
      .upsert(
        { user_id: user.id, topic_id: topicId, content, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,topic_id' }
      )
    if (error) setError(error.message)
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 1500)
  }

  return (
    <div>
      <div className="page-head">
        <h1>Notes</h1>
        <p>Notes are tied to a topic, so they surface right where you're deciding what to study.</p>
      </div>

      {subjects.length === 0 ? (
        <div className="empty">
          <strong>No subjects yet.</strong>
          Add a subject and a few topics before writing notes.
        </div>
      ) : (
        <>
          <div className="row section">
            <div className="field" style={{ minWidth: 200, marginBottom: 0 }}>
              <label>Subject</label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value)
                  setTopicId('')
                }}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ minWidth: 200, marginBottom: 0 }}>
              <label>Topic</label>
              <select value={topicId} onChange={(e) => setTopicId(e.target.value)} disabled={topicsForSubject.length === 0}>
                {topicsForSubject.length === 0 && <option value="">No topics in this subject</option>}
                {topicsForSubject.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {topicId ? (
            <div className="section">
              <div className="field">
                <textarea
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write what you'd tell yourself the night before the exam…"
                />
              </div>
              {error && <p className="error-text">{error}</p>}
              <button className="btn" onClick={save} disabled={status === 'saving'}>
                {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save note'}
              </button>
            </div>
          ) : (
            <div className="empty">Add a topic to this subject first.</div>
          )}
        </>
      )}
    </div>
  )
}
