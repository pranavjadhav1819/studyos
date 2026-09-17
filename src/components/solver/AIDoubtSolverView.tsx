import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { AIService } from '../../services/aiService';
import {
  BrainCircuit,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Key
} from 'lucide-react';

interface SolvedResponse {
  query: string;
  simpleExplanation: string;
  example: string;
  rememberRule: string;
  examTip: string;
  relatedTopicName: string;
}

export const AIDoubtSolverView: React.FC = () => {
  const { setActiveView, geminiApiKey, activeSubject, generateQuizForTopic, setActiveQuizTopic } = useStudyOS();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Preloaded answer matching user's exact specification
  const [activeAnswer, setActiveAnswer] = useState<SolvedResponse>({
    query: 'Why does deadlock occur?',
    simpleExplanation:
      'Deadlock happens when processes are waiting for resources held by each other, and no process can make forward progress.',
    example: `P1 holds R1, waiting for R2
P2 holds R2, waiting for R1

P1 ──(waits for)──> [ R2 ] ──(held by)──> P2
▲                                         │
└────────────(held by)── [ R1 ] <─(waits)─┘

Result: Neither process can continue. Both remain permanently blocked.`,
    rememberRule: '"Each process holds something and waits for something else."',
    examTip:
      'In university exams (SPPU / GATE), state that Deadlock strictly requires ALL 4 Coffman conditions simultaneously: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait.',
    relatedTopicName: 'Deadlocks'
  });

  const promptChips = [
    'Why does deadlock occur?',
    "Explain Banker's Algorithm with a worked example",
    'Difference between Paging and Segmentation',
    'What is Convoy Effect in CPU Scheduling?'
  ];

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;
    setLoading(true);

    try {
      const result = await AIService.solveDoubt(q, activeSubject.name, geminiApiKey);
      setActiveAnswer({
        query: q,
        simpleExplanation: result.simpleExplanation,
        example: result.example,
        rememberRule: result.rememberRule,
        examTip: result.examTip,
        relatedTopicName: result.relatedTopicName
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
          <BrainCircuit className="w-4 h-4 text-brand-400" />
          <span>Socratic AI Doubt Solver</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Ask study.AI
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
          Connected directly to your syllabus. Explains concepts intuitively, gives exam rubrics, and immediately tests your understanding.
        </p>
      </div>

      {/* Question Input Box */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="relative">
          <textarea
            rows={2}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(query);
              }
            }}
            placeholder="Type your doubt here... (e.g. Why does deadlock occur?)"
            className="w-full p-3.5 pr-24 rounded-xl bg-slate-850 border border-slate-750 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-medium resize-none"
          />
          <button
            onClick={() => handleSend(query)}
            disabled={loading || !query.trim()}
            className="absolute right-3 bottom-4 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>{loading ? 'Thinking...' : 'Send'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">Suggested:</span>
          {promptChips.map(chip => (
            <button
              key={chip}
              onClick={() => {
                setQuery(chip);
                handleSend(chip);
              }}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Container (Matching user specification) */}
      {activeAnswer && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-2">
          {/* Query title */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🧠</span>
              <h2 className="text-base font-bold text-white tracking-tight">
                {activeAnswer.query}
              </h2>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Topic: {activeAnswer.relatedTopicName}
            </span>
          </div>

          {/* 1. Simple explanation */}
          <div className="space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-brand-400 flex items-center gap-1.5">
              <span>🧠</span>
              <span>Simple Explanation</span>
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed pl-5 font-medium">
              {activeAnswer.simpleExplanation}
            </p>
          </div>

          {/* 2. Example */}
          <div className="space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-indigo-400 flex items-center gap-1.5">
              <span>💡</span>
              <span>Visual Example</span>
            </h3>
            <div className="ml-5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 whitespace-pre-line leading-relaxed">
              {activeAnswer.example}
            </div>
          </div>

          {/* 3. Remember Rule */}
          <div className="space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-amber-400 flex items-center gap-1.5">
              <span>📌</span>
              <span>Remember</span>
            </h3>
            <div className="ml-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-semibold italic">
              {activeAnswer.rememberRule}
            </div>
          </div>

          {/* 4. Exam Tip */}
          <div className="space-y-1.5">
            <h3 className="text-xs uppercase tracking-wider font-extrabold text-emerald-400 flex items-center gap-1.5">
              <span>⭐</span>
              <span>Exam Tip (SPPU / University Marking Scheme)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pl-5">
              {activeAnswer.examTip}
            </p>
          </div>

          {/* Action Button: [Give me a quiz] */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Ready to verify whether you have mastered this concept?
            </p>

            <button
              onClick={async () => {
                await generateQuizForTopic(activeAnswer.relatedTopicName, [activeAnswer.relatedTopicName]);
                setActiveQuizTopic(activeAnswer.relatedTopicName);
                setActiveView('quizzes');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Give me a quiz on {activeAnswer.relatedTopicName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
