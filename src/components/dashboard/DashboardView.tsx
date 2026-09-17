import React from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  Flame,
  CheckCircle2,
  Circle,
  Play,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  CalendarDays,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeSubject,
    todaysFocus,
    toggleFocusTask,
    startTimer,
    setActiveView,
    rebalanceAdaptivePlan,
    studyPlan
  } = useStudyOS();

  // Knowledge metrics matching user specification
  const knowledgeItems = [
    { title: 'Processes + Threads', score: 85, status: 'Strong', color: 'bg-emerald-500' },
    { title: 'CPU Scheduling', score: 82, status: 'Strong', color: 'bg-emerald-500' },
    { title: 'Deadlocks', score: 41, status: 'Weak', isWeak: true, color: 'bg-rose-500' },
    { title: 'Memory Management', score: 67, status: 'Moderate', color: 'bg-amber-500' },
    { title: 'File Systems', score: 73, status: 'Good', color: 'bg-blue-500' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Welcome Banner & Urgency Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Good morning, Pranav 👋
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              On Track 🔥 Day Streak: 5
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            study.AI has calibrated your schedule. Exam in{' '}
            <span className="text-amber-300 font-bold underline decoration-amber-500/50">
              6 days
            </span>
            . Primary objective: reinforce weak concepts in{' '}
            <span className="text-rose-400 font-bold">Deadlocks (41%)</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('coach')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold shadow-md transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>AI Coach (3h Today)</span>
          </button>
          <button
            onClick={rebalanceAdaptivePlan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02]"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Auto-Rebalance Plan</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Today's Focus & Knowledge Level (Matching the User's ASCII Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): 🎯 Today's Focus */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎯</span>
                <h2 className="text-base font-bold text-white tracking-tight">Today's Focus</h2>
                <span className="text-xs text-slate-400 font-medium">({todaysFocus.length} tasks allocated)</span>
              </div>
              <button
                onClick={() => setActiveView('planner')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 group"
              >
                <span>View 6-Day Plan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="space-y-3">
              {todaysFocus.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    item.isWeak
                      ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50'
                      : item.completed
                      ? 'bg-slate-900/40 border-slate-800/80 opacity-60'
                      : 'bg-slate-850/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleFocusTask(item.id)}
                      className="text-slate-400 hover:text-brand-400 transition-colors shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400 font-bold">
                          {index + 1}.
                        </span>
                        <p
                          className={`text-sm font-semibold truncate ${
                            item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.isWeak && (
                          <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            Weak Area
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.priority}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.minutes} min
                    </span>
                    <button
                      onClick={() => startTimer(item.title, item.minutes)}
                      className="p-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 transition-colors"
                      title="Start Focus Session"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {studyPlan.isAdaptiveAdjusted && (
              <div className="mt-4 p-3 rounded-xl bg-brand-950/40 border border-brand-500/30 text-xs text-brand-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  Adaptive Engine adjusted: Extra 45 min allocated to Deadlocks based on recent 41% diagnostic score.
                </span>
              </div>
            )}
          </div>

          {/* Quick StudyOS Prompt Box (Direct Doubt Solver Hook) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Have a doubt right now?</h3>
                <p className="text-xs text-slate-400">
                  Ask study.AI: <span className="text-brand-300">"Why does deadlock occur?"</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('solver')}
              className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Ask AI Tutor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): 📊 Knowledge Level & Exam Banner */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📊</span>
                <h2 className="text-base font-bold text-white tracking-tight">Knowledge Level</h2>
              </div>
              <button
                onClick={() => setActiveView('quizzes')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                Take Quiz
              </button>
            </div>

            <div className="space-y-4">
              {knowledgeItems.map(item => (
                <div key={item.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className={item.isWeak ? 'text-rose-300 font-bold' : 'text-slate-200'}>
                        {item.title}
                      </span>
                      {item.isWeak && (
                        <span className="text-xs text-rose-400 flex items-center gap-0.5">
                          ⚠️ <span className="text-[10px] uppercase font-mono font-bold">Weak</span>
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        item.score >= 80
                          ? 'text-emerald-400'
                          : item.score < 60
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {item.score}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.score >= 80
                          ? 'bg-emerald-500'
                          : item.score < 60
                          ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Alert banner for weak topic */}
            <div className="mt-5 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Deadlocks (41%) is your highest-priority area.</p>
                <p className="text-[11px] text-rose-300 mt-0.5">
                  System has automatically queued 5 flashcards and scheduled remedial drills.
                </p>
                <button
                  onClick={() => setActiveView('weakness')}
                  className="mt-2 text-[11px] font-bold text-rose-300 underline hover:text-white"
                >
                  View 5-Day Deadlock Remedial Plan →
                </button>
              </div>
            </div>
          </div>

          {/* Exam Countdown Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-300">
                  Exam: {activeSubject.name} — {activeSubject.daysLeft} days
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Phase: Revision + PYQ
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Target Grade: <span className="font-bold text-white">A+</span> | Syllabus:{' '}
              <span className="font-bold text-white">4 Units</span> | Weightage:{' '}
              <span className="font-bold text-white">CPU Sched & Deadlocks (45% Marks)</span>
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveView('pyqs')}
                className="text-slate-300 hover:text-white font-medium flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                <span>SPPU Repeated PYQs</span>
              </button>
              <button
                onClick={() => setActiveView('planner')}
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                <span>Full Roadmap</span>
                <CalendarDays className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
