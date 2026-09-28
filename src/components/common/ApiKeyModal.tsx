import React, { useState } from 'react';
import { useStudyOS } from '../../context/StudyOSContext';
import { Key, X, CheckCircle2, Sparkles, ShieldCheck, Zap, ExternalLink, Cpu } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { geminiApiKey, setGeminiApiKey, setNotification, isAIEnabled } = useStudyOS();
  const [inputValue, setInputValue] = useState(geminiApiKey);

  const envKey = (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
  const isEnvConfigured = Boolean(envKey && envKey !== 'your-gemini-api-key');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(inputValue.trim());
    setNotification(
      inputValue.trim()
        ? '✅ Gemini AI Key saved! Live reasoning enabled across all features.'
        : 'Gemini API Key removed. Using offline built-in tutor.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Google Gemini AI Settings</h2>
              <span className="text-[10px] text-slate-400">Fully AI-Controlled StudyOS</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Banner */}
        {isAIEnabled ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-300">
                {isEnvConfigured ? '🔑 Auto-Connected via .env File' : '✅ Gemini AI Connected'}
              </p>
              <p className="text-[10px] text-emerald-400/80 mt-0.5">
                Model: Gemini 2.5 Flash &bull; All features are live AI-powered.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-300">Offline Fallback Mode</p>
              <p className="text-[10px] text-amber-400/80 mt-0.5">
                Add your Gemini API Key below or in .env to activate live generative AI.
              </p>
            </div>
          </div>
        )}

        {/* AI-Controlled Capabilities Matrix */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AI-Controlled Features:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🧠', label: 'Multi-turn Chat Tutor', active: isAIEnabled },
              { icon: '📝', label: 'Dynamic Diagnostic Quizzes', active: isAIEnabled },
              { icon: '📋', label: 'Notes → High-Yield Summary', active: isAIEnabled },
              { icon: '🎴', label: 'Active Recall Flashcards', active: isAIEnabled },
              { icon: '📚', label: 'Syllabus Text Parser', active: isAIEnabled },
              { icon: '🎯', label: 'Adaptive Study Coach', active: isAIEnabled },
            ].map(feat => (
              <div
                key={feat.label}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-medium border ${
                  feat.active
                    ? 'bg-brand-500/10 border-brand-500/20 text-brand-300'
                    : 'bg-slate-800/50 border-slate-750 text-slate-500'
                }`}
              >
                <span>{feat.icon}</span>
                <span className="truncate">{feat.label}</span>
                {feat.active && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-auto shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSave} className="space-y-3 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-0.5"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              placeholder={isEnvConfigured ? '(Configured in .env file)' : 'AIzaSy... or AQ....'}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Key is stored securely in your browser &amp; .env file. Never logged publicly.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
