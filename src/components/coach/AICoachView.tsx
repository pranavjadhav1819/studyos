import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  Bot,
  Sparkles,
  Clock,
  Play,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AICoachView: React.FC = () => {
  const { askCoachForToday, startTimer, setActiveView } = useStudyOS();
  const [hours, setHours] = useState<number>(3);
  const [generatedPlan, setGeneratedPlan] = useState<ReturnType<typeof askCoachForToday>>(() =>
    askCoachForToday(3)
  );

  const presetHours = [1.5, 2, 3, 4, 5];

  const handleGenerate = (h: number) => {
    setHours(h);
    const plan = askCoachForToday(h);
    setGeneratedPlan(plan);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleStartSession = () => {
    if (generatedPlan.length > 0) {
      const firstTask = generatedPlan[0];
      startTimer(firstTask.title, firstTask.minutes);
      setActiveView('dashboard');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="text-center space-y-2 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <Bot className="w-4 h-4 text-brand-400" />
          <span>Strategic AI Study Coach</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Intelligent Session Planner
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
          Unlike a generic chatbot, the AI Coach monitors your live accuracy metrics, exam days remaining, and time constraints to prescribe your optimal schedule.
        </p>
      </div>

      {/* Input / Time Budget Selector (Matching user specification) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white">How much time do you have today?</h2>
            <p className="text-xs text-slate-400">
              StudyOS will allocate minutes proportionally across your knowledge gaps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {presetHours.map(h => (
              <button
                key={h}
                onClick={() => handleGenerate(h)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  hours === h
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 mb-2">
            <span>Available Window:</span>
            <span className="text-brand-300 text-base">{hours} Hours ({hours * 60} Minutes)</span>
          </div>
          <input
            type="range"
            min={1}
            max={8}
            step={0.5}
            value={hours}
            onChange={e => handleGenerate(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
        </div>
      </div>

      {/* Coach Output Plan (Matching user prompt) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">
              Coach Prescription for {hours} Hours
            </h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Optimized for 6 Days to Exam
          </span>
        </div>

        <div className="text-xs text-slate-300">
          Based on your latest test performance, here is how you should spend your {hours * 60} minutes today:
        </div>

        {/* Allocated Items List */}
        <div className="space-y-3">
          {generatedPlan.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                item.isWeak
                  ? 'bg-rose-950/25 border-rose-500/40 shadow-sm'
                  : 'bg-slate-850/80 border-slate-750'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-750 flex items-center justify-center font-mono font-bold text-xs text-slate-200 shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs md:text-sm font-bold text-slate-100">{item.title}</h4>
                    {item.isWeak && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                        🔴 Remedial Priority
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.priority}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                  {item.minutes} min
                </span>
                <button
                  onClick={() => {
                    startTimer(item.title, item.minutes);
                    setActiveView('dashboard');
                  }}
                  className="p-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 transition-colors"
                  title="Start Timer for this block"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Big Start Study Session Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Clicking Start begins with Block #1 (<span className="text-white font-bold">{generatedPlan[0]?.title}</span>)
          </div>

          <button
            onClick={handleStartSession}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <span>Start Study Session ({generatedPlan[0]?.minutes}m Timer)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
