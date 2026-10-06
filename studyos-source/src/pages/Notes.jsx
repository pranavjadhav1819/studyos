import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { summarizeForADHD } from '../lib/geminiService';
import { playChime } from '../lib/audioEngine';

export default function Notes() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState(searchParams.get('topic') || '');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | saving | saved
  const [error, setError] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function loadLists() {
      const [{ data: subjRows }, { data: topicRows }] = await Promise.all([
        supabase.from('subjects').select('*').order('created_at', { ascending: true }),
        supabase.from('topics').select('*').order('order_index', { ascending: true }),
      ]);
      setSubjects(subjRows || []);
      setTopics(topicRows || []);
      const presetTopicId = searchParams.get('topic');
      if (presetTopicId) {
        const t = (topicRows || []).find((t) => t.id === presetTopicId);
        if (t) setSubjectId(t.subject_id);
      } else if ((subjRows || []).length > 0) {
        setSubjectId(subjRows[0].id);
      }
    }
    loadLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topicsForSubject = useMemo(() => topics.filter((t) => t.subject_id === subjectId), [topics, subjectId]);
  const activeTopic = topics.find((t) => t.id === topicId);

  useEffect(() => {
    if (!topicId && topicsForSubject.length > 0) setTopicId(topicsForSubject[0].id);
    if (topicId && !topicsForSubject.find((t) => t.id === topicId) && topicsForSubject.length > 0) {
      setTopicId(topicsForSubject[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicsForSubject]);

  useEffect(() => {
    if (!topicId) return;
    setStatus('loading');
    setAiSummary('');
    setSearchParams(topicId ? { topic: topicId } : {}, { replace: true });
    supabase
      .from('notes')
      .select('content')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setContent(data?.content || '');
        setStatus('idle');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  async function save() {
    setStatus('saving');
    const { error } = await supabase.from('notes').upsert(
      { user_id: user.id, topic_id: topicId, content, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,topic_id' }
    );
    if (error) setError(error.message);
    setStatus('saved');
    playChime();
    setTimeout(() => setStatus('idle'), 1500);
  }

  async function handleAiSummarize() {
    if (!content.trim() || aiLoading) return;
    setAiLoading(true);
    try {
      const summary = await summarizeForADHD(activeTopic?.name || 'Topic', content);
      setAiSummary(summary);
      playChime();
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Notes</h1>
          <p>Notes are tied to a topic, so they surface right where you're deciding what to study.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-primary-adhd"
            onClick={handleAiSummarize}
            disabled={aiLoading || !content.trim()}
          >
            {aiLoading ? '🧠 Condensing...' : '⚡ AI ADHD Cheat Sheet'}
          </button>
          <button className="btn" onClick={save} disabled={status === 'saving' || !topicId}>
            {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save note'}
          </button>
        </div>
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
                  setSubjectId(e.target.value);
                  setTopicId('');
                }}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field" style={{ minWidth: 240, marginBottom: 0 }}>
              <label>Topic</label>
              <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                {topicsForSubject.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI ADHD Cheat Sheet Box */}
          {aiSummary && (
            <div className="panel adhd-summary-banner" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)' }}>
                  ⚡ High-Yield ADHD Cheat Sheet
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 11 }}
                  onClick={() => setAiSummary('')}
                >
                  Close
                </button>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: 'var(--paper)' }}>
                {aiSummary}
              </div>
            </div>
          )}

          <div className="panel" style={{ padding: 0 }}>
            <textarea
              className="note-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jot formulas, common exam traps, and mnemonics for this topic..."
              rows={16}
            />
          </div>
        </>
      )}
    </div>
  );
}
