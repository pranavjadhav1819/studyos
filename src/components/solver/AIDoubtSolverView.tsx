import React, { useState, useRef, useEffect } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { AIService, ChatMessage } from '../../services/aiService';
import {
  BrainCircuit,
  Send,
  User,
  Bot,
  Loader2,
  Zap,
  RefreshCw
} from 'lucide-react';

const PROMPT_CHIPS = [
  'Why does deadlock occur?',
  "Explain Banker's Algorithm with a worked example",
  'Difference between Paging and Segmentation',
  'What is Convoy Effect in CPU Scheduling?',
  'Explain Round Robin scheduling with time quantum = 2',
  'How does virtual memory work?'
];

function MessageBubble({ msg }: { msg: ChatMessage & { streaming?: boolean } }) {
  const isUser = msg.role === 'user';

  const renderContent = (text: string) => {
    const parts: React.ReactNode[] = [];
    const codeBlockRegex = /```[\s\S]*?```/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const before = text.slice(lastIdx, match.index);
      if (before) {
        const segments = before.split(/\*\*(.*?)\*\*/g);
        parts.push(
          <span key={`before-${lastIdx}`} className="whitespace-pre-wrap">
            {segments.map((seg, i) =>
              i % 2 === 1 ? <strong key={i} className="text-white font-bold">{seg}</strong> : <span key={i}>{seg}</span>
            )}
          </span>
        );
      }
      const code = match[0].replace(/^```\w*\n?/, '').replace(/```$/, '');
      parts.push(
        <pre key={`code-${match.index}`} className="my-2 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto whitespace-pre-wrap">
          {code}
        </pre>
      );
      lastIdx = match.index + match[0].length;
    }

    const remaining = text.slice(lastIdx);
    if (remaining) {
      const segments = remaining.split(/\*\*(.*?)\*\*/g);
      parts.push(
        <span key="remaining" className="whitespace-pre-wrap">
          {segments.map((seg, i) =>
            i % 2 === 1 ? <strong key={i} className="text-white font-bold">{seg}</strong> : <span key={i}>{seg}</span>
          )}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-1`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
        isUser
          ? 'bg-gradient-to-tr from-brand-600 to-indigo-600'
          : 'bg-gradient-to-tr from-indigo-700 to-brand-600 border border-brand-500/40'
      }`}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
      </div>

      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-brand-600/30 border border-brand-500/30 text-slate-100 rounded-tr-sm'
          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
      }`}>
        {renderContent(msg.text)}
        {(msg as any).streaming && (
          <span className="inline-block w-1.5 h-4 ml-1 bg-brand-400 animate-pulse rounded-full align-middle" />
        )}
      </div>
    </div>
  );
}

export const AIDoubtSolverView: React.FC = () => {
  const { geminiApiKey, activeSubject, generateQuizForTopic, setActiveQuizTopic, setActiveView, isAIEnabled } = useStudyOS();

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `👋 **Welcome to study.AI Tutor!**\n\nI'm your AI-powered study assistant connected to **${activeSubject.name}** syllabus.\n\nAsk me anything — from concept explanations and worked examples to exam tips and mnemonic rules. I'll guide you Socratically so you truly understand, not just memorize.\n\nWhat would you like to explore today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingText]);

  const handleSend = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setIsLoading(true);
    setStreamingText('');

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: userMessage }];
    setChatHistory(newHistory);

    try {
      let accumulated = '';

      await AIService.chat(
        chatHistory,
        userMessage,
        activeSubject.name,
        geminiApiKey,
        (chunk) => {
          accumulated += chunk;
          setStreamingText(accumulated);
        }
      );

      setChatHistory(prev => [
        ...prev,
        { role: 'model', text: accumulated }
      ]);
      setStreamingText('');
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        { role: 'model', text: '❌ Something went wrong. Please check your Gemini API key in settings and try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setChatHistory([{
      role: 'model',
      text: `👋 **New session started.**\n\nI'm ready to help with **${activeSubject.name}**. What's your doubt?`
    }]);
    setStreamingText('');
  };

  const lastAIMessage = [...chatHistory].reverse().find(m => m.role === 'model');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">study.AI Chat Tutor</h1>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isAIEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <p className="text-[11px] text-slate-400">
                {isAIEnabled ? 'Gemini 2.5 Flash — Live AI Connected' : 'Offline Mode — Add API key for live AI'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastAIMessage && !isLoading && (
            <button
              onClick={async () => {
                const topic = activeSubject.units[0]?.topics[0]?.title || 'Operating Systems';
                await generateQuizForTopic(topic, [topic]);
                setActiveQuizTopic(topic);
                setActiveView('quizzes');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-brand-300 text-xs font-bold transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Take Quiz</span>
            </button>
          )}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="New Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-2">
        {chatHistory.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {streamingText && (
          <MessageBubble
            msg={{ role: 'model', text: streamingText, streaming: true } as any}
          />
        )}

        {isLoading && !streamingText && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-700 to-brand-600 border border-brand-500/40 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {chatHistory.length <= 1 && (
        <div className="flex flex-wrap gap-2 pb-3 shrink-0">
          {PROMPT_CHIPS.map(chip => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-colors max-w-[200px] text-left truncate"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      <div className="shrink-0 pt-3 border-t border-slate-800">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your doubt... (Enter to send, Shift+Enter for new line)"
            className="flex-1 p-3.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-brand-500 text-sm text-white placeholder-slate-500 focus:outline-none resize-none transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md transition-all shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-center">
          Powered by Google Gemini 2.5 Flash · study.AI Socratic Engine
        </p>
      </div>
    </div>
  );
};
