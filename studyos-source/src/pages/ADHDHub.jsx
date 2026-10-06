import { useState } from 'react';
import { solveDoubtADHD, breakDownTask } from '../lib/geminiService';
import { playChime } from '../lib/audioEngine';
import { localDB } from '../lib/dataStore';

const PROMPT_SUGGESTIONS = [
  'Why does deadlock occur in OS?',
  "Explain Banker's Algorithm with ASCII diagram",
  'Paging vs Segmentation in 2 sentences',
  'What is TCP 3-Way Handshake mnemonic?',
];

export default function ADHDHub({ onLaunchHyperfocus }) {
  // Doubt Solver State
  const [question, setQuestion] = useState('');
  const [doubtLoading, setDoubtLoading] = useState(false);
  const [solution, setSolution] = useState(null);

  // Micro-Sprint Launcher
  const [customTopic, setCustomTopic] = useState('Operating Systems');
  const [customMinutes, setCustomMinutes] = useState(15);

  // Quick Unstick
  const [unstickInput, setUnstickInput] = useState('');
  const [unstickLoading, setUnstickLoading] = useState(false);
  const [unstickResult, setUnstickResult] = useState(null);

  async function handleSolve(q) {
    const query = q || question;
    if (!query.trim() || doubtLoading) return;
    setDoubtLoading(true);
    setSolution(null);
    try {
      const res = await solveDoubtADHD(query.trim(), customTopic);
      setSolution(res);
      playChime();
      localDB.addXP(15);
    } catch (err) {
      console.error(err);
    } finally {
      setDoubtLoading(false);
    }
  }

  async function handleQuickUnstick(e) {
    e.preventDefault();
    if (!unstickInput.trim() || unstickLoading) return;
    setUnstickLoading(true);
    try {
      const res = await breakDownTask(unstickInput.trim());
      setUnstickResult(res);
      playChime();
      localDB.addXP(20);
    } catch (err) {
      console.error(err);
    } finally {
      setUnstickLoading(false);
    }
  }

  return (
    <div className="adhd-hub-page">
      <div className="page-head">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(232, 163, 61, 0.15)', border: '1px solid var(--amber)', color: 'var(--amber)', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
          ⚡ ADHD Executive Function Center
        </div>
        <h1>ADHD Study Command Hub</h1>
        <p>
          Engineered for brains that crave dopamine, fight task paralysis, and thrive on visual, bite-sized momentum.
        </p>
      </div>

      <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Card 1: Instant Low-Friction Timer */}
        <div className="panel adhd-hub-card">
          <div className="card-top-icon">⏱️</div>
          <h2>Instant Focus Sprint</h2>
          <p className="card-subtext">
            Start with just <strong>15 minutes</strong>. Don't commit to hours — low friction beats resistance every single time.
          </p>

          <div className="field" style={{ marginTop: 14 }}>
            <label>What are you focusing on?</label>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Deadlocks, Banker's Algorithm, Review formulas..."
            />
          </div>

          <div className="adhd-timer-presets">
            {[
              { m: 15, label: '15m Micro-Sprint (Best to Start)' },
              { m: 25, label: '25m Standard Pomodoro' },
              { m: 45, label: '45m Deep Hyperfocus' },
            ].map((p) => (
              <button
                key={p.m}
                type="button"
                onClick={() => setCustomMinutes(p.m)}
                className={`adhd-preset-chip ${customMinutes === p.m ? 'selected' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary-adhd"
            style={{ width: '100%', marginTop: 16 }}
            onClick={() =>
              onLaunchHyperfocus({
                topic: customTopic || 'Study Sprint',
                step: `${customMinutes}-Minute Focused Deep Work`,
                description: 'Keep your focus strictly on this one block. Turn on ambient brown noise below.',
                minutes: customMinutes,
              })
            }
          >
            🚀 Launch in Hyperfocus Shield ({customMinutes}m)
          </button>
        </div>

        {/* Card 2: AI Task Paralysis Breaker */}
        <div className="panel adhd-hub-card">
          <div className="card-top-icon">⚡</div>
          <h2>Task Paralysis Breaker</h2>
          <p className="card-subtext">
            Stuck procrastinating? Give AI the name of the scary topic. It'll decompose it into 3 microscopic 5-minute steps.
          </p>

          <form onSubmit={handleQuickUnstick} style={{ marginTop: 14 }}>
            <div className="field">
              <label>Intimidating topic</label>
              <input
                type="text"
                value={unstickInput}
                onChange={(e) => setUnstickInput(e.target.value)}
                placeholder="e.g. Chapter 4 Paging, Dynamic Programming LCS..."
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary-adhd"
              style={{ width: '100%' }}
              disabled={unstickLoading || !unstickInput.trim()}
            >
              {unstickLoading ? '🧠 Deconstructing...' : '⚡ Break It Down (3 Easy Steps)'}
            </button>
          </form>

          {unstickResult && (
            <div className="adhd-unstick-inline-results" style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, marginBottom: 8 }}>
                ✨ {unstickResult.dopamineHook}
              </div>
              {unstickResult.steps.map((s, idx) => (
                <div key={idx} className="adhd-mini-step-row">
                  <div>
                    <strong>Step {s.stepNumber}:</strong> {s.title} ({s.durationMins}m)
                    <div style={{ fontSize: 11, color: 'var(--paper-dim)' }}>{s.description}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-adhd-start"
                    onClick={() =>
                      onLaunchHyperfocus({
                        topic: unstickResult.topic,
                        step: s.title,
                        description: s.description,
                        minutes: s.durationMins,
                      })
                    }
                  >
                    Start →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Socratic Doubt Solver Card (Full Width) */}
      <div className="panel" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>🧠</span>
          <div>
            <h2 style={{ fontSize: 18, margin: 0 }}>Socratic AI Doubt Solver</h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--paper-faint)' }}>
              Get low-cognitive-load explanations: 2 sentences max, 1 visual ASCII flow, and 1 sticky mnemonic rule.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
            placeholder="Type your study doubt (e.g. Why does deadlock occur?)..."
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary-adhd"
            onClick={() => handleSolve()}
            disabled={doubtLoading || !question.trim()}
          >
            {doubtLoading ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--paper-faint)', alignSelf: 'center' }}>Try asking:</span>
          {PROMPT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="adhd-chip-btn"
              onClick={() => {
                setQuestion(s);
                handleSolve(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Solution Container */}
        {solution && (
          <div className="adhd-solution-box" style={{ marginTop: 16 }}>
            <div className="adhd-sol-section">
              <span className="adhd-sol-tag">🧠 Simple Explanation (ELI5)</span>
              <p className="adhd-sol-text">{solution.simpleExplanation}</p>
            </div>

            {solution.asciiDiagram && (
              <div className="adhd-sol-section">
                <span className="adhd-sol-tag">💡 Visual Flow / Diagram</span>
                <pre className="adhd-ascii-block">{solution.asciiDiagram}</pre>
              </div>
            )}

            <div className="adhd-sol-section">
              <span className="adhd-sol-tag">📌 Must-Remember Mnemonic Rule</span>
              <div className="adhd-mnemonic-pill">{solution.mnemonic}</div>
            </div>

            {solution.examTip && (
              <div className="adhd-sol-section">
                <span className="adhd-sol-tag">⭐ University Exam Tip</span>
                <p className="adhd-sol-text" style={{ color: 'var(--green)' }}>{solution.examTip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
