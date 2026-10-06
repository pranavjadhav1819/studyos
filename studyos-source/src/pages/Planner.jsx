import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { daysUntil, priorityScore, scoreTone, allocateMinutes } from '../lib/priority';

export default function Planner() {
  const { user } = useAuth();
  const context = useOutletContext();
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [minutes, setMinutes] = useState(120);
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState({});

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

  const allocated = allocateMinutes(ranked, minutes);

  async function logSession(topicId, plannedMinutes) {
    const { error } = await supabase.from('study_sessions').insert({
      user_id: user.id,
      topic_id: topicId,
      planned_minutes: plannedMinutes,
    });
    if (!error) setLogged((l) => ({ ...l, [topicId]: true }));
  }

  return (
    <div>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Planner</h1>
          <p>Tell it how much time you have — it splits that time across your weakest, most urgent topics first.</p>
        </div>
        <Link to="/adhd" className="btn btn-primary-adhd" style={{ textDecoration: 'none' }}>
          ⚡ Open ADHD Command Hub →
        </Link>
      </div>

      <div className="section">
        <div className="panel row" style={{ alignItems: 'center' }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="minutes">Time available today</label>
            <select id="minutes" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
              <option value={15}>15 minutes (Quick Micro-Sprint)</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
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
          <div className="section-title">Ranked study plan for today</div>
          <div className="ledger">
            {ranked.map((item, idx) => {
              const itemMinutes = allocated[idx];
              const isLogged = logged[item.topic.id];
              return (
                <div className="ledger-row" key={item.topic.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="planner-rank">{idx + 1}</div>
                  <div className="ledger-row-main" style={{ flex: 1 }}>
                    <div className="ledger-row-title">{item.topic.name}</div>
                    <div className="ledger-row-sub">{item.subject?.name}</div>
                  </div>
                  <div className={`score-num tone-${scoreTone(item.score)}`}>{item.score}%</div>
                  <div className="planner-minutes" style={{ minWidth: 45, textAlign: 'right' }}>{itemMinutes}m</div>
                  
                  <button
                    className="btn btn-sm btn-adhd-start"
                    onClick={() => {
                      logSession(item.topic.id, itemMinutes);
                      context?.launchHyperfocus({
                        topic: item.topic.name,
                        step: `Planned Session: ${item.topic.name}`,
                        description: `Scheduled priority topic for ${item.subject?.name}. Target: +10% mastery`,
                        minutes: itemMinutes || 25,
                      });
                    }}
                  >
                    ⚡ Hyperfocus →
                  </button>

                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={isLogged}
                    onClick={() => logSession(item.topic.id, itemMinutes)}
                  >
                    {isLogged ? '✓ Logged' : 'Log'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
