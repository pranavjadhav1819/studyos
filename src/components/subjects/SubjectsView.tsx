import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  BookOpen,
  Calendar,
  Award,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  Cpu,
  Binary,
  Network,
  Database,
  BrainCircuit,
  Sigma
} from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const { subjects, activeSubjectId, switchSubject, addSubject, setActiveView } = useStudyOS();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDays, setNewDays] = useState(15);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-violet-400" />;
      case 'Binary': return <Binary className="w-5 h-5 text-cyan-400" />;
      case 'Network': return <Network className="w-5 h-5 text-emerald-400" />;
      case 'Database': return <Database className="w-5 h-5 text-amber-400" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-pink-400" />;
      case 'Sigma': return <Sigma className="w-5 h-5 text-indigo-400" />;
      default: return <BookOpen className="w-5 h-5 text-brand-400" />;
    }
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addSubject(newName.trim(), newCode.trim() || 'SUB-101', Number(newDays));
    setNewName('');
    setNewCode('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Academic Subjects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your courses, university exam deadlines, and target performance grades.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map(sub => {
          const isActive = sub.id === activeSubjectId;
          const totalUnits = sub.units.length;
          const totalTopics = sub.units.reduce((acc, u) => acc + u.topics.length, 0);

          return (
            <div
              key={sub.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900/90 border-brand-500/50 shadow-xl shadow-brand-500/10 ring-1 ring-brand-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/60">
                      {getSubjectIcon(sub.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white truncate max-w-[160px]">
                          {sub.name}
                        </h3>
                        {isActive && (
                          <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 font-medium">
                        {sub.code}
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    <Flame className="w-3 h-3 text-amber-400" />
                    {sub.daysLeft}d left
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-xl bg-slate-850/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Knowledge Level</div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span
                        className={`text-base font-mono font-bold ${
                          sub.overallKnowledge >= 80
                            ? 'text-emerald-400'
                            : sub.overallKnowledge < 65
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {sub.overallKnowledge}%
                      </span>
                      {sub.overallKnowledge < 65 && (
                        <span className="text-[10px] text-rose-400 font-bold">⚠️ Weak</span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-850/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Target Grade</div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-mono font-bold text-brand-300">
                        {sub.targetGrade}
                      </span>
                      <span className="text-[10px] text-slate-400">Aim</span>
                    </div>
                  </div>
                </div>

                {/* Sub features list */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 px-1">
                  <span>{totalUnits > 0 ? `${totalUnits} Units` : '4 Units planned'}</span>
                  <span>•</span>
                  <span>{totalTopics > 0 ? `${totalTopics} Topics` : '18 Topics'}</span>
                  <span>•</span>
                  <span>PYQs & Quizzes</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800">
                {isActive ? (
                  <button
                    onClick={() => setActiveView('syllabus')}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 text-xs font-bold transition-colors"
                  >
                    <span>Open Syllabus Explorer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => switchSubject(sub.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    <span>Switch to this Subject</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-1">Add Academic Subject</h2>
            <p className="text-xs text-slate-400 mb-4">
              Enter subject details to begin syllabus mapping and adaptive countdown.
            </p>

            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Theory of Computation / DBMS"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course Code</label>
                  <input
                    type="text"
                    placeholder="CS-304"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Days to Exam</label>
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={newDays}
                    onChange={e => setNewDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-md"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
