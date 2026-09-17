import React from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  Flame,
  X,
  Sparkles,
  AlertTriangle,
  Award,
  CheckCircle2,
  FileText,
  Clock,
  Layers
} from 'lucide-react';

export const ExamModeModal: React.FC = () => {
  const { examMode, setExamMode, activeSubject, setActiveView } = useStudyOS();

  if (!examMode) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md overflow-y-auto p-4 md:p-8 animate-in fade-in">
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Header with Exit Button */}
        <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border border-rose-500/40 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/40 animate-pulse">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400">
                  Emergency Protocol Activated
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  24-Hour Final Run
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                🔥 EXAM MODE: {activeSubject.name.toUpperCase()}
              </h1>
            </div>
          </div>

          <button
            onClick={() => setExamMode(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Exit Exam Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Critical Weak Topic Quick Triage */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-wider text-rose-400">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Weak Topic Triage (Must-Remember Points for Deadlocks 41%)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400">4 Coffman Conditions</span>
              <p className="text-slate-300">
                1. Mutual Exclusion • 2. Hold & Wait • 3. No Preemption • 4. Circular Wait (Havender's ordering prevents Circular Wait).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400">Banker's Algorithm Need Matrix</span>
              <p className="text-slate-300 font-mono">
                Need[i] = Max[i] - Allocation[i]. Work = Available. Safe Sequence must be in angle brackets &lt;P1, P3...&gt;.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Top Repeated 10-Mark Questions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Guaranteed Question Types (High Probability)</h2>
            </div>
            <button
              onClick={() => {
                setExamMode(false);
                setActiveView('pyqs');
              }}
              className="text-xs text-brand-400 font-semibold underline"
            >
              Open Full Solutions →
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between">
              <span className="font-semibold text-slate-100">
                1. Banker's Safety Algorithm & Resource Request Step-by-Step
              </span>
              <span className="font-mono text-amber-300 font-bold">10 Marks (SPPU 2024)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between">
              <span className="font-semibold text-slate-100">
                2. Shortest Remaining Time First (SRTF) Gantt Chart & Waiting Time
              </span>
              <span className="font-mono text-amber-300 font-bold">10 Marks (SPPU 2023)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between">
              <span className="font-semibold text-slate-100">
                3. Page Replacement Algorithm (FIFO vs LRU Page Faults)
              </span>
              <span className="font-mono text-amber-300 font-bold">10 Marks (SPPU 2022)</span>
            </div>
          </div>
        </div>

        {/* 3. High-Yield Formula Sheet */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold tracking-wider text-brand-400">
            <FileText className="w-4 h-4 text-brand-400" />
            <span>Master Formula Sheet (Memorize in 5 mins)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Turnaround Time:</span>
              <div className="font-bold text-emerald-300">TAT = CT - AT</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Waiting Time:</span>
              <div className="font-bold text-emerald-300">WT = TAT - BT</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Effective Memory Access:</span>
              <div className="font-bold text-emerald-300 text-[11px]">EMAT = h*(t+m) + (1-h)*(t+2m)</div>
            </div>
          </div>
        </div>

        {/* Exit Banner */}
        <div className="text-center pt-2">
          <button
            onClick={() => setExamMode(false)}
            className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            Return to Standard Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
