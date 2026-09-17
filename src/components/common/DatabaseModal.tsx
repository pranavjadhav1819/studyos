import React, { useState } from 'react';
import { Database, X, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../../lib/supabase';
import { useStudyOS } from '../../context/StudyOSContext';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const { setNotification } = useStudyOS();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(url, anonKey);
    setTestStatus({ loading: true });
    const result = await testSupabaseConnection();
    setTestStatus({ loading: false, success: result.success, message: result.message });
    if (result.success) {
      setNotification('✅ Supabase Database successfully connected!');
    }
  };

  const handleTestOnly = async () => {
    saveSupabaseConfig(url, anonKey);
    setTestStatus({ loading: true });
    const result = await testSupabaseConnection();
    setTestStatus({ loading: false, success: result.success, message: result.message });
  };

  const copySqlSchema = () => {
    const schemaNotice = `-- See supabase/schema.sql in project root for the complete schema.
-- Copy and run that file in https://supabase.com/dashboard/project/_/sql`;
    navigator.clipboard.writeText(schemaNotice);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Supabase PostgreSQL Database</h2>
              <span className="text-xs text-slate-400">Cloud Data Persistence & Multi-Device Sync</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-850/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <p className="leading-relaxed">
            Connect your project to <strong className="text-white">Supabase</strong> for a real PostgreSQL database backing all subjects, syllabus trees, quiz scores, and flashcards.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Project Settings → API</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzprojectid.supabase.co"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-850 border border-slate-750 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {testStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                testStatus.loading
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 animate-pulse'
                  : testStatus.success
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              {testStatus.loading ? (
                <span>Connecting to Supabase...</span>
              ) : testStatus.success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{testStatus.message}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{testStatus.message}</span>
                </>
              )}
            </div>
          )}

          {/* SQL Schema helper box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-semibold text-slate-200">Database Schema Ready</div>
              <div className="text-[11px] text-slate-400">Created file in: <code>supabase/schema.sql</code></div>
            </div>
            <button
              type="button"
              onClick={copySqlSchema}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied' : 'Copy Notice'}</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTestOnly}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Test Ping
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
            >
              Save & Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
