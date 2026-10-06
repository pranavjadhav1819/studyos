import { useState, useEffect } from 'react';
import { playBrownNoise, playRainNoise, playGammaPulse, stopAudio, getActiveAudioType } from '../lib/audioEngine';
import { localDB } from '../lib/dataStore';

export default function ADHDToolbar({ onOpenUnstick, onOpenBrainDump }) {
  const [activeSound, setActiveSound] = useState('none');
  const [bionicActive, setBionicActive] = useState(() => localStorage.getItem('studyos_bionic') === 'true');
  const [theme, setTheme] = useState(() => localStorage.getItem('studyos_theme') || 'default');
  const [xp, setXp] = useState(localDB.getXP());
  const streak = localDB.getStreak();

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studyos_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply bionic class
    if (bionicActive) {
      document.body.classList.add('bionic-active');
    } else {
      document.body.classList.remove('bionic-active');
    }
    localStorage.setItem('studyos_bionic', bionicActive);
  }, [bionicActive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setXp(localDB.getXP());
      const cur = getActiveAudioType() || 'none';
      if (cur !== activeSound) setActiveSound(cur);
    }, 1500);
    return () => clearInterval(interval);
  }, [activeSound]);

  function handleSound(type) {
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

  function cycleTheme() {
    const themes = ['default', 'sepia', 'cyber'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
  }

  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  return (
    <div className="adhd-top-strip">
      <div className="adhd-strip-left">
        {/* Unstick Button */}
        <button
          className="adhd-strip-btn unstick-btn"
          onClick={onOpenUnstick}
          title="Paralyzed on a task? Let AI break it into 3 microscopic 5-minute steps"
        >
          <span className="sparkle-icon">⚡</span>
          <span>Unstick Me!</span>
        </button>

        {/* Brain Dump Shortcut */}
        <button
          className="adhd-strip-btn"
          onClick={onOpenBrainDump}
          title="Park random intrusive thoughts so you don't lose focus"
        >
          <span>🧠 Mind Dump</span>
        </button>

        {/* Ambient Soundscape selector */}
        <div className="adhd-sound-selector">
          <span className="sound-label">🎧 Audio:</span>
          {[
            { id: 'brown', label: 'Brown' },
            { id: 'rain', label: 'Rain' },
            { id: 'gamma', label: '40Hz' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => handleSound(s.id)}
              className={`sound-mini-pill ${activeSound === s.id ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
          {activeSound !== 'none' && (
            <button onClick={() => handleSound(activeSound)} className="sound-stop-pill">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="adhd-strip-right">
        {/* Bionic Reading toggle */}
        <button
          className={`adhd-pill-btn ${bionicActive ? 'active' : ''}`}
          onClick={() => setBionicActive(!bionicActive)}
          title="Bionic Reading: Bolds initial word syllables to guide hyper-distracted eyes"
        >
          <span style={{ fontWeight: 800 }}>Bi</span>onic
        </button>

        {/* Theme button */}
        <button
          className="adhd-pill-btn"
          onClick={cycleTheme}
          title={`Active theme: ${theme}. Click to switch (Default / Warm Sepia / Cyber Focus)`}
        >
          🎨 {theme === 'default' ? 'Dark' : theme === 'sepia' ? 'Sepia' : 'Cyber'}
        </button>

        {/* Streak & XP Gamification */}
        <div className="adhd-xp-badge" title={`${xp} Total XP · +25 XP per focus block`}>
          <span className="streak-fire">🔥 {streak}d</span>
          <div className="xp-meter-wrap">
            <span className="xp-text">Lv {level} · {xpInCurrentLevel}/100 XP</span>
            <div className="xp-bar-bg">
              <div className="xp-bar-fill" style={{ width: `${xpInCurrentLevel}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
