import React from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  LayoutDashboard,
  BookMarked,
  ListTree,
  FileText,
  BrainCircuit,
  CalendarDays,
  RotateCcw,
  BarChart3,
  PenTool,
  Bot,
  AlertTriangle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, flashcards, studyPlan } = useStudyOS();

  const dueCardsCount = flashcards.filter(f => f.nextReviewDays <= 1).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: BookMarked,
      badge: '6'
    },
    {
      id: 'syllabus',
      label: 'Syllabus',
      icon: ListTree,
      badge: '4 Units'
    },
    {
      id: 'pyqs',
      label: 'PYQs Vault',
      icon: FileText,
      badge: 'SPPU'
    },
    {
      id: 'solver',
      label: 'AI Doubt Solver',
      icon: BrainCircuit,
      badge: 'Socratic'
    },
    {
      id: 'planner',
      label: 'Study Planner',
      icon: CalendarDays,
      badge: studyPlan.isAdaptiveAdjusted ? 'Adaptive' : '6 Days'
    },
    {
      id: 'weakness',
      label: 'Weak Topics',
      icon: AlertTriangle,
      badge: '1 Alert',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'quizzes',
      label: 'Quiz Engine',
      icon: FileText,
      badge: 'Score 41%'
    },
    {
      id: 'revision',
      label: 'Spaced Revision',
      icon: RotateCcw,
      badge: dueCardsCount > 0 ? `${dueCardsCount} due` : 'Done',
      badgeColor: dueCardsCount > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : undefined
    },
    {
      id: 'analytics',
      label: 'Progress Analytics',
      icon: BarChart3,
      badge: '76%'
    },
    {
      id: 'notes',
      label: 'Notes & Cheats',
      icon: PenTool,
      badge: 'Formulas'
    },
    {
      id: 'coach',
      label: 'AI Study Coach',
      icon: Bot,
      badge: 'Smart'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    item.badgeColor || (isActive ? 'bg-brand-500/30 text-brand-200 border-brand-400/40' : 'bg-slate-800 text-slate-400 border-slate-700')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Mini Status Card */}
      <div className="p-3 border-t border-slate-800/80 m-2 rounded-xl bg-slate-950/60 border">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
          <span>Overall Knowledge</span>
          <span className="font-mono text-brand-400">76%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: '76%' }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-2">
          Exam in <span className="text-amber-400 font-bold">6 days</span>. Priority: Deadlocks.
        </p>
      </div>
    </aside>
  );
};
