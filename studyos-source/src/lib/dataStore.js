/**
 * Local Data Store & Mock Backend for ADHD StudyOS
 * Provides full offline & guest support with preloaded demo data so the app works 100% out of the box.
 */

const DEFAULT_SUBJECTS = [
  {
    id: 'subj-os',
    name: 'Operating Systems',
    exam_name: 'Mid-Sem Exam',
    exam_date: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'subj-cn',
    name: 'Computer Networks',
    exam_name: 'End-Sem Exam',
    exam_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'subj-dsa',
    name: 'Data Structures & Algorithms',
    exam_name: 'Final University Exam',
    exam_date: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_UNITS = [
  { id: 'unit-os-1', subject_id: 'subj-os', name: 'Unit 1: Process Management & Deadlocks', order_index: 1 },
  { id: 'unit-os-2', subject_id: 'subj-os', name: 'Unit 2: Memory & Storage Hierarchy', order_index: 2 },
  { id: 'unit-cn-1', subject_id: 'subj-cn', name: 'Unit 1: Transport & Network Layer Protocols', order_index: 1 },
  { id: 'unit-dsa-1', subject_id: 'subj-dsa', name: 'Unit 1: Dynamic Programming & Trees', order_index: 1 },
];

const DEFAULT_TOPICS = [
  { id: 'top-dl', subject_id: 'subj-os', unit_id: 'unit-os-1', name: 'Deadlocks & Coffman Conditions', order_index: 1 },
  { id: 'top-cpu', subject_id: 'subj-os', unit_id: 'unit-os-1', name: 'CPU Scheduling Algorithms', order_index: 2 },
  { id: 'top-mem', subject_id: 'subj-os', unit_id: 'unit-os-2', name: 'Paging & Virtual Memory', order_index: 3 },
  { id: 'top-fs', subject_id: 'subj-os', unit_id: 'unit-os-2', name: 'File System Indexing & Inodes', order_index: 4 },
  { id: 'top-tcp', subject_id: 'subj-cn', unit_id: 'unit-cn-1', name: 'TCP 3-Way Handshake & Congestion Control', order_index: 1 },
  { id: 'top-route', subject_id: 'subj-cn', unit_id: 'unit-cn-1', name: 'Distance Vector & Link State Routing', order_index: 2 },
  { id: 'top-dp', subject_id: 'subj-dsa', unit_id: 'unit-dsa-1', name: '0/1 Knapsack & LCS Problems', order_index: 1 },
  { id: 'top-bst', subject_id: 'subj-dsa', unit_id: 'unit-dsa-1', name: 'Binary Search Trees & AVL Rotations', order_index: 2 },
];

const DEFAULT_PROGRESS = [
  { topic_id: 'top-dl', knowledge_score: 35 },
  { topic_id: 'top-cpu', knowledge_score: 82 },
  { topic_id: 'top-mem', knowledge_score: 55 },
  { topic_id: 'top-fs', knowledge_score: 74 },
  { topic_id: 'top-tcp', knowledge_score: 42 },
  { topic_id: 'top-route', knowledge_score: 68 },
  { topic_id: 'top-dp', knowledge_score: 30 },
  { topic_id: 'top-bst', knowledge_score: 85 },
];

const DEFAULT_NOTES = [
  {
    topic_id: 'top-dl',
    content: `# Deadlocks High-Yield Exam Notes
Deadlock occurs when processes wait for resources held by each other in a circular chain.

## 4 Coffman Conditions (Must ALL hold simultaneously):
1. Mutual Exclusion (one process at a time)
2. Hold & Wait (holds R1, waits for R2)
3. No Preemption (resources cannot be forcibly taken)
4. Circular Wait (P1->P2->P3->P1)

## Banker's Algorithm Rule:
Need = Max - Allocation. If Need <= Available, system can remain safe!`,
  },
];

function getStored(key, fallback) {
  try {
    const val = localStorage.getItem(`studyos_db_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(`studyos_db_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

export const localDB = {
  getSubjects: () => getStored('subjects', DEFAULT_SUBJECTS),
  saveSubjects: (data) => setStored('subjects', data),

  getUnits: () => getStored('units', DEFAULT_UNITS),
  saveUnits: (data) => setStored('units', data),

  getTopics: () => getStored('topics', DEFAULT_TOPICS),
  saveTopics: (data) => setStored('topics', data),

  getProgress: () => getStored('progress', DEFAULT_PROGRESS),
  saveProgress: (data) => setStored('progress', data),

  getNotes: () => getStored('notes', DEFAULT_NOTES),
  saveNotes: (data) => setStored('notes', data),

  getBrainDumps: () => getStored('braindump', []),
  saveBrainDumps: (data) => setStored('braindump', data),

  getXP: () => getStored('xp', 150),
  addXP: (amount) => {
    const current = getStored('xp', 150);
    const updated = current + amount;
    setStored('xp', updated);
    return updated;
  },

  getStreak: () => getStored('streak', 4),
};
