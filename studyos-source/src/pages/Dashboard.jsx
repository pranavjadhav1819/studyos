import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { daysUntil, priorityScore, scoreTone, allocateMinutes } from '../lib/priority';

export default function Dashboard() {
  const { user } = useAuth();
  const context = useOutletContext();
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: subjRows }, { data: topicRows }, { data: progRows }] = await Promise.all([
        supabase.from('subjects').select('*'),
        supabase.from('topics').select('*'),
        supabase.from('topic_progress').select('topic_id, knowledge_score').eq('user_id', user.id),
      ]);
      setSubjects(subjRows || []);
      setTopics(topicRows || []);
      const map = {};
      (progRows || []).forEach((p) => (map[p.topic_id] = p.knowledge_score));
      setProgress(map);
      setLoading(false);
    }
    load();
  }, [user.id]);

  const subjectsById = useMemo(() => Object.fromEntries(subjects.map((s) => [s.id, s])), [subjects]);

  const ranked = useMemo(() => {
    return topics
      .map((t) => {
        const subj = subjectsById[t.subject_id];
        const score = progress[t.id] ?? 30;
        const dLeft = subj ? daysUntil(subj.exam_date) : null;
        return { topic: t, subject: subj, score, priority: priorityScore(score, dLeft) };
      })
      .sort((a, b) => b.priority - a.priority);
  }, [topics, progress, subjectsById]);

  const topFocus = ranked.slice(0, 3);
  const focusMinutes = allocateMinutes(topFocus, 120);

  const overallKnowledge = useMemo(() => {
    if (topics.length === 0) return null;
    const total = topics.reduce((sum, t) => sum + (progress[t.id] ?? 30), 0);
    return Math.round(total / topics.length);
  }, [topics, progress]);

  const upcomingExams = subjects
    .filter((s) => s.exam_date)
    .map((s) => ({ ...s, dLeft: daysUntil(s.exam_date) }))
    .filter((s) => s.dLeft >= 0)
    .sort((a, b) => a.dLeft - b.dLeft);

  if (loading) return <p style={{ color: 'var(--paper-faint)' }}>Loading ADHD StudyOS…</p>;

  return (
    <div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Dashboard</h1>
          <p>What to study next, based on what you actually know.</p>
        </div>
        <Link to="/adhd" className="btn btn-primary-adhd" style={{ textDecoration: 'none' }}>
          ⚡ Open ADHD Command Hub →
        </Link>
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
            <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Today's high-yield focus</span>
              <span style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 600 }}>🎯 Filtered by Weakness × Urgency</span>
            </div>

            {topFocus.length === 0 ? (
              <div className="empty">Add topics to a subject to get a focus list.</div>
            ) : (
              <div>
                {topFocus.map((item, i) => (
                  <div className="planner-item" key={item.topic.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="planner-rank">{i + 1}</div>
                    <div className="ledger-row-main" style={{ flex: 1 }}>
                      <div className="ledger-row-title">{item.topic.name}</div>
                      <div className="ledger-row-sub">{item.subject?.name}</div>
                    </div>
                    <div className={`score-num tone-${scoreTone(item.score)}`}>{item.score}%</div>
                    <div className="planner-minutes" style={{ minWidth: 50, textAlign: 'right' }}>{focusMinutes[i]}m</div>
                    <button
                      className="btn btn-sm btn-adhd-start"
                      style={{ padding: '6px 12px', fontSize: 12, fontWeight: 700 }}
                      onClick={() =>
                        context?.launchHyperfocus({
                          topic: item.topic.name,
                          step: `Dedicated Study Sprint: ${item.topic.name}`,
                          description: `Deep work block for ${item.subject?.name}. Target score: 80%+`,
                          minutes: focusMinutes[i] || 25,
                        })
                      }
                    >
                      ⚡ Hyperfocus →
                    </button>
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
                const subjTopics = topics.filter((t) => t.subject_id === s.id);
                const avg =
                  subjTopics.length > 0
                    ? Math.round(subjTopics.reduce((sum, t) => sum + (progress[t.id] ?? 30), 0) / subjTopics.length)
                    : null;
                const tone = avg != null ? scoreTone(avg) : 'amber';
                return (
                  <div className="ledger-row" key={s.id}>
                    <div className="ledger-row-main">
                      <Link to={`/subjects/${s.id}`} className="ledger-row-title" style={{ color: 'var(--paper)' }}>
                        {s.name}
                      </Link>
                      <div className="ledger-row-sub">
                        {subjTopics.length} topic{subjTopics.length === 1 ? '' : 's'}
                      </div>
                    </div>
                    <div className="score-track">
                      <div className={`score-fill bg-tone-${tone}`} style={{ width: `${avg ?? 0}%` }} />
                    </div>
                    <div className={`score-num tone-${tone}`}>{avg != null ? `${avg}%` : '—'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
