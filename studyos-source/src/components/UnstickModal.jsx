import { useState } from 'react';
import { breakDownTask } from '../lib/geminiService';
import { playChime } from '../lib/audioEngine';
import { localDB } from '../lib/dataStore';

export default function UnstickModal({ isOpen, onClose, onStartTask }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  if (!isOpen) return null;

  async function handleDecompose(e) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const res = await breakDownTask(input.trim());
      setPlan(res);
      playChime();
      localDB.addXP(20);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adhd-modal-backdrop" onClick={onClose}>
      <div className="adhd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adhd-modal-header">
          <div className="adhd-badge-pill">⚡ ADHD Emergency Tool</div>
          <h2>Task Paralysis Breaker</h2>
          <p className="adhd-modal-sub">
            Stuck, dreading, or procrastinating on a topic? We'll break it into 3 microscopic, frictionless 5-minute steps.
          </p>
        </div>

        {!plan ? (
          <form onSubmit={handleDecompose}>
            <div className="field">
              <label htmlFor="unstick-topic">What topic or task is intimidating you right now?</label>
              <input
                id="unstick-topic"
                type="text"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Deadlocks, Banker's Algorithm, Chapter 3 notes, Essay intro..."
                required
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: 'var(--paper-faint)' }}>Quick examples:</span>
              {['Deadlock Coffman Proofs', 'TCP Sliding Window', 'Dynamic Programming Matrix'].map((ex) => (
                <button
                  type="button"
                  key={ex}
                  onClick={() => setInput(ex)}
                  className="adhd-chip-btn"
                >
                  {ex}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary-adhd" disabled={loading || !input.trim()}>
                {loading ? '🧠 Deconstructing...' : '⚡ Break It Down For Me'}
              </button>
            </div>
          </form>
        ) : (
          <div className="adhd-plan-view">
            <div className="adhd-dopamine-banner">
              <strong>✨ Dopamine Kick:</strong> {plan.dopamineHook}
            </div>

            <div className="adhd-steps-list">
              {plan.steps.map((st, idx) => (
                <div key={idx} className="adhd-step-card">
                  <div className="adhd-step-num">Step {st.stepNumber}</div>
                  <div className="adhd-step-content">
                    <div className="adhd-step-title">{st.title}</div>
                    <div className="adhd-step-desc">{st.description}</div>
                  </div>
                  <div className="adhd-step-time">{st.durationMins}m</div>
                  <button
                    className="btn btn-sm btn-adhd-start"
                    onClick={() => {
                      onStartTask({
                        topic: plan.topic,
                        step: st.title,
                        description: st.description,
                        minutes: st.durationMins,
                      });
                      onClose();
                    }}
                  >
                    Start Now →
                  </button>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 8 }}>
              🎁 <strong>Reward Idea:</strong> {plan.rewardTip}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button className="btn btn-ghost" onClick={() => setPlan(null)}>
                ← Try another topic
              </button>
              <button className="btn" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
