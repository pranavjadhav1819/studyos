import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { getSupabaseConfig } from '../../lib/supabase';
import {
  Flame,
  Bell,
  Clock,
  Key,
  Pause,
  Play,
  Square,
  Sparkles,
  ChevronDown,
  Database
} from 'lucide-react';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  onOpenDatabaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApiKeyModal, onOpenDatabaseModal }) => {
  const {
    activeSubject,
    subjects,
    switchSubject,
    timer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    examMode,
    setExamMode,
    geminiApiKey,
    notification,
    setNotification,
    setActiveView
  } = useStudyOS();

  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const supabaseConfig = getSupabaseConfig();

  // Format timer MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Brand & Subject Switcher */}
      <div className="flex items-center gap-4 md:gap-6">
        <div
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <span className="font-mono font-extrabold text-white text-base">.AI</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-lg">study<span className="text-brand-400">.AI</span></span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">Personal AI Study System</p>
          </div>
        </div>

        {/* Subject Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSubjectMenu(!showSubjectMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeSubject.color }}
            />
            <span className="truncate max-w-[140px] md:max-w-[180px] font-semibold">
              {activeSubject.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {showSubjectMenu && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Select Active Subject
              </div>
              <div className="space-y-1">
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      switchSubject(s.id);
                      setShowSubjectMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      s.id === activeSubject.id
                        ? 'bg-brand-600/20 text-brand-300 font-semibold border border-brand-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {s.daysLeft}d left
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Active Focus Session Timer Widget */}
      {timer.isRunning || timer.secondsRemaining > 0 ? (
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-950/80 border border-brand-500/40 text-brand-200 shadow-lg shadow-brand-500/10 animate-pulse">
          <Clock className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-medium text-slate-300 max-w-[180px] truncate">
            {timer.taskTitle}
          </span>
          <span className="font-mono font-bold text-sm text-brand-300">
            {formatTime(timer.secondsRemaining)}
          </span>
          <div className="flex items-center gap-1 ml-1">
            {timer.isRunning ? (
              <button
                onClick={pauseTimer}
                className="p-1 rounded-full hover:bg-brand-800/50 text-slate-300"
                title="Pause"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={resumeTimer}
                className="p-1 rounded-full hover:bg-brand-800/50 text-emerald-400"
                title="Resume"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={stopTimer}
              className="p-1 rounded-full hover:bg-rose-900/50 text-rose-400"
              title="Stop"
            >
              <Square className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Right: Exam Countdown, Supabase DB, Gemini AI, Profile */}
      <div className="flex items-center gap-2.5 md:gap-3.5">
        {/* Exam Countdown Pill */}
        <div
          onClick={() => setActiveView('planner')}
          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
        >
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="hidden sm:inline">Exam:</span>
          <span>{activeSubject.name.split(' ')[0]} — {activeSubject.daysLeft}d</span>
        </div>

        {/* Exam Mode Button */}
        <button
          onClick={() => setExamMode(!examMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            examMode
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-500'
              : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700'
          }`}
          title="Toggle 24-hour high-stakes Exam Mode"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{examMode ? '🔥 EXAM MODE' : 'Exam Mode'}</span>
        </button>

        {/* Supabase Database Button */}
        <button
          onClick={onOpenDatabaseModal}
          className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
            supabaseConfig.isConfigured
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
          }`}
          title={supabaseConfig.isConfigured ? 'Supabase Connected' : 'Connect Supabase Database'}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">{supabaseConfig.isConfigured ? 'Supabase' : 'Database'}</span>
        </button>

        {/* AI Key Status Button */}
        <button
          onClick={onOpenApiKeyModal}
          className={`relative p-2 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
            geminiApiKey
              ? 'bg-brand-500/10 border-brand-500/30 text-brand-300 shadow-sm shadow-brand-500/20'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title={geminiApiKey ? '✅ Gemini AI Connected — Click to configure' : 'Connect Gemini AI Key'}
        >
          <Key className={`w-3.5 h-3.5 ${geminiApiKey ? 'text-brand-400' : 'text-slate-400'}`} />
          <span className="hidden xl:inline font-semibold">
            {geminiApiKey ? '⚡ AI Live' : 'AI Key'}
          </span>
          {geminiApiKey && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {notification && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-200">
                <span>study.AI Adaptive Alerts</span>
                {notification && (
                  <button
                    onClick={() => setNotification(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="py-2.5">
                {notification ? (
                  <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200">
                    <p className="font-medium">{notification}</p>
                    <button
                      onClick={() => {
                        setActiveView('quizzes');
                        setShowNotifications(false);
                      }}
                      className="mt-2 text-[11px] underline text-rose-300 font-semibold"
                    >
                      Take Remedial Diagnostic Drill →
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No active system alerts</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-brand-500/40">
            PJ
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200">Pranav Jadhav</div>
            <div className="text-[10px] text-brand-400 font-medium">Computer Engineering</div>
          </div>
        </div>
      </div>
    </header>
  );
};
