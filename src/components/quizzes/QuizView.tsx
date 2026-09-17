import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { QUIZZES } from '../../data/mockData';
import { Quiz, QuizResult } from '../../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizView: React.FC = () => {
  const { recordQuizResult, rebalanceAdaptivePlan, setActiveView, quizzes, activeQuizTopic, setActiveQuizTopic } = useStudyOS();

  const [activeQuizId, setActiveQuizId] = useState<string>(() => {
    if (activeQuizTopic) {
      const match = quizzes.find(q => q.topicName.toLowerCase() === activeQuizTopic.toLowerCase());
      if (match) return match.id;
    }
    return quizzes[0]?.id || 'q-deadlocks';
  });
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  const activeQuiz: Quiz = quizzes.find(q => q.id === activeQuizId) || quizzes[0];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    const weakConcepts: string[] = [];
    const strongConcepts: string[] = [];

    activeQuiz.questions.forEach(q => {
      const isCorrect = selectedAnswers[q.id] === q.correctIndex;
      if (isCorrect) {
        correct++;
        if (!strongConcepts.includes(q.conceptTag)) {
          strongConcepts.push(q.conceptTag);
        }
      } else {
        if (!weakConcepts.includes(q.conceptTag)) {
          weakConcepts.push(q.conceptTag);
        }
      }
    });

    const percentage = Math.round((correct / activeQuiz.questions.length) * 100);
    const isWeak = percentage < 60;

    const result: QuizResult = {
      id: `qr-${Date.now()}`,
      quizId: activeQuiz.id,
      topicId: activeQuiz.topicId,
      topicName: activeQuiz.topicName,
      totalQuestions: activeQuiz.questions.length,
      correctCount: correct,
      scorePercentage: percentage,
      date: 'Just now',
      isWeak,
      weakConcepts,
      strongConcepts
    };

    setLastResult(result);
    setSubmitted(true);
    recordQuizResult(result);

    if (!isWeak) {
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setLastResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Quiz Engine</h1>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold font-mono">
              Diagnostic Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tests conceptual depth, identifies fine-grained sub-topic weaknesses, and updates your student knowledge model.
          </p>
        </div>

        {/* Quiz Topic Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {quizzes.map(q => (
            <button
              key={q.id}
              onClick={() => {
                setActiveQuizId(q.id);
                setActiveQuizTopic(q.topicName);
                handleResetQuiz();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                q.id === activeQuizId
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {q.topicName}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card (When submitted) */}
      {submitted && lastResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Diagnostic Result
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {activeQuiz.topicName} Assessment
              </h2>
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold font-mono ${
                  lastResult.scorePercentage >= 80
                    ? 'text-emerald-400'
                    : lastResult.scorePercentage < 60
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                {lastResult.correctCount} / {lastResult.totalQuestions}
              </span>
              <span className="text-lg font-bold text-slate-300 font-mono">
                ({lastResult.scorePercentage}%)
              </span>
            </div>
          </div>

          {/* Diagnostic breakdown matching user specification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weak Concepts */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Weak concepts detected:</span>
              </h3>
              {lastResult.weakConcepts.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-rose-200">
                  {lastResult.weakConcepts.map(c => (
                    <li key={c} className="flex items-center gap-2">
                      <span className="text-rose-400 font-bold">❌</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Zero weaknesses detected!</p>
              )}
            </div>

            {/* Strong Concepts */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Strong concepts:</span>
              </h3>
              {lastResult.strongConcepts.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-emerald-200">
                  {lastResult.strongConcepts.map(c => (
                    <li key={c} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400">Review fundamentals.</p>
              )}
            </div>
          </div>

          {/* Adaptive Actions Prompt */}
          <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-brand-200">
              <p className="font-bold">Knowledge model updated in real-time.</p>
              <p className="text-[11px] text-brand-300/80">
                {lastResult.isWeak
                  ? 'Adaptive engine recommends boosting revision and scheduling remedial drills.'
                  : 'Great progress! Concept mastery reflected in syllabus.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {lastResult.isWeak && (
                <button
                  onClick={rebalanceAdaptivePlan}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Auto-Increase Revision</span>
                </button>
              )}
              <button
                onClick={() => setActiveView('solver')}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-4">
        {activeQuiz.questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/10 border-emerald-500/30'
                    : 'bg-rose-950/15 border-rose-500/30'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-bold text-white">
                  <span className="font-mono text-brand-400 mr-2">Q{qIndex + 1}.</span>
                  {q.question}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                  {q.conceptTag}
                </span>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-2">
                {q.options.map((opt, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isThisCorrect = optIndex === q.correctIndex;

                  let optionStyle =
                    'bg-slate-850/60 border-slate-800 text-slate-300 hover:bg-slate-800';

                  if (submitted) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !isThisCorrect) {
                      optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 line-through';
                    } else {
                      optionStyle = 'bg-slate-900/40 border-slate-800/60 opacity-50';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'bg-brand-600/20 border-brand-500 text-brand-200 font-semibold ring-1 ring-brand-500/40';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center gap-3 transition-colors ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono shrink-0">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when submitted) */}
              {submitted && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl">
                  <span className="font-bold text-brand-400 mr-1.5">Explanation:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit / Retake Controls */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-800">
        <button
          onClick={handleResetQuiz}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Quiz</span>
        </button>

        {!submitted ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
          >
            <span>Submit Quiz & Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setActiveView('planner')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-500/20"
          >
            <span>Check Updated Study Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
