import { useState, useEffect } from 'react';
import { playChime, playBrownNoise, playRainNoise, playGammaPulse, stopAudio, getActiveAudioType } from '../lib/audioEngine';
import { localDB } from '../lib/dataStore';

export default function HyperfocusOverlay({ task, onExit, onOpenBrainDump }) {
  const [secondsLeft, setSecondsLeft] = useState((task?.minutes || 15) * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [activeSound, setActiveSound] = useState(getActiveAudioType() || 'none');

  const totalSeconds = (task?.minutes || 15) * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            handleComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  function handleComplete() {
    setIsRunning(false);
    setCompleted(true);
    playChime();
    localDB.addXP(50);
  }

  function handleSoundChange(type) {
    if (type === activeSound) {
      stopAudio();
      setActiveSound('none');
    } else {
      if (type === 'brown') playBrownNoise();
      else if (type === 'rain') playRainNoise();
      else if (type === 'gamma') playGammaPulse();
      setActiveSound(type);
    }
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function addFiveMinutes() {
    setSecondsLeft((s) => s + 300);
  }

  return (
    <div className="hyperfocus-shield">
      <div className="hyperfocus-top-bar">
        <div className="hyperfocus-badge">🎯 Single-Task Hyperfocus Shield</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="adhd-chip-btn" onClick={onOpenBrainDump} title="Jot down a distraction without leaving">
            🧠 Quick Mind Dump
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onExit}>
            ✕ Exit Shield
          </button>
        </div>
      </div>

      <div className="hyperfocus-core">
        <div className="hyperfocus-topic-tag">{task?.topic || 'Current Focus Topic'}</div>
        <h1 className="hyperfocus-title">{task?.step || 'Deep Work Session'}</h1>
        {task?.description && <p className="hyperfocus-desc">{task.description}</p>}

        {/* Circular Progress & Timer */}
        <div className="hyperfocus-timer-ring">
          <svg viewBox="0 0 200 200" className="timer-svg">
            <circle cx="100" cy="100" r="88" className="timer-bg-circle" />
            <circle
              cx="100"
              cy="100"
              r="88"
              className="timer-fg-circle"
              style={{
                strokeDashoffset: 553 - (553 * progressPercent) / 100,
              }}
            />
          </svg>
          <div className="hyperfocus-time-display">
            <span className="time-numbers">{formatTime(secondsLeft)}</span>
            <span className="time-status">{isRunning ? 'HYPERFOCUSING' : completed ? 'VICTORY!' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="hyperfocus-controls">
          <button
            className={`btn ${isRunning ? 'btn-ghost' : 'btn-primary-adhd'}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button className="btn btn-ghost" onClick={addFiveMinutes}>
            +5 Mins
          </button>
          <button className="btn btn-primary-adhd" onClick={handleComplete}>
            ✓ Mark Done (+50 XP)
          </button>
        </div>

        {/* Audio Soundscape Bar */}
        <div className="hyperfocus-sound-bar">
          <span style={{ fontSize: 12, color: 'var(--paper-faint)' }}>ADHD Soundscapes:</span>
          {[
            { id: 'brown', label: '🌊 Brown Noise' },
            { id: 'rain', label: '🌧 Rain' },
            { id: 'gamma', label: '⚡ 40Hz Gamma' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => handleSoundChange(s.id)}
              className={`adhd-sound-chip ${activeSound === s.id ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
          {activeSound !== 'none' && (
            <button
              onClick={() => handleSoundChange(activeSound)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '2px 8px', fontSize: 11 }}
            >
              Mute
            </button>
          )}
        </div>

        {completed && (
          <div className="hyperfocus-victory-popup">
            <h2>🎉 Fantastic Focus Sprint!</h2>
            <p>You earned <strong>+50 XP</strong> for beating procrastination.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
              <button className="btn btn-primary-adhd" onClick={onExit}>
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
