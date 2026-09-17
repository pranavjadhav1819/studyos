import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Play,
  TrendingUp,
  Sparkles,
  Clock,
  Flame,
  Plus
} from 'lucide-react';

export const StudyPlannerView: React.FC = () => {
  const {
    studyPlan,
    activeSubject,
    completeTask,
    rebalanceAdaptivePlan,
    startTimer
  } = useStudyOS();

  const [selectedDay, setSelectedDay] = useState<number>(3); // Default to Day 3 (Deadlocks)

  const activeDayPlan = studyPlan.days.find(d => d.dayNumber === selectedDay) || studyPlan.days[0];

  // Priority formula calculation for display
  const priorityBreakdown = [
    {
      topic: 'Deadlocks',
      weaknessScore: 59, // (100 - 41)
      examWeightage: '10 / 10',
      timePressure: 'High (6d)',
      allocatedMinutes: 60,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      dotColor: 'bg-rose-500'
    },
    {
      topic: 'Memory Management',
      weaknessScore: 33, // (100 - 67)
      examWeightage: '8 / 10',
      timePressure: 'Medium',
      allocatedMinutes: 45,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      dotColor: 'bg-amber-500'
    },
    {
      topic: 'File Systems',
      weaknessScore: 27, // (100 - 73)
      examWeightage: '6 / 10',
      timePressure: 'Normal',
      allocatedMinutes: 30,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dotColor: 'bg-blue-500'
    },
    {
      topic: 'CPU Scheduling (Revision)',
      weaknessScore: 18, // (100 - 82)
      examWeightage: '10 / 10',
      timePressure: 'Retention Check',
      allocatedMinutes: 15,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotColor: 'bg-emerald-500'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Adaptive Study Planner
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">
              {activeSubject.name} (6-Day Sprint)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamically shifts study time away from mastered chapters to high-probability weak areas.
          </p>
        </div>

        <button
          onClick={rebalanceAdaptivePlan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all self-start md:self-auto hover:scale-[1.02]"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Recalculate Priority Scores</span>
        </button>
      </div>

      {/* Priority Engine Formula Card (Matching user specification) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-bold text-white">Dynamic Time Allocation Engine</h2>
          </div>
          <div className="font-mono text-xs text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded-md border border-brand-500/30">
            Priority = Weakness × Exam Importance × Time Pressure
          </div>
        </div>

        {/* Result grid for TODAY */}
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-1">
          Targeted Time Distribution for Today:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {priorityBreakdown.map(item => (
            <div
              key={item.topic}
              className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-750 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                    <span className="text-xs font-bold text-slate-200">{item.topic}</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5 mt-2">
                  <div>Weakness Gap: <span className="text-slate-200 font-mono">+{item.weaknessScore}%</span></div>
                  <div>Exam Importance: <span className="text-slate-200 font-mono">{item.examWeightage}</span></div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-750 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Allocated:</span>
                <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {item.allocatedMinutes} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Day Roadmap Day Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {studyPlan.days.map(d => {
          const isSelected = d.dayNumber === selectedDay;
          const completedTasks = d.tasks.filter(t => t.completed).length;
          const totalTasks = d.tasks.length;
          const isFullyDone = completedTasks === totalTasks;

          return (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDay(d.dayNumber)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-md ring-1 ring-brand-500/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                <span>Day {d.dayNumber}</span>
                {d.isWeakRemediation && (
                  <span className="text-rose-400 text-[10px]">⚠️ Boost</span>
                )}
                {isFullyDone && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs font-bold text-slate-200 truncate">{d.title}</p>
              <div className="text-[10px] text-slate-400 mt-1.5 font-medium">
                {completedTasks} / {totalTasks} tasks
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Task Detail View */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Day {activeDayPlan.dayNumber} of 6
              </span>
              <h2 className="text-base font-bold text-white">{activeDayPlan.title}</h2>
              {activeDayPlan.isWeakRemediation && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  🔴 Adaptive Remedial Plan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Focus: {activeDayPlan.focusTopics.join(', ')}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Total Day Commitment:{' '}
            <span className="text-white font-bold">
              {activeDayPlan.tasks.reduce((sum, t) => sum + t.durationMins, 0)} mins
            </span>
          </div>
        </div>

        {/* Task List for this Day */}
        <div className="space-y-3">
          {activeDayPlan.tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                task.type === 'remedial'
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : task.completed
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-850/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => completeTask(activeDayPlan.dayNumber, task.id)}
                  className="text-slate-400 hover:text-brand-400 transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm font-semibold truncate ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.type === 'remedial' && (
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Remedial
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span className="capitalize">{task.type} Module</span>
                    <span>•</span>
                    <span className="font-mono text-brand-400 font-medium">
                      Priority Score: {task.priorityScore}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {task.durationMins} min
                </span>
                <button
                  onClick={() => startTimer(task.title, task.durationMins)}
                  className="p-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 transition-colors"
                  title="Start Timer for this Task"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
