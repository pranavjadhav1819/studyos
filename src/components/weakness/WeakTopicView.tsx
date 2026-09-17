import React from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const WeakTopicView: React.FC = () => {
  const { rebalanceAdaptivePlan, setActiveView, startTimer } = useStudyOS();

  const topicScores = [
    { name: 'Processes', score: 91, status: 'Mastered', color: 'bg-emerald-500', isWeak: false },
    { name: 'Threads', score: 82, status: 'Mastered', color: 'bg-emerald-500', isWeak: false },
    { name: 'CPU Scheduling', score: 84, status: 'Mastered', color: 'bg-emerald-500', isWeak: false },
    { name: 'Deadlocks', score: 41, status: 'Weak', color: 'bg-rose-500', isWeak: true, isCritical: true },
    { name: 'Memory Management', score: 63, status: 'Moderate', color: 'bg-amber-500', isWeak: false, isWarning: true },
    { name: 'File Systems', score: 74, status: 'Good', color: 'bg-blue-500', isWeak: false }
  ];

  const revisionPlanSteps = [
    { day: 'Today', title: 'Deadlock basics & 4 Coffman conditions', duration: '40 min', type: 'Concept Foundation', completed: true },
    { day: 'Tomorrow', title: "Deadlock algorithms (Banker's Safety & Need Matrix)", duration: '60 min', type: 'Numericals Drill', completed: false },
    { day: 'Day 3', title: 'Previous Year Questions (10-Mark SPPU Exam Solves)', duration: '45 min', type: 'PYQ Practice', completed: false },
    { day: 'Day 4', title: 'Targeted Diagnostic Quiz (Goal: score ≥ 80%)', duration: '20 min', type: 'Assessment', completed: false },
    { day: 'Day 6', title: 'Final high-yield consolidation & formula recap', duration: '30 min', type: 'Pre-Exam Sprint', completed: false }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Weak Topic Detection & Triage
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold font-mono">
              1 Critical Alert
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time knowledge analysis flags sub-topics below 60% and structures targeted intervention schedules.
          </p>
        </div>

        <button
          onClick={rebalanceAdaptivePlan}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-brand-600 hover:from-rose-500 hover:to-brand-500 text-white text-xs font-bold shadow-lg shadow-rose-600/20 transition-all self-start sm:self-auto"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Apply Remedial Plan</span>
        </button>
      </div>

      {/* Hero Critical Alert Box (Matching user specification) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 shadow-xl space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Highest Priority Alert
              </span>
              <span className="text-xs font-mono text-slate-400">Operating Systems</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Deadlocks is currently your highest-priority topic.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Recent assessment indicates a <span className="font-bold text-rose-400">41% accuracy rate</span>, primarily around Banker’s safety algorithm and multi-instance Resource Allocation Graphs. Because Deadlocks constitutes up to <span className="font-bold text-white">15 marks</span> in your university paper, StudyOS has prepared a targeted multi-day recovery track.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={() => startTimer('Deadlock Basics Remedial', 40)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>Start Today's 40-Min Session</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveView('solver')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Tutor Concept Walkthrough</span>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Knowledge Breakdown vs Auto-Generated Revision Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Knowledge Bars (Matching user prompt) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Operating Systems Knowledge Spectrum</h3>
            <span className="text-xs font-mono text-slate-400">Target: ≥ 80%</span>
          </div>

          <div className="space-y-4">
            {topicScores.map(t => (
              <div key={t.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className={t.isCritical ? 'text-rose-300 font-bold' : 'text-slate-200'}>
                      {t.name}
                    </span>
                    {t.isCritical && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        🔴 Critical
                      </span>
                    )}
                    {t.isWarning && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        🟠 Watch
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-mono font-bold ${
                      t.score >= 80
                        ? 'text-emerald-400'
                        : t.score < 60
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {t.score}%
                  </span>
                </div>

                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${t.color}`}
                    style={{ width: `${t.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: The Dedicated REVISION PLAN (Matching user prompt) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Automated Remedial Revision Plan</h3>
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-brand-300 px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/30">
              5-Day Roadmap
            </span>
          </div>

          <div className="space-y-3">
            {revisionPlanSteps.map((step, idx) => (
              <div
                key={step.day}
                className="p-3.5 rounded-xl bg-slate-850/70 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-rose-300">{step.day}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs font-semibold text-slate-100">{step.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{step.type}</span>
                  </div>
                </div>

                <span className="font-mono text-xs text-slate-300 font-bold px-2 py-1 rounded bg-slate-800 border border-slate-700">
                  {step.duration}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveView('planner')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>View Full Timeline in Study Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
