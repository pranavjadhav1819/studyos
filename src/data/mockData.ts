import { Subject, StudyPlan, Quiz, QuizResult, PYQ, Flashcard, Note, SpacedScheduleItem, DayStudyTime, SubjectBenchmark } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'CS-302',
    targetGrade: 'A+',
    examDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 6,
    color: '#8b5cf6', // violet
    iconName: 'Cpu',
    overallKnowledge: 64,
    units: [
      {
        id: 'unit-1',
        unitNumber: 1,
        title: 'Unit 1: Process Architecture & Concurrency',
        topics: [
          {
            id: 'top-intro-os',
            title: 'Introduction to OS & System Calls',
            unitId: 'unit-1',
            hoursEstimated: 2,
            weightage: 'Medium',
            knowledgeScore: 91,
            status: 'mastered',
            keyConcepts: ['Kernel vs User Space', 'Monolithic vs Microkernel', 'System Call Table'],
            pyqFrequencyScore: 6,
            lastStudiedDate: '2026-09-08',
            nextRevisionDate: '2026-09-18',
            revisionIntervalDays: 10
          },
          {
            id: 'top-proc',
            title: 'Processes & Process Control Block',
            unitId: 'unit-1',
            hoursEstimated: 3,
            weightage: 'High',
            knowledgeScore: 85,
            status: 'mastered',
            keyConcepts: ['PCB Structure', 'Process Lifecycle', 'Context Switching Overhead', 'fork() & exec()'],
            pyqFrequencyScore: 8,
            lastStudiedDate: '2026-09-10',
            nextRevisionDate: '2026-09-16',
            revisionIntervalDays: 6
          },
          {
            id: 'top-threads',
            title: 'Threads & Multithreading Models',
            unitId: 'unit-1',
            hoursEstimated: 2.5,
            weightage: 'High',
            knowledgeScore: 78,
            status: 'in_progress',
            keyConcepts: ['User vs Kernel Threads', 'Many-to-One / One-to-One / Many-to-Many', 'Thread Pools'],
            pyqFrequencyScore: 7,
            lastStudiedDate: '2026-09-11',
            nextRevisionDate: '2026-09-14',
            revisionIntervalDays: 3
          }
        ]
      },
      {
        id: 'unit-2',
        unitNumber: 2,
        title: 'Unit 2: CPU Scheduling & Synchronization',
        topics: [
          {
            id: 'top-cpu-sched',
            title: 'CPU Scheduling Algorithms',
            unitId: 'unit-2',
            hoursEstimated: 5,
            weightage: 'High',
            knowledgeScore: 82,
            status: 'mastered',
            keyConcepts: ['FCFS & Convoy Effect', 'SJF / SRTF', 'Round Robin with Quantum', 'Priority & Aging'],
            pyqFrequencyScore: 10, // Most repeated in exam!
            lastStudiedDate: '2026-09-11',
            nextRevisionDate: '2026-09-15',
            revisionIntervalDays: 4
          },
          {
            id: 'top-sync',
            title: 'Process Synchronization & Semaphores',
            unitId: 'unit-2',
            hoursEstimated: 4.5,
            weightage: 'High',
            knowledgeScore: 70,
            status: 'in_progress',
            keyConcepts: ['Critical Section Problem', "Peterson's Solution", 'Counting vs Binary Semaphores', 'Dining Philosophers'],
            pyqFrequencyScore: 8,
            lastStudiedDate: '2026-09-09',
            nextRevisionDate: '2026-09-14',
            revisionIntervalDays: 5
          },
          {
            id: 'top-deadlocks',
            title: 'Deadlocks',
            unitId: 'unit-2',
            hoursEstimated: 6,
            weightage: 'High',
            knowledgeScore: 41, // ⚠️ WEAK
            status: 'weak',
            keyConcepts: ['4 Coffman Conditions', "Resource Allocation Graph (RAG)", "Banker's Algorithm", 'Havender Resource Ordering'],
            pyqFrequencyScore: 9, // Highly repeated!
            lastStudiedDate: '2026-09-12',
            nextRevisionDate: '2026-09-13', // Due TOMORROW / Today
            revisionIntervalDays: 1
          }
        ]
      },
      {
        id: 'unit-3',
        unitNumber: 3,
        title: 'Unit 3: Memory & Virtual Memory',
        topics: [
          {
            id: 'top-mem-mgmt',
            title: 'Memory Management & Paging',
            unitId: 'unit-3',
            hoursEstimated: 5,
            weightage: 'High',
            knowledgeScore: 67,
            status: 'in_progress',
            keyConcepts: ['Contiguous Allocation', 'Paging & TLB', 'Effective Memory Access Time (EMAT)', 'Internal vs External Fragmentation'],
            pyqFrequencyScore: 8,
            lastStudiedDate: '2026-09-07',
            nextRevisionDate: '2026-09-13',
            revisionIntervalDays: 6
          },
          {
            id: 'top-virt-mem',
            title: 'Virtual Memory & Page Replacement',
            unitId: 'unit-3',
            hoursEstimated: 4.5,
            weightage: 'High',
            knowledgeScore: 63,
            status: 'in_progress',
            keyConcepts: ['Demand Paging', 'Page Fault Handling Routine', 'FIFO & Belady’s Anomaly', 'LRU & Optimal Algorithm'],
            pyqFrequencyScore: 9,
            lastStudiedDate: '2026-09-06',
            nextRevisionDate: '2026-09-13',
            revisionIntervalDays: 7
          }
        ]
      },
      {
        id: 'unit-4',
        unitNumber: 4,
        title: 'Unit 4: Storage & File Systems',
        topics: [
          {
            id: 'top-file-sys',
            title: 'File Systems & Inode Structure',
            unitId: 'unit-4',
            hoursEstimated: 3.5,
            weightage: 'Medium',
            knowledgeScore: 73,
            status: 'in_progress',
            keyConcepts: ['File Allocation Methods', 'UNIX Inode Architecture', 'Directory Structures'],
            pyqFrequencyScore: 6,
            lastStudiedDate: '2026-09-05',
            nextRevisionDate: '2026-09-15',
            revisionIntervalDays: 10
          },
          {
            id: 'top-io-sys',
            title: 'I/O Systems & Disk Scheduling',
            unitId: 'unit-4',
            hoursEstimated: 3,
            weightage: 'Medium',
            knowledgeScore: 75,
            status: 'in_progress',
            keyConcepts: ['DMA Transfer', 'Interrupt Handling', 'SSTF, SCAN, C-SCAN Disk Head Movement'],
            pyqFrequencyScore: 7,
            lastStudiedDate: '2026-09-04',
            nextRevisionDate: '2026-09-16',
            revisionIntervalDays: 12
          }
        ]
      }
    ]
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS-301',
    targetGrade: 'A+',
    examDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 18,
    color: '#06b6d4',
    iconName: 'Binary',
    overallKnowledge: 81,
    units: []
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    code: 'CS-304',
    targetGrade: 'A',
    examDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 25,
    color: '#10b981',
    iconName: 'Network',
    overallKnowledge: 72,
    units: []
  },
  {
    id: 'dbms',
    name: 'Database Management Systems',
    code: 'CS-303',
    targetGrade: 'A+',
    examDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 32,
    color: '#f59e0b',
    iconName: 'Database',
    overallKnowledge: 88,
    units: []
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    code: 'CS-305',
    targetGrade: 'A',
    examDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 40,
    color: '#ec4899',
    iconName: 'BrainCircuit',
    overallKnowledge: 79,
    units: []
  },
  {
    id: 'math',
    name: 'Engineering Mathematics III',
    code: 'BS-301',
    targetGrade: 'A',
    examDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    daysLeft: 50,
    color: '#6366f1',
    iconName: 'Sigma',
    overallKnowledge: 70,
    units: []
  }
];

export const INITIAL_TODAYS_FOCUS = [
  { id: 'tf-1', title: 'Deadlocks (Remedial Drill)', topicName: 'Deadlocks', minutes: 60, completed: false, isWeak: true, priority: 'High (Weakness: 41%)' },
  { id: 'tf-2', title: 'CPU Scheduling', topicName: 'CPU Scheduling', minutes: 45, completed: true, isWeak: false, priority: 'Medium (Revision)' },
  { id: 'tf-3', title: 'Memory Management', topicName: 'Memory Management', minutes: 45, completed: false, isWeak: false, priority: 'High (Exam Weightage)' },
  { id: 'tf-4', title: 'Operating Systems PYQ', topicName: 'PYQ Sprint', minutes: 30, completed: false, isWeak: false, priority: 'Repeated 10-markers' }
];

export const INITIAL_STUDY_PLAN: StudyPlan = {
  id: 'plan-os-6days',
  subjectId: 'os',
  daysCount: 6,
  targetHoursPerDay: 4.5,
  isAdaptiveAdjusted: false,
  adaptiveNote: 'Priority Score = Weakness × Exam Importance × Time Pressure. Deadlocks boosted to top priority.',
  days: [
    {
      dayNumber: 1,
      title: 'Processes + Threads',
      dateStr: 'Day 1 of 6',
      focusTopics: ['Processes + Threads', 'Process Lifecycle', 'Kernel vs User Threads'],
      isRevisionOrPYQ: false,
      tasks: [
        { id: 't1-1', title: 'Review Process Control Block (PCB) & Context Switch latency', type: 'concept', completed: true, durationMins: 45, priorityScore: 72 },
        { id: 't1-2', title: 'Multithreading Models (Many-to-One, One-to-One, Many-to-Many)', type: 'concept', completed: true, durationMins: 45, priorityScore: 68 },
        { id: 't1-3', title: 'Solve 5 PYQs on fork() tree outputs & thread synchronization', type: 'pyq', completed: true, durationMins: 60, priorityScore: 80 },
        { id: 't1-4', title: 'Flashcard Sprint: 15 Core Process Definitions', type: 'revision', completed: true, durationMins: 30, priorityScore: 65 }
      ]
    },
    {
      dayNumber: 2,
      title: 'CPU Scheduling',
      dateStr: 'Day 2 of 6',
      focusTopics: ['CPU Scheduling Algorithms', 'Gantt Charts', 'Scheduling Metrics'],
      isRevisionOrPYQ: false,
      tasks: [
        { id: 't2-1', title: 'Turnaround Time & Waiting Time derivations for FCFS and SJF', type: 'concept', completed: true, durationMins: 60, priorityScore: 84 },
        { id: 't2-2', title: 'Solve Round Robin numericals with Time Quantum = 2ms and 4ms', type: 'concept', completed: true, durationMins: 60, priorityScore: 88 },
        { id: 't2-3', title: 'Solve 3 previous exam questions on SRTF vs Priority Preemption', type: 'pyq', completed: true, durationMins: 45, priorityScore: 82 },
        { id: 't2-4', title: 'CPU Scheduling Diagnostic Quiz (Result: 82% ✓)', type: 'quiz', completed: true, durationMins: 20, priorityScore: 70 }
      ]
    },
    {
      dayNumber: 3,
      title: 'Deadlocks (🔴 High Priority Weak Area)',
      dateStr: 'Day 3 of 6',
      focusTopics: ['Deadlock Conditions', "Banker's Algorithm", 'Resource Allocation Graphs'],
      isRevisionOrPYQ: false,
      isWeakRemediation: true,
      tasks: [
        { id: 't3-1', title: 'Master 4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait', type: 'concept', completed: true, durationMins: 40, priorityScore: 98 },
        { id: 't3-2', title: "Step-by-step trace of Banker's Safety Algorithm & Resource Request test", type: 'concept', completed: true, durationMins: 55, priorityScore: 99 },
        { id: 't3-3', title: 'Deadlocks Diagnostic Quiz (Score: 41% ⚠️ Flagged as Weak)', type: 'quiz', completed: true, durationMins: 25, priorityScore: 100 },
        { id: 't3-4', title: 'Remedial Drill: Banker Need Matrix calculation & RAG cycle resolution', type: 'remedial', completed: false, durationMins: 60, priorityScore: 100 }
      ]
    },
    {
      dayNumber: 4,
      title: 'Memory Management',
      dateStr: 'Day 4 of 6',
      focusTopics: ['Paging & TLB', 'Virtual Memory', 'Page Replacement'],
      isRevisionOrPYQ: false,
      tasks: [
        { id: 't4-1', title: 'Paging hardware, Frame tables, Page table entries & TLB address translation', type: 'concept', completed: false, durationMins: 60, priorityScore: 85 },
        { id: 't4-2', title: 'Calculate Effective Memory Access Time (EMAT) with 80% TLB hit ratio', type: 'concept', completed: false, durationMins: 45, priorityScore: 88 },
        { id: 't4-3', title: 'Run FIFO, LRU, and Optimal page replacement algorithms on 12-page strings', type: 'pyq', completed: false, durationMins: 60, priorityScore: 89 },
        { id: 't4-4', title: 'Memory Management Diagnostic Quiz', type: 'quiz', completed: false, durationMins: 20, priorityScore: 75 }
      ]
    },
    {
      dayNumber: 5,
      title: 'PYQs (Previous Year Questions Sprint)',
      dateStr: 'Day 5 of 6',
      focusTopics: ['High-Weightage 10-Mark Questions', 'University Papers 2021-2025'],
      isRevisionOrPYQ: true,
      tasks: [
        { id: 't5-1', title: 'Solve 2024 University Final Paper (Sections A & B)', type: 'pyq', completed: false, durationMins: 90, priorityScore: 92 },
        { id: 't5-2', title: 'Solve 2023 10-mark repeated numericals on Scheduling & Banker Algorithm', type: 'pyq', completed: false, durationMins: 75, priorityScore: 94 },
        { id: 't5-3', title: 'Review Inode file system allocation & disk arm scheduling (SSTF vs C-SCAN)', type: 'concept', completed: false, durationMins: 45, priorityScore: 78 }
      ]
    },
    {
      dayNumber: 6,
      title: 'Revision & Weak Area Consolidation',
      dateStr: 'Day 6 of 6',
      focusTopics: ['High-Yield Cheat Sheets', 'Formula Memorization', 'Weak Area Drills'],
      isRevisionOrPYQ: true,
      tasks: [
        { id: 't6-1', title: 'Full Spaced Flashcard Deck Run (All due cards + Deadlocks deck)', type: 'revision', completed: false, durationMins: 60, priorityScore: 95 },
        { id: 't6-2', title: 'Formula Sheet Speed Run: EMAT, CPU Wait Time, Disk Seek Time', type: 'revision', completed: false, durationMins: 40, priorityScore: 90 },
        { id: 't6-3', title: 'Final 25-question Mock Exam Simulation under 45 min timer', type: 'quiz', completed: false, durationMins: 60, priorityScore: 95 }
      ]
    }
  ]
};

export const INITIAL_QUIZ_RESULTS: QuizResult[] = [
  {
    id: 'qr-cpu',
    quizId: 'q-cpu-sched',
    topicId: 'top-cpu-sched',
    topicName: 'CPU Scheduling',
    totalQuestions: 10,
    correctCount: 8,
    scorePercentage: 82,
    date: 'Yesterday',
    isWeak: false,
    weakConcepts: ['Convoy Effect in FCFS'],
    strongConcepts: ['Round Robin Time Quantum', 'SRTF Preemption', 'Turnaround vs Waiting Time']
  },
  {
    id: 'qr-deadlocks',
    quizId: 'q-deadlocks',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    totalQuestions: 10,
    correctCount: 4,
    scorePercentage: 41, // 41%
    date: 'Today',
    isWeak: true,
    weakConcepts: ["Banker's Algorithm Safety State", "Resource Allocation Graph (RAG) Multi-Instance"],
    strongConcepts: ['Deadlock Conditions (Coffman)', "Havender's Resource Ordering"]
  },
  {
    id: 'qr-mem',
    quizId: 'q-mem-mgmt',
    topicId: 'top-mem-mgmt',
    topicName: 'Memory Management',
    totalQuestions: 10,
    correctCount: 7,
    scorePercentage: 67,
    date: '3 days ago',
    isWeak: false,
    weakConcepts: ['Effective Memory Access Time with Multi-Level Paging'],
    strongConcepts: ['Belady’s Anomaly in FIFO', 'Internal vs External Fragmentation']
  },
  {
    id: 'qr-files',
    quizId: 'q-file-sys',
    topicId: 'top-file-sys',
    topicName: 'File Systems',
    totalQuestions: 10,
    correctCount: 7,
    scorePercentage: 73,
    date: '4 days ago',
    isWeak: false,
    weakConcepts: ['Indexed Allocation Indirect Blocks'],
    strongConcepts: ['Inode Attributes', 'C-SCAN Disk Scheduling']
  }
];

export const SPACED_SCHEDULE: SpacedScheduleItem[] = [
  {
    id: 'ss-1',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    stageName: 'Learned',
    scheduledDate: 'Sept 12',
    status: 'completed',
    lastScore: 41
  },
  {
    id: 'ss-2',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    stageName: 'Revision 1 (⚠️ Moved earlier due to 41% score)',
    scheduledDate: 'Sept 13 (Today)',
    status: 'due_today',
    lastScore: 41
  },
  {
    id: 'ss-3',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    stageName: 'Revision 2 (Algorithms & Banker drill)',
    scheduledDate: 'Sept 15',
    status: 'upcoming'
  },
  {
    id: 'ss-4',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    stageName: 'Revision 3 (PYQ solving)',
    scheduledDate: 'Sept 19',
    status: 'upcoming'
  },
  {
    id: 'ss-5',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    stageName: 'Revision 4 (Final Mastery)',
    scheduledDate: 'Sept 27',
    status: 'upcoming'
  }
];

export const PYQ_FREQUENCY_ANALYSIS = [
  { topicName: 'CPU Scheduling', frequencyScore: 10, timesRepeated: 12, percentage: 95 },
  { topicName: 'Deadlocks', frequencyScore: 8, timesRepeated: 9, percentage: 80 },
  { topicName: 'Memory Management', frequencyScore: 7, timesRepeated: 8, percentage: 70 },
  { topicName: 'File Systems', frequencyScore: 5, timesRepeated: 5, percentage: 50 }
];

export const HIGH_PROBABILITY_TOPICS = [
  { rank: 1, title: 'CPU Scheduling (Gantt Charts & SRTF Numericals)', probability: '98%', marksExpectation: '10 Marks' },
  { rank: 2, title: "Deadlock (Banker's Algorithm & Coffman Prevention)", probability: '94%', marksExpectation: '10 Marks' },
  { rank: 3, title: 'Paging & TLB Hit Rate Calculation (EMAT)', probability: '88%', marksExpectation: '5 - 10 Marks' },
  { rank: 4, title: 'Page Replacement Algorithms (FIFO vs LRU vs OPT)', probability: '85%', marksExpectation: '10 Marks' }
];

export const QUIZZES: Quiz[] = [
  {
    id: 'q-deadlocks',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    title: 'Deadlocks & Concurrency Mastery Diagnostic',
    questions: [
      {
        id: 'qd-1',
        question: 'Which of the following is NOT one of the four essential Coffman conditions for deadlock?',
        options: [
          'Mutual Exclusion',
          'Hold and Wait',
          'Preemptive Resource Allocation',
          'Circular Wait'
        ],
        correctIndex: 2,
        conceptTag: 'Deadlock Conditions (Coffman)',
        explanation: 'The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. If preemption is allowed, deadlocks cannot persist.'
      },
      {
        id: 'qd-2',
        question: "In Banker's Algorithm, if the system is currently in an 'Unsafe State', what does that strictly imply?",
        options: [
          'The system is guaranteed to already be deadlocked right now.',
          'A deadlock is possible, but not necessarily present at this instant.',
          'All processes have terminated abnormally.',
          'Resource allocation must be restarted immediately.'
        ],
        correctIndex: 1,
        conceptTag: "Banker's Algorithm Safety State",
        explanation: "An unsafe state is NOT deadlocked; rather, it means the operating system can no longer guarantee that a sequence exists to avoid deadlock if all processes suddenly request their maximum stated claims."
      },
      {
        id: 'qd-3',
        question: "In Banker's Algorithm, what is the formula to calculate the Need matrix?",
        options: [
          'Need = Allocation - Max',
          'Need = Max - Allocation',
          'Need = Available + Allocation',
          'Need = Max + Available'
        ],
        correctIndex: 1,
        conceptTag: "Banker's Algorithm Safety State",
        explanation: 'Need[i, j] = Max[i, j] - Allocation[i, j]. It represents the remaining resources process i may request.'
      },
      {
        id: 'qd-4',
        question: 'A Resource Allocation Graph (RAG) contains a directed cycle. When does this cycle DEFINITIVELY prove that a deadlock exists?',
        options: [
          'Whenever there are multiple instances of each resource type',
          'Only when every resource type in the graph has exactly ONE single instance',
          'Only when all processes are CPU-bound',
          'A cycle in a RAG always implies deadlock regardless of instances'
        ],
        correctIndex: 1,
        conceptTag: "Resource Allocation Graph (RAG) Multi-Instance",
        explanation: 'If each resource type has exactly ONE instance, a cycle is both necessary and sufficient for deadlock. With multiple instances, a cycle indicates a possible deadlock, but not a guaranteed one.'
      },
      {
        id: 'qd-5',
        question: 'Which deadlock prevention technique assigns a strict global numeric order to all resources to eliminate Circular Wait?',
        options: [
          'Deadlock Recovery via Process Termination',
          "Havender's Resource Ordering (Total Ordering)",
          "Banker's Safety Check (Avoidance)",
          'The Ostrich Algorithm'
        ],
        correctIndex: 1,
        conceptTag: "Havender's Resource Ordering",
        explanation: 'By imposing a total ordering of all resources and requiring processes to request resources only in an increasing order of enumeration, Circular Wait is mathematically impossible.'
      }
    ]
  },
  {
    id: 'q-cpu-sched',
    topicId: 'top-cpu-sched',
    topicName: 'CPU Scheduling',
    title: 'CPU Scheduling & Gantt Chart Diagnostic',
    questions: [
      {
        id: 'qc-1',
        question: 'Which scheduling algorithm is provably optimal in terms of giving the minimum average waiting time for a set of stationary processes?',
        options: [
          'First-Come, First-Served (FCFS)',
          'Shortest Job First (SJF)',
          'Round Robin (RR)',
          'Multilevel Queue'
        ],
        correctIndex: 1,
        conceptTag: 'SRTF Preemption',
        explanation: 'SJF (or Shortest Remaining Time First for preemptive systems) gives the theoretical minimum average waiting time.'
      },
      {
        id: 'qc-2',
        question: 'What undesirable phenomenon occurs in FCFS scheduling when a long CPU-bound process holds the CPU while multiple I/O-bound processes wait behind it?',
        options: [
          'Priority Inversion',
          'Convoy Effect',
          'Belady’s Anomaly',
          'Thrashing'
        ],
        correctIndex: 1,
        conceptTag: 'Convoy Effect in FCFS',
        explanation: 'The Convoy Effect results in poor CPU and device utilization when small processes queue behind one giant burst process in FCFS.'
      },
      {
        id: 'qc-3',
        question: 'If the time quantum in Round Robin scheduling is set to an extremely large value (greater than the longest burst), it behaves identically to:',
        options: [
          'Shortest Job First (SJF)',
          'First-Come, First-Served (FCFS)',
          'Priority Scheduling',
          'Shortest Remaining Time First (SRTF)'
        ],
        correctIndex: 1,
        conceptTag: 'Round Robin Time Quantum',
        explanation: 'When the time quantum is larger than all process bursts, processes never get preempted before completing their burst, turning RR into FCFS.'
      }
    ]
  }
];

export const PYQS: PYQ[] = [
  {
    id: 'pyq-1',
    subjectId: 'os',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    year: 2024,
    examType: 'SPPU / University Final Exam',
    marks: 10,
    repeatedTimes: 9,
    difficulty: 'Hard',
    solvedStatus: 'unsolved',
    isStarred: true,
    questionText: "Consider a system with 5 processes (P0 to P4) and 3 resource types (A=10, B=5, C=7). At time T0, Allocation and Max matrices are given. (i) Compute the Need Matrix. (ii) Check whether the system is in a safe state using Banker's Algorithm. If safe, find the safe execution sequence.",
    modelAnswer: `Step 1: Need Matrix Calculation
Need[i] = Max[i] - Allocation[i]
- P0: [7, 5, 3] - [0, 1, 0] = [7, 4, 3]
- P1: [3, 2, 2] - [2, 0, 0] = [1, 2, 2]
- P2: [9, 0, 2] - [3, 0, 2] = [6, 0, 0]
- P3: [2, 2, 2] - [2, 1, 1] = [0, 1, 1]
- P4: [4, 3, 3] - [0, 0, 2] = [4, 3, 1]

Step 2: Calculate Available Resources
Total Instances: A=10, B=5, C=7
Total Allocated: A=7, B=2, C=5
Available = Total - Allocated = [10-7, 5-2, 7-5] = [3, 3, 2]

Step 3: Safety Algorithm Execution
- Check P1: Need [1, 2, 2] <= Available [3, 3, 2] -> YES!
  P1 completes. New Available = [3, 3, 2] + [2, 0, 0] = [5, 3, 2]
- Check P3: Need [0, 1, 1] <= Available [5, 3, 2] -> YES!
  P3 completes. New Available = [5, 3, 2] + [2, 1, 1] = [7, 4, 3]
- Check P4: Need [4, 3, 1] <= Available [7, 4, 3] -> YES!
  P4 completes. New Available = [7, 4, 3] + [0, 0, 2] = [7, 4, 5]
- Check P0: Need [7, 4, 3] <= Available [7, 4, 5] -> YES!
  P0 completes. New Available = [7, 4, 5] + [0, 1, 0] = [7, 5, 5]
- Check P2: Need [6, 0, 0] <= Available [7, 5, 5] -> YES!
  P2 completes. New Available = [7, 5, 5] + [3, 0, 2] = [10, 5, 7]

Conclusion: System is in a SAFE STATE.
Safe Sequence: < P1, P3, P4, P0, P2 >`,
    keyPoints: [
      'Need = Max - Allocation matrix clearly tabulated',
      'Available calculated by Total - sum(Allocated)',
      'Step-by-step vector addition shown for each process completion',
      'Final safe sequence explicitly written in angle brackets <P1, P3, P4, P0, P2>'
    ]
  },
  {
    id: 'pyq-2',
    subjectId: 'os',
    topicId: 'top-cpu-sched',
    topicName: 'CPU Scheduling',
    year: 2023,
    examType: 'SPPU Mid-Semester Exam',
    marks: 10,
    repeatedTimes: 12,
    difficulty: 'Medium',
    solvedStatus: 'mastered',
    isStarred: false,
    questionText: 'Given four processes P1(burst=8, arrival=0), P2(burst=4, arrival=1), P3(burst=9, arrival=2), P4(burst=5, arrival=3). Draw the Gantt chart and calculate Average Waiting Time and Average Turnaround Time using Shortest Remaining Time First (SRTF).',
    modelAnswer: `Gantt Chart Timeline:
[0--1: P1(7)] -> [1--5: P2(0)] -> [5--10: P4(0)] -> [10--17: P1(0)] -> [17--26: P3(0)]

Calculations:
- P2: Arrival=1, Burst=4, Completion=5, TAT = 5 - 1 = 4 ms, WT = 4 - 4 = 0 ms
- P4: Arrival=3, Burst=5, Completion=10, TAT = 10 - 3 = 7 ms, WT = 7 - 5 = 2 ms
- P1: Arrival=0, Burst=8, Completion=17, TAT = 17 - 0 = 17 ms, WT = 17 - 8 = 9 ms
- P3: Arrival=2, Burst=9, Completion=26, TAT = 26 - 2 = 24 ms, WT = 24 - 9 = 15 ms

Averages:
- Average Turnaround Time = (4 + 7 + 17 + 24) / 4 = 52 / 4 = 13.0 ms
- Average Waiting Time = (0 + 2 + 9 + 15) / 4 = 26 / 4 = 6.5 ms`,
    keyPoints: [
      'Draw neat horizontal Gantt chart with time units',
      'Table with columns: Process, Arrival, Burst, Completion, TAT, WT',
      'Formula written before applying numbers'
    ]
  },
  {
    id: 'pyq-3',
    subjectId: 'os',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    year: 2022,
    examType: 'SPPU Final Exam',
    marks: 5,
    repeatedTimes: 8,
    difficulty: 'Medium',
    solvedStatus: 'attempted',
    isStarred: true,
    questionText: 'Explain the four Coffman conditions necessary for deadlock. How can the system prevent deadlock by denying the Circular Wait condition?',
    modelAnswer: `The 4 Coffman Conditions:
1. Mutual Exclusion: Resources cannot be shared; held exclusively by one process.
2. Hold and Wait: Process holds >= 1 resource while requesting others currently held.
3. No Preemption: Resources cannot be forcibly seized; only released voluntarily.
4. Circular Wait: P0 -> P1 -> P2 -> ... -> Pn -> P0 in a closed cyclic wait.

Denial of Circular Wait (Havender's Resource Ordering):
Assign a unique integer rank to each resource: F: R -> N.
Processes are only permitted to request resources in strictly ascending order of rank: F(R_next) > F(R_current).
If a cycle exists, then F(R0) < F(R1) < ... < F(Rn) < F(R0), an impossible contradiction. Thus, Circular Wait is prevented.`,
    keyPoints: [
      'All 4 conditions defined clearly',
      'Total ordering function F: R -> N stated',
      'Contradiction proof explained in 2 lines'
    ]
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    subjectId: 'os',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    front: 'What are the 4 Coffman Conditions for Deadlock?',
    back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\n\nAll 4 must hold simultaneously for a deadlock to exist.',
    level: 'learning',
    repetitions: 1,
    nextReviewDays: 1,
    isWeakTopicPriority: true
  },
  {
    id: 'fc-2',
    subjectId: 'os',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    front: "In Banker's Algorithm, what is the exact formula for the Need Matrix?",
    formula: 'Need[i, j] = Max[i, j] - Allocation[i, j]',
    back: 'The Need matrix indicates the remaining resources process i may still request before it finishes and releases all its allocated resources.',
    level: 'learning',
    repetitions: 1,
    nextReviewDays: 1,
    isWeakTopicPriority: true
  },
  {
    id: 'fc-3',
    subjectId: 'os',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    front: 'How does Havender’s ordering prevent Circular Wait?',
    back: 'Assigns each resource a natural number rank. A process can only request resources in strictly increasing order of rank. This guarantees no cycle can form in the Resource Allocation Graph.',
    level: 'new',
    repetitions: 0,
    nextReviewDays: 1,
    isWeakTopicPriority: true
  },
  {
    id: 'fc-4',
    subjectId: 'os',
    topicId: 'top-cpu-sched',
    topicName: 'CPU Scheduling',
    front: 'Formulas for Turnaround Time (TAT) and Waiting Time (WT)?',
    formula: 'TAT = Completion Time - Arrival Time\nWT = Turnaround Time - Burst Time',
    back: 'TAT measures total residence time in the system.\nWT measures time spent doing nothing in the ready queue.',
    level: 'mastered',
    repetitions: 4,
    nextReviewDays: 6,
    isWeakTopicPriority: false
  },
  {
    id: 'fc-5',
    subjectId: 'os',
    topicId: 'top-mem-mgmt',
    topicName: 'Memory Management',
    front: 'Effective Memory Access Time (EMAT) formula with TLB?',
    formula: 'EMAT = h * (t_tlb + t_mem) + (1 - h) * (t_tlb + 2 * t_mem)',
    back: 'Where:\n- h = TLB hit ratio\n- t_tlb = TLB lookup time\n- t_mem = main memory access time\n(Assuming 1-level page table where a TLB miss requires 1 page table lookup + 1 memory access).',
    level: 'learning',
    repetitions: 2,
    nextReviewDays: 2,
    isWeakTopicPriority: false
  }
];

export const NOTES: Note[] = [
  {
    id: 'note-deadlocks',
    subjectId: 'os',
    topicId: 'top-deadlocks',
    topicName: 'Deadlocks',
    title: "Deadlocks: 4 Conditions, Banker's Algorithm & Resource Ordering",
    updatedAt: '2 hours ago',
    tags: ['Weak Area', '10 Marks Question', 'Formulas'],
    aiSummary: 'Deadlock requires 4 simultaneous conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait). Banker’s Algorithm avoids deadlock by ensuring the system never enters an Unsafe State using Need = Max - Allocation.',
    formulas: [
      {
        name: 'Need Matrix',
        formula: 'Need[i, j] = Max[i, j] - Allocation[i, j]',
        note: 'Calculated per process i and resource type j.'
      },
      {
        name: 'Resource Request Safety Check',
        formula: 'Request[i] <= Need[i]  AND  Request[i] <= Available',
        note: 'If satisfied, perform trial allocation and execute Safety Algorithm.'
      }
    ],
    content: `### 1. Four Coffman Conditions
- **Mutual Exclusion**: Non-shareable resource; only one process can use at a time.
- **Hold and Wait**: Process holds >= 1 resource and waits for another held by another process.
- **No Preemption**: Resources cannot be confiscated; voluntarily released only.
- **Circular Wait**: Cyclic dependency: P0 waits for P1, P1 waits for P2 ... Pn waits for P0.

### 2. Banker's Algorithm (Deadlock Avoidance)
1. Compute **Need = Max - Allocation**.
2. Initialize **Work = Available** and **Finish[i] = false** for all $i$.
3. Find an index $i$ such that:
   - \`Finish[i] == false\`
   - \`Need[i] <= Work\`
4. If found:
   - \`Work = Work + Allocation[i]\`
   - \`Finish[i] = true\`
   - Return to step 3.
5. If all processes have \`Finish[i] == true\`, the state is **SAFE** and a valid **Safe Sequence** exists!`
  },
  {
    id: 'note-sched',
    subjectId: 'os',
    topicId: 'top-cpu-sched',
    topicName: 'CPU Scheduling',
    title: 'CPU Scheduling Algorithms & Gantt Chart Guide',
    updatedAt: 'Yesterday',
    tags: ['High Yield', 'Gantt Charts', 'Numericals'],
    aiSummary: 'SRTF is optimal for preemptive scheduling. Round Robin offers fair response times with time quantum q. Turnaround Time = Completion - Arrival, Waiting Time = Turnaround - Burst.',
    formulas: [
      {
        name: 'Turnaround Time',
        formula: 'TAT = Completion Time - Arrival Time',
        note: 'Residence duration.'
      },
      {
        name: 'Waiting Time',
        formula: 'WT = TAT - Burst Time',
        note: 'Time spent in Ready Queue.'
      }
    ],
    content: `### CPU Scheduling Algorithms Comparison
- **FCFS**: Non-preemptive, simple, suffers from Convoy Effect.
- **SJF**: Non-preemptive, minimum avg waiting time, risk of starvation.
- **SRTF**: Preemptive SJF, provably optimal minimum average waiting time.
- **Round Robin (RR)**: Preemptive based on time quantum $q$. If $q \\to \\infty$, RR becomes FCFS.`
  }
];

export const WEEKLY_STUDY_TIME: DayStudyTime[] = [
  { day: 'Mon', hours: 5 },
  { day: 'Tue', hours: 7 },
  { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 8 },
  { day: 'Fri', hours: 5 },
  { day: 'Sat', hours: 9 },
  { day: 'Sun', hours: 6 }
];

export const SUBJECT_BENCHMARKS: SubjectBenchmark[] = [
  { name: 'DSA', score: 81, isWeak: false },
  { name: 'OS', score: 64, isWeak: true },
  { name: 'CN', score: 72, isWeak: false },
  { name: 'DBMS', score: 88, isWeak: false },
  { name: 'AI/ML', score: 79, isWeak: false }
];
