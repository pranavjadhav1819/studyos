import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { Note } from '../../types';
import {
  PenTool,
  Sparkles,
  BookOpen,
  ArrowRight,
  Plus,
  Tag,
  Clock,
  Layers,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NotesView: React.FC = () => {
  const {
    notes,
    saveNote,
    generateSummaryFromNote,
    generateCardsFromNote,
    setActiveView
  } = useStudyOS();

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || 'note-deadlocks');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('Deadlocks');
  const [newContent, setNewContent] = useState('');

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Note = {
      id: `note-${Date.now()}`,
      subjectId: 'os',
      topicId: 'top-deadlocks',
      topicName: newTopic,
      title: newTitle,
      content: newContent,
      formulas: [],
      updatedAt: 'Just now',
      tags: ['Custom Note', 'Student Revision']
    };

    saveNote(created);
    setActiveNoteId(created.id);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Connected Notes & Cheat Sheets
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">
              Topic-Integrated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Turn your study notes into AI summaries, active recall flashcards, and diagnostic quizzes with one click.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Topic Note</span>
        </button>
      </div>

      {/* The Learning Pipeline Ribbon (Matching user specification) */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between overflow-x-auto text-xs font-semibold text-slate-400">
        <span className="text-white font-bold shrink-0">Operating Systems</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-2" />
        <span className="text-brand-300 font-bold shrink-0">{activeNote?.topicName || 'Deadlocks'}</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-2" />
        <span className="text-indigo-300 shrink-0">My Notes</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-2" />
        <span className="text-purple-300 shrink-0">AI Summary</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-2" />
        <span className="text-emerald-300 shrink-0">Flashcards</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-2" />
        <span className="text-amber-300 shrink-0">Quiz Engine</span>
      </div>

      {/* Main Grid: Notes Sidebar & Active Note Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Notes List */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Topic Notebooks
          </div>

          {notes.map(note => {
            const isSelected = note.id === activeNoteId;
            return (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-850 border-brand-500 text-white shadow-md ring-1 ring-brand-500/40'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="text-brand-400 font-semibold">{note.topicName}</span>
                  <span>{note.updatedAt}</span>
                </div>
                <h3 className="text-xs font-bold line-clamp-1">{note.title}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map(t => (
                    <span
                      key={t}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Note Detail & Conversion Tools */}
        {activeNote && (
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            {/* Header with Title & Pipeline Generation Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {activeNote.topicName}
                  </span>
                  <span className="text-xs text-slate-400">Updated {activeNote.updatedAt}</span>
                </div>
                <h2 className="text-lg font-extrabold text-white mt-1">{activeNote.title}</h2>
              </div>

              {/* Conversion Pipeline Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => generateSummaryFromNote(activeNote.id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Generate Concise AI Summary"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Summary</span>
                </button>

                <button
                  onClick={() => generateCardsFromNote(activeNote.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Extract Active Recall Cards"
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Make Cards</span>
                </button>

                <button
                  onClick={() => setActiveView('quizzes')}
                  className="px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Test on this Note"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Take Quiz</span>
                </button>
              </div>
            </div>

            {/* AI Summary Card (If generated) */}
            {activeNote.aiSummary && (
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI High-Yield Summary</span>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  {activeNote.aiSummary}
                </p>
              </div>
            )}

            {/* Formulas Box */}
            {activeNote.formulas && activeNote.formulas.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Formula & Equation Sheet:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeNote.formulas.map(f => (
                    <div
                      key={f.name}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <span className="text-[11px] font-bold text-slate-300">{f.name}</span>
                      <div className="font-mono text-xs font-bold text-brand-300 bg-slate-900/80 p-2 rounded border border-slate-800">
                        {f.formula}
                      </div>
                      <p className="text-[10px] text-slate-400">{f.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note Markdown Content */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full Notes & Breakdown:
              </div>
              <div className="p-5 rounded-xl bg-slate-850/60 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                {activeNote.content}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Create Topic Study Note</h2>

            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banker's Algorithm Safe State Proofs"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content (Markdown)</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write your high-yield concepts, definitions, and derivations here..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
