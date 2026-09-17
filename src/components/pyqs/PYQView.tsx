import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { PYQ_FREQUENCY_ANALYSIS, HIGH_PROBABILITY_TOPICS } from '../../data/mockData';
import { PYQ, PYQStatus } from '../../types';
import {
  FileText,
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  Award,
  Filter,
  BrainCircuit
} from 'lucide-react';

export const PYQView: React.FC = () => {
  const { pyqs, toggleStarPYQ, updatePYQStatus, setActiveView } = useStudyOS();
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedMarks, setSelectedMarks] = useState<number | 'all'>('all');
  const [expandedPYQId, setExpandedPYQId] = useState<string | null>('pyq-1');

  const filteredPYQs = pyqs.filter(p => {
    if (selectedTopic !== 'all' && p.topicName !== selectedTopic) return false;
    if (selectedMarks !== 'all' && p.marks !== selectedMarks) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              PYQ Intelligence & Exam Vault
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">
              SPPU & University Papers
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statistical recurrence analysis predicts high-probability exam numericals and step-by-step model solutions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Pattern: Engineering Semester Exam</span>
        </div>
      </div>

      {/* Recurrence Analysis & High Probability Grid (Matching user specification) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Most Repeated Topics Bars */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Most Repeated Exam Topics</h2>
              <p className="text-[11px] text-slate-400">Based on past 5 years of semester papers</p>
            </div>
            <span className="text-xs font-mono font-bold text-brand-400">Recurrence</span>
          </div>

          <div className="space-y-3.5">
            {PYQ_FREQUENCY_ANALYSIS.map(item => (
              <div key={item.topicName} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.topicName}</span>
                  <span className="font-mono text-brand-300">
                    {item.timesRepeated} times ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: High-Probability Topics Prediction */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">🔥 High-Probability Topics for Upcoming Exam</h2>
          </div>

          <div className="space-y-2.5">
            {HIGH_PROBABILITY_TOPICS.map(item => (
              <div
                key={item.rank}
                className="p-3 rounded-xl bg-slate-850/80 border border-slate-750 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    #{item.rank}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100">{item.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">
                      Expected Weight: {item.marksExpectation}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-amber-300 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30">
                  {item.probability}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter PYQs:</span>
          <select
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Topics</option>
            <option value="Deadlocks">Deadlocks</option>
            <option value="CPU Scheduling">CPU Scheduling</option>
            <option value="Memory Management">Memory Management</option>
          </select>

          <select
            value={selectedMarks}
            onChange={e => setSelectedMarks(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Marks</option>
            <option value={10}>10 Marks (Major Numericals)</option>
            <option value={5}>5 Marks (Derivations / Proofs)</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredPYQs.length} exam questions
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredPYQs.map(pyq => {
          const isExpanded = expandedPYQId === pyq.id;
          return (
            <div
              key={pyq.id}
              className={`rounded-2xl border transition-all ${
                pyq.topicName === 'Deadlocks'
                  ? 'bg-slate-900/90 border-rose-500/30 shadow-md'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Question Header Bar */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {pyq.examType} ({pyq.year})
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {pyq.marks} Marks
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {pyq.topicName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Repeated {pyq.repeatedTimes}x
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-100 leading-snug">
                    {pyq.questionText}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => toggleStarPYQ(pyq.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      pyq.isStarred
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                    title="Star this question"
                  >
                    <Star className={`w-4 h-4 ${pyq.isStarred ? 'fill-current' : ''}`} />
                  </button>

                  <select
                    value={pyq.solvedStatus}
                    onChange={e => updatePYQStatus(pyq.id, e.target.value as PYQStatus)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border focus:outline-none ${
                      pyq.solvedStatus === 'mastered'
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                        : pyq.solvedStatus === 'attempted'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <option value="unsolved">Unsolved</option>
                    <option value="attempted">Attempted</option>
                    <option value="mastered">Mastered ✓</option>
                  </select>

                  <button
                    onClick={() => setExpandedPYQId(isExpanded ? null : pyq.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Solution' : 'View Solution'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Model Answer & Marking Rubric */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800 space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Examiner Model Answer & Derivation:</span>
                    </h4>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {pyq.modelAnswer}
                    </pre>
                  </div>

                  {/* Marking rubric checklist */}
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2">
                    <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Key Points for Full {pyq.marks} Marks:
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {pyq.keyPoints.map((kp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{kp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
