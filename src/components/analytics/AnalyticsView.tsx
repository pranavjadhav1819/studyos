import React from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { WEEKLY_STUDY_TIME, SUBJECT_BENCHMARKS } from '../../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { quizResults, setActiveView } = useStudyOS();

  const totalWeeklyHours = WEEKLY_STUDY_TIME.reduce((sum, d) => sum + d.hours, 0);
  const maxHours = Math.max(...WEEKLY_STUDY_TIME.map(d => d.hours));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Progress & Mastery Analytics
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">
              Actionable Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real signals derived from diagnostic assessments, revision cycles, and weekly study consistency.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Weekly Commitment: {totalWeeklyHours} Hours</span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Overall Knowledge */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Overall Knowledge</span>
            <span className="text-brand-400 font-bold">+6% this sprint</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-white">76%</span>
            <span className="text-xs text-slate-400 font-medium">Weighted Syllabus Mastery</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-700"
              style={{ width: '76%' }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Based on completed units in OS, DSA, CN, and DBMS.
          </p>
        </div>

        {/* Card 2: Active Weak Areas */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-rose-400 font-bold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Critical Weak Area
            </span>
            <span className="font-mono">Urgent</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">Deadlocks</span>
            <span className="text-xs font-mono font-bold text-rose-400">(41%)</span>
          </div>
          <p className="text-xs text-rose-200">
            Under minimum threshold (&lt;60%). High appearance rate in university 10-markers.
          </p>
          <button
            onClick={() => setActiveView('weakness')}
            className="text-[11px] font-bold text-rose-300 underline hover:text-white"
          >
            Review 5-Day Deadlocks Remedial Plan →
          </button>
        </div>

        {/* Card 3: Study Streak & Discipline */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Discipline Consistency</span>
            <span className="text-emerald-400 font-bold font-mono">Streak: 5 Days 🔥</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">43.0</span>
            <span className="text-xs text-slate-400 font-medium">Hours logged this week</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Target exceeded by 7 hours</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Study Time this Week vs Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Study Time This Week Bar Chart (Matching user specification) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Study Time (This Week)</h2>
              <p className="text-[11px] text-slate-400">Total: {totalWeeklyHours} hours invested</p>
            </div>
            <span className="text-xs font-mono text-slate-400 font-semibold">Hours / Day</span>
          </div>

          {/* Bar chart representation */}
          <div className="grid grid-cols-7 gap-2 items-end h-48 pt-6 px-2">
            {WEEKLY_STUDY_TIME.map(d => {
              const heightPercent = Math.round((d.hours / maxHours) * 100);
              const isPeak = d.hours === maxHours;

              return (
                <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-brand-300 transition-colors">
                    {d.hours}h
                  </span>
                  <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5">
                    <div
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        isPeak
                          ? 'bg-gradient-to-t from-brand-600 to-indigo-400 shadow-lg shadow-brand-500/20'
                          : 'bg-slate-700 group-hover:bg-brand-500/70'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Subject Performance Benchmark List (Matching user specification) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Subject Performance</h2>
              <p className="text-[11px] text-slate-400">Semester Course Benchmarks</p>
            </div>
            <span className="text-xs font-mono font-bold text-brand-400">Knowledge</span>
          </div>

          <div className="space-y-3">
            {SUBJECT_BENCHMARKS.map(sub => (
              <div
                key={sub.name}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  sub.isWeak
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-850/60 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-200">{sub.name}</span>
                  {sub.isWeak && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-0.5">
                      ⚠️ Weak
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.isWeak ? 'bg-rose-500' : sub.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                  <span
                    className={`font-mono text-xs font-bold ${
                      sub.isWeak ? 'text-rose-400' : 'text-slate-200'
                    }`}
                  >
                    {sub.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveView('subjects')}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold transition-colors"
          >
            Manage All Subjects
          </button>
        </div>
      </div>
    </div>
  );
};
