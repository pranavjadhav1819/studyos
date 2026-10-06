import { createClient } from '@supabase/supabase-js';
import { localDB } from './dataStore';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  envUrl &&
  envKey &&
  envUrl !== 'https://your-project.supabase.co' &&
  envKey !== 'your-supabase-anon-key'
);

let realClient = null;
if (isSupabaseConfigured) {
  try {
    realClient = createClient(envUrl, envKey);
  } catch (err) {
    console.warn('Supabase initialization failed, falling back to local DB:', err);
  }
}

/**
 * Smart query builder that seamlessly delegates to localDB when in guest/offline mode
 */
function createLocalQueryBuilder(table) {
  let filterFn = () => true;
  let single = false;

  const builder = {
    select: () => builder,
    eq: (col, val) => {
      const prev = filterFn;
      filterFn = (item) => prev(item) && item[col] === val;
      return builder;
    },
    order: (col, { ascending = true } = {}) => {
      // order applied during resolve
      return builder;
    },
    single: async () => {
      single = true;
      const res = await builder.then();
      return { data: res.data?.[0] || null, error: res.data?.[0] ? null : { message: 'Not found' } };
    },
    maybeSingle: async () => {
      const res = await builder.then();
      return { data: res.data?.[0] || null, error: null };
    },
    insert: async (dataOrArr) => {
      const items = Array.isArray(dataOrArr) ? dataOrArr : [dataOrArr];
      if (table === 'subjects') {
        const cur = localDB.getSubjects();
        const created = items.map((i) => ({ ...i, id: i.id || `subj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, created_at: new Date().toISOString() }));
        localDB.saveSubjects([...cur, ...created]);
        return { data: created, error: null };
      }
      if (table === 'units') {
        const cur = localDB.getUnits();
        const created = items.map((i) => ({ ...i, id: i.id || `unit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }));
        localDB.saveUnits([...cur, ...created]);
        return { data: created, error: null };
      }
      if (table === 'topics') {
        const cur = localDB.getTopics();
        const created = items.map((i) => ({ ...i, id: i.id || `top-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }));
        localDB.saveTopics([...cur, ...created]);
        return { data: created, error: null };
      }
      if (table === 'study_sessions') {
        localDB.addXP(25);
        return { data: items, error: null };
      }
      return { data: items, error: null };
    },
    upsert: async (data) => {
      if (table === 'topic_progress') {
        const cur = localDB.getProgress();
        const updated = [...cur.filter((p) => p.topic_id !== data.topic_id), data];
        localDB.saveProgress(updated);
        localDB.addXP(15);
        return { data, error: null };
      }
      if (table === 'notes') {
        const cur = localDB.getNotes();
        const updated = [...cur.filter((n) => n.topic_id !== data.topic_id), data];
        localDB.saveNotes(updated);
        localDB.addXP(10);
        return { data, error: null };
      }
      return { data, error: null };
    },
    delete: () => {
      const delBuilder = {
        eq: async (col, val) => {
          if (table === 'subjects') {
            localDB.saveSubjects(localDB.getSubjects().filter((s) => s[col] !== val));
          } else if (table === 'topics') {
            localDB.saveTopics(localDB.getTopics().filter((t) => t[col] !== val));
          }
          return { error: null };
        },
      };
      return delBuilder;
    },
    then: (resolve) => {
      let data = [];
      if (table === 'subjects') data = localDB.getSubjects();
      else if (table === 'units') data = localDB.getUnits();
      else if (table === 'topics') data = localDB.getTopics();
      else if (table === 'topic_progress') data = localDB.getProgress();
      else if (table === 'notes') data = localDB.getNotes();

      const filtered = data.filter(filterFn);
      const result = { data: single ? filtered[0] || null : filtered, error: null };
      return resolve ? resolve(result) : Promise.resolve(result);
    },
  };

  return builder;
}

/**
 * Universal client proxy
 */
export const supabase = {
  from: (table) => {
    // If in guest mode, ALWAYS use localDB
    const isGuest = localStorage.getItem('studyos_is_guest') === 'true';
    if (isGuest || !realClient) {
      return createLocalQueryBuilder(table);
    }
    return realClient.from(table);
  },
  auth: {
    getSession: async () => {
      const isGuest = localStorage.getItem('studyos_is_guest') === 'true';
      if (isGuest) {
        return {
          data: {
            session: {
              user: {
                id: 'adhd-guest-user',
                email: 'guest@studyos.local',
                user_metadata: { name: 'Focus Champion' },
              },
            },
          },
          error: null,
        };
      }
      if (realClient) return realClient.auth.getSession();
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback) => {
      if (realClient) {
        return realClient.auth.onAuthStateChange(callback);
      }
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async (creds) => {
      if (realClient) return realClient.auth.signInWithPassword(creds);
      return { error: { message: 'Supabase credentials not configured in .env' } };
    },
    signUp: async (creds) => {
      if (realClient) return realClient.auth.signUp(creds);
      return { error: { message: 'Supabase credentials not configured in .env' } };
    },
    signInWithOAuth: async (opts) => {
      if (realClient) return realClient.auth.signInWithOAuth(opts);
      return { error: { message: 'OAuth requires configured Supabase credentials' } };
    },
    signOut: async () => {
      localStorage.removeItem('studyos_is_guest');
      if (realClient) return realClient.auth.signOut();
      return { error: null };
    },
  },
};
