import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  ListTree,
  FileText,
  HelpCircle,
  Plus,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  BrainCircuit,
  RotateCcw
} from 'lucide-react';
import { TopicWeightage } from '../../types';

export const SyllabusView: React.FC = () => {
  const { activeSubject, addTopic, setActiveView, parseSyllabusAndAdd, generateQuizForTopic, setActiveQuizTopic } = useStudyOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddTopicModal, setShowAddTopicModal] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicWeightage, setTopicWeightage] = useState<TopicWeightage>('High');
  const [pastedSyllabus, setPastedSyllabus] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleCreateTopic = (unitId: string) => {
    if (!topicTitle.trim()) return;
    addTopic(unitId, topicTitle.trim(), topicWeightage);
    setTopicTitle('');
    setShowAddTopicModal(null);
  };

  const handleImportSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedSyllabus.trim()) return;
    setIsParsing(true);
    await parseSyllabusAndAdd(pastedSyllabus.trim());
    setIsParsing(false);
    setShowImportModal(false);
    setPastedSyllabus('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {activeSubject.name} — Syllabus Database
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">
              {activeSubject.code}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured unit-topic hierarchy calibrated with university exam frequency and individual mastery scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-brand-400" />
            <span>Paste / Ingest Syllabus</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Filter topics by keyword, e.g. Deadlocks, Banker, Scheduling, Paging..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* Units & Topics Hierarchy */}
      <div className="space-y-6">
        {activeSubject.units.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <ListTree className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-medium">No units mapped yet for this subject.</p>
            <button
              onClick={() => setShowImportModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
            >
              Paste Syllabus Text to Generate
            </button>
          </div>
        ) : (
          activeSubject.units.map(unit => {
            const filteredTopics = unit.topics.filter(
              t =>
                t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.keyConcepts.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            if (searchTerm && filteredTopics.length === 0) return null;

            return (
              <div
                key={unit.id}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg"
              >
                {/* Unit Header */}
                <div className="p-4 md:px-6 bg-slate-850/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-300 flex items-center justify-center text-xs font-bold font-mono">
                      U{unit.unitNumber}
                    </div>
                    <div>
                      <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
                        {unit.title}
                      </h2>
                      <span className="text-[11px] text-slate-400">
                        {unit.topics.length} topics mapped
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddTopicModal(unit.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic</span>
                  </button>
                </div>

                {/* Topic Rows */}
                <div className="divide-y divide-slate-850">
                  {filteredTopics.map(topic => {
                    const isWeak = topic.knowledgeScore < 60;
                    return (
                      <div
                        key={topic.id}
                        className={`p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                          isWeak
                            ? 'bg-rose-950/15 hover:bg-rose-950/25 border-l-4 border-l-rose-500'
                            : 'hover:bg-slate-850/40'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-100">{topic.title}</span>

                            {isWeak ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                                ⚠️ Weak (Score: {topic.knowledgeScore}%)
                              </span>
                            ) : topic.knowledgeScore >= 80 ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                Mastered ({topic.knowledgeScore}%)
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                In Progress ({topic.knowledgeScore}%)
                              </span>
                            )}

                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                topic.weightage === 'High'
                                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {topic.weightage} Exam Weight
                            </span>

                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              Repeated: {topic.pyqFrequencyScore}/10
                            </span>
                          </div>

                          {/* Key concepts chips */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {topic.keyConcepts.map(c => (
                              <span
                                key={c}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-750 font-mono"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action buttons per topic */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => setActiveView('notes')}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1"
                            title="Open Notes & Cheat Sheet"
                          >
                            <FileText className="w-3.5 h-3.5 text-brand-400" />
                            <span className="hidden sm:inline">Notes</span>
                          </button>

                          <button
                            onClick={async () => {
                              await generateQuizForTopic(topic.title, topic.keyConcepts);
                              setActiveQuizTopic(topic.title);
                              setActiveView('quizzes');
                            }}
                            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isWeak
                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                            }`}
                            title="Run Quiz Mastery Check"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isWeak ? 'Remedial Quiz' : 'Quiz'}</span>
                          </button>

                          <button
                            onClick={() => setActiveView('solver')}
                            className="p-2 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 text-xs font-semibold flex items-center gap-1"
                            title="Ask Doubt on this Topic"
                          >
                            <BrainCircuit className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">AI Tutor</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Topic Modal */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-2">Add New Topic</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Memory Protection & Access Matrix"
                  value={topicTitle}
                  onChange={e => setTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Exam Weightage</label>
                <select
                  value={topicWeightage}
                  onChange={e => setTopicWeightage(e.target.value as TopicWeightage)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="High">High (Frequently tested in 10-markers)</option>
                  <option value="Medium">Medium (Regular 5-markers)</option>
                  <option value="Low">Low (Short 2-markers)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateTopic(showAddTopicModal)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white"
                >
                  Save Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ingest Syllabus Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-1">Ingest University Syllabus</h2>
            <p className="text-xs text-slate-400 mb-4">
              Paste your raw syllabus or course outline. StudyOS will automatically structure it into units and topics.
            </p>

            <form onSubmit={handleImportSyllabus} className="space-y-4">
              <textarea
                rows={8}
                value={pastedSyllabus}
                onChange={e => setPastedSyllabus(e.target.value)}
                placeholder={`Unit 1: Process Architecture
- Processes vs Threads
- Process Synchronization & Deadlocks

Unit 2: Storage & File Hierarchy
- Inode Architecture
- Disk Scheduling SSTF & SCAN`}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isParsing || !pastedSyllabus.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isParsing ? 'Parsing with AI...' : 'Ingest & Generate Tree'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
