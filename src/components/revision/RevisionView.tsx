import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import {
  RotateCcw,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RevisionView: React.FC = () => {
  const { flashcards, reviewFlashcard, spacedSchedule, adjustSpacedInterval, setActiveView } = useStudyOS();

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [filterWeakOnly, setFilterWeakOnly] = useState<boolean>(false);

  const activeCards = filterWeakOnly
    ? flashcards.filter(f => f.isWeakTopicPriority)
    : flashcards;

  const currentCard = activeCards[currentCardIndex] || activeCards[0];

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    reviewFlashcard(currentCard.id, rating);
    setIsFlipped(false);
    if (rating === 'easy' || rating === 'good') {
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
    }
    if (currentCardIndex < activeCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Intelligent Spaced Revision
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">
              FSRS / Ebbinghaus Curve
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Adapts review intervals based on live quiz scores and self-rated recall difficulty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterWeakOnly(!filterWeakOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              filterWeakOnly
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{filterWeakOnly ? 'Showing Weak Topics Only' : 'Filter Weak Topics'}</span>
          </button>
        </div>
      </div>

      {/* Adaptive Spaced Interval Timeline (Matching user specification) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400">
                Spaced Repetition Schedule
              </span>
              <span className="text-xs font-mono font-bold text-white">Deadlocks</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Quiz Score: <span className="text-rose-400 font-bold font-mono">41%</span>{' '}
              → Interval dynamically compressed for urgent consolidation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustSpacedInterval('top-deadlocks', true)}
              className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/30 text-[11px] font-bold text-rose-300 hover:bg-rose-900/40 flex items-center gap-1"
              title="Simulate 41% Score (Shifts dates earlier)"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Simulate Low Score (41%)</span>
            </button>
            <button
              onClick={() => adjustSpacedInterval('top-deadlocks', false)}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900/40 flex items-center gap-1"
              title="Simulate 92% Score (Expands intervals)"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Simulate High Score (92%)</span>
            </button>
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {spacedSchedule.map((item, idx) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                item.status === 'due_today'
                  ? 'bg-rose-950/30 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                  : item.status === 'completed'
                  ? 'bg-slate-850/40 border-slate-800 opacity-70'
                  : 'bg-slate-850/80 border-slate-750'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className="font-bold text-slate-400">Step {idx + 1}</span>
                  {item.status === 'due_today' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/30 text-rose-300 border border-rose-500/40 animate-pulse">
                      DUE TODAY
                    </span>
                  )}
                  {item.status === 'completed' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-white">{item.stageName}</h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-750 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Date:</span>
                <span
                  className={
                    item.status === 'due_today'
                      ? 'text-rose-300 font-bold'
                      : 'text-slate-200'
                  }
                >
                  {item.scheduledDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Recall Flashcard Deck */}
      {currentCard ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Card {currentCardIndex + 1} of {activeCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-brand-300 font-semibold uppercase">
                {currentCard.topicName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="capitalize">{currentCard.level} Mastery</span>
            </div>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 hover:border-brand-500/40 shadow-2xl flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.005] select-none"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-4">
                <span>{isFlipped ? 'REVERSE (ANSWER & KEY POINTS)' : 'FRONT (ACTIVE RECALL PROMPT)'}</span>
                <span className="text-brand-400 text-[11px] font-semibold">Click card to flip ↺</span>
              </div>

              {!isFlipped ? (
                <div className="space-y-4">
                  <h3 className="text-lg md:text-xl font-extrabold text-white leading-snug">
                    {currentCard.front}
                  </h3>
                  {currentCard.isWeakTopicPriority && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Priority Weak Area Card
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="text-sm md:text-base text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                    {currentCard.back}
                  </div>
                  {currentCard.formula && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-brand-300 whitespace-pre-line">
                      {currentCard.formula}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span>Repetitions: {currentCard.repetitions}</span>
              <span>Next Review Interval: {currentCard.nextReviewDays} days</span>
            </div>
          </div>

          {/* Recall Rating Buttons (Shown when flipped) */}
          {isFlipped && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-xs font-bold text-center text-slate-400">
                How easily did you recall this answer?
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleRate('again')}
                  className="py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all flex flex-col items-center"
                >
                  <span>Again</span>
                  <span className="text-[10px] font-mono text-rose-400 mt-0.5">&lt; 1 day</span>
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="py-2.5 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex flex-col items-center"
                >
                  <span>Hard</span>
                  <span className="text-[10px] font-mono text-amber-400 mt-0.5">2 days</span>
                </button>
                <button
                  onClick={() => handleRate('good')}
                  className="py-2.5 px-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all flex flex-col items-center"
                >
                  <span>Good</span>
                  <span className="text-[10px] font-mono text-indigo-400 mt-0.5">4 days</span>
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex flex-col items-center"
                >
                  <span>Easy</span>
                  <span className="text-[10px] font-mono text-emerald-400 mt-0.5">7 days</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">All flashcards reviewed for today!</p>
        </div>
      )}
    </div>
  );
};
