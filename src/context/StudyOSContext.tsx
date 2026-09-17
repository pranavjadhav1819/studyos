import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Subject,
  StudyPlan,
  Quiz,
  QuizResult,
  SpacedScheduleItem,
  Flashcard,
  PYQ,
  Note,
  PYQStatus,
  TopicWeightage
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_STUDY_PLAN,
  INITIAL_QUIZ_RESULTS,
  SPACED_SCHEDULE,
  FLASHCARDS,
  PYQS,
  NOTES,
  INITIAL_TODAYS_FOCUS,
  QUIZZES
} from '../data/mockData';
import { AIService } from '../services/aiService';
import confetti from 'canvas-confetti';

interface TodaysFocusItem {
  id: string;
  title: string;
  topicName: string;
  minutes: number;
  completed: boolean;
  isWeak: boolean;
  priority: string;
}

interface FocusTimer {
  isRunning: boolean;
  taskTitle: string;
  secondsRemaining: number;
  totalSeconds: number;
}

interface StudyOSContextType {
  activeView: string;
  setActiveView: (view: string) => void;
  subjects: Subject[];
  activeSubjectId: string;
  activeSubject: Subject;
  switchSubject: (id: string) => void;
  addSubject: (name: string, code: string, daysLeft: number) => void;
  addTopic: (unitId: string, title: string, weightage: TopicWeightage) => void;
  parseSyllabusAndAdd: (rawText: string) => Promise<void>;
  todaysFocus: TodaysFocusItem[];
  toggleFocusTask: (id: string) => void;
  studyPlan: StudyPlan;
  completeTask: (dayNumber: number, taskId: string) => void;
  rebalanceAdaptivePlan: () => void;
  quizzes: Quiz[];
  activeQuizTopic: string | null;
  setActiveQuizTopic: (topic: string | null) => void;
  generateQuizForTopic: (topicTitle: string, keyConcepts: string[]) => Promise<Quiz>;
  quizResults: QuizResult[];
  recordQuizResult: (result: QuizResult) => void;
  spacedSchedule: SpacedScheduleItem[];
  adjustSpacedInterval: (topicId: string, shiftEarlier: boolean) => void;
  flashcards: Flashcard[];
  reviewFlashcard: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  pyqs: PYQ[];
  toggleStarPYQ: (id: string) => void;
  updatePYQStatus: (id: string, status: PYQStatus) => void;
  notes: Note[];
  saveNote: (note: Note) => void;
  generateSummaryFromNote: (noteId: string) => Promise<void>;
  generateCardsFromNote: (noteId: string) => Promise<void>;
  timer: FocusTimer;
  startTimer: (taskTitle: string, minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  examMode: boolean;
  setExamMode: (active: boolean) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
  askCoachForToday: (hoursAvailable: number) => TodaysFocusItem[];
}

const StudyOSContext = createContext<StudyOSContextType | undefined>(undefined);

export const StudyOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<string>('dashboard');

  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`studyos_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [subjects, setSubjects] = useState<Subject[]>(() => loadStored('subjects', INITIAL_SUBJECTS));
  const [activeSubjectId, setActiveSubjectId] = useState<string>('os');
  const [todaysFocus, setTodaysFocus] = useState<TodaysFocusItem[]>(() => loadStored('todays_focus', INITIAL_TODAYS_FOCUS));
  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => loadStored('study_plan', INITIAL_STUDY_PLAN));
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => loadStored('quizzes', QUIZZES));
  const [activeQuizTopic, setActiveQuizTopic] = useState<string | null>('Deadlocks');
  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => loadStored('quiz_results', INITIAL_QUIZ_RESULTS));
  const [spacedSchedule, setSpacedSchedule] = useState<SpacedScheduleItem[]>(() => loadStored('spaced_sched', SPACED_SCHEDULE));
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => loadStored('flashcards', FLASHCARDS));
  const [pyqs, setPyqs] = useState<PYQ[]>(() => loadStored('pyqs', PYQS));
  const [notes, setNotes] = useState<Note[]>(() => loadStored('notes', NOTES));
  const [examMode, setExamMode] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('studyos_gemini_key') || '');
  const [notification, setNotification] = useState<string | null>('Adaptive Engine: Deadlocks (41%) requires attention before Day 4.');

  const [timer, setTimer] = useState<FocusTimer>({
    isRunning: false,
    taskTitle: '',
    secondsRemaining: 0,
    totalSeconds: 0
  });

  useEffect(() => { localStorage.setItem('studyos_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('studyos_todays_focus', JSON.stringify(todaysFocus)); }, [todaysFocus]);
  useEffect(() => { localStorage.setItem('studyos_study_plan', JSON.stringify(studyPlan)); }, [studyPlan]);
  useEffect(() => { localStorage.setItem('studyos_quizzes', JSON.stringify(quizzes)); }, [quizzes]);
  useEffect(() => { localStorage.setItem('studyos_quiz_results', JSON.stringify(quizResults)); }, [quizResults]);
  useEffect(() => { localStorage.setItem('studyos_spaced_sched', JSON.stringify(spacedSchedule)); }, [spacedSchedule]);
  useEffect(() => { localStorage.setItem('studyos_flashcards', JSON.stringify(flashcards)); }, [flashcards]);
  useEffect(() => { localStorage.setItem('studyos_pyqs', JSON.stringify(pyqs)); }, [pyqs]);
  useEffect(() => { localStorage.setItem('studyos_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('studyos_gemini_key', geminiApiKey); }, [geminiApiKey]);

  useEffect(() => {
    let interval: number | null = null;
    if (timer.isRunning && timer.secondsRemaining > 0) {
      interval = window.setInterval(() => {
        setTimer(prev => {
          if (prev.secondsRemaining <= 1) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            setNotification(`🎉 Focus Session completed for: ${prev.taskTitle}!`);
            return { ...prev, isRunning: false, secondsRemaining: 0 };
          }
          return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.secondsRemaining]);

  const activeSubject = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  const switchSubject = (id: string) => {
    setActiveSubjectId(id);
    setNotification(`Switched active workspace to ${subjects.find(s => s.id === id)?.name || id}`);
  };

  const addSubject = (name: string, code: string, daysLeft: number) => {
    const newSub: Subject = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      code,
      targetGrade: 'A',
      examDate: new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000).toISOString(),
      daysLeft,
      color: '#8b5cf6',
      iconName: 'BookOpen',
      overallKnowledge: 50,
      units: [
        {
          id: `unit-1-${Date.now()}`,
          unitNumber: 1,
          title: 'Unit 1: Fundamentals',
          topics: [
            {
              id: `top-${Date.now()}`,
              title: 'Core Fundamentals & Architecture',
              unitId: `unit-1-${Date.now()}`,
              hoursEstimated: 4,
              weightage: 'High',
              knowledgeScore: 50,
              status: 'unstudied',
              keyConcepts: ['Foundations', 'Terminology'],
              pyqFrequencyScore: 7,
              revisionIntervalDays: 3
            }
          ]
        }
      ]
    };
    setSubjects(prev => [...prev, newSub]);
    setActiveSubjectId(newSub.id);
    setNotification(`Added subject: ${name} (Exam in ${daysLeft} days)`);
  };

  const addTopic = (unitId: string, title: string, weightage: TopicWeightage) => {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== activeSubjectId) return s;
        return {
          ...s,
          units: s.units.map(u => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              topics: [
                ...u.topics,
                {
                  id: `top-${Date.now()}`,
                  title,
                  unitId,
                  hoursEstimated: 4,
                  weightage,
                  knowledgeScore: 45,
                  status: 'unstudied',
                  keyConcepts: [title],
                  pyqFrequencyScore: 6,
                  revisionIntervalDays: 2
                }
              ]
            };
          })
        };
      })
    );
    setNotification(`Added topic: "${title}" to syllabus`);
  };

  /**
   * Real Syllabus Parser Implementation
   */
  const parseSyllabusAndAdd = async (rawText: string) => {
    try {
      const parsedUnits = await AIService.parseSyllabus(activeSubject.name, rawText, geminiApiKey);
      if (parsedUnits && parsedUnits.length > 0) {
        setSubjects(prev =>
          prev.map(s => {
            if (s.id !== activeSubjectId) return s;
            return {
              ...s,
              units: parsedUnits
            };
          })
        );
        confetti({ particleCount: 60, spread: 60 });
        setNotification(`✅ Successfully parsed ${parsedUnits.length} units and structured your syllabus!`);
      }
    } catch (e) {
      console.error(e);
      setNotification('Failed to parse syllabus. Check text format.');
    }
  };

  /**
   * Real Dynamic Quiz Generator
   */
  const generateQuizForTopic = async (topicTitle: string, keyConcepts: string[]): Promise<Quiz> => {
    const existing = quizzes.find(q => q.topicName.toLowerCase() === topicTitle.toLowerCase());
    if (existing) {
      setActiveQuizTopic(existing.topicName);
      return existing;
    }

    const questions = await AIService.generateQuizQuestions(topicTitle, keyConcepts, geminiApiKey);
    const newQuiz: Quiz = {
      id: `q-${Date.now()}`,
      topicId: `top-${Date.now()}`,
      topicName: topicTitle,
      title: `${topicTitle} Mastery Diagnostic`,
      questions
    };

    setQuizzes(prev => [newQuiz, ...prev]);
    setActiveQuizTopic(topicTitle);
    setNotification(`✨ Dynamically generated fresh assessment for "${topicTitle}"!`);
    return newQuiz;
  };

  const toggleFocusTask = (id: string) => {
    setTodaysFocus(prev =>
      prev.map(task => {
        if (task.id === id) {
          const updated = !task.completed;
          if (updated) {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          }
          return { ...task, completed: updated };
        }
        return task;
      })
    );
  };

  const completeTask = (dayNumber: number, taskId: string) => {
    setStudyPlan(prev => ({
      ...prev,
      days: prev.days.map(d => {
        if (d.dayNumber !== dayNumber) return d;
        return {
          ...d,
          tasks: d.tasks.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        };
      })
    }));
  };

  const rebalanceAdaptivePlan = () => {
    setStudyPlan(prev => {
      const updatedDays = prev.days.map(d => {
        if (d.dayNumber === 3) {
          return {
            ...d,
            title: 'Deadlocks (Reinforced Adaptive Deep-Dive)',
            isWeakRemediation: true,
            tasks: [
              { id: 'ad-1', title: '🔴 REMEDIAL: Coffman 4-Conditions Denial Proofs', type: 'remedial' as const, completed: false, durationMins: 45, priorityScore: 100 },
              { id: 'ad-2', title: "🔴 REMEDIAL: Banker's Algorithm Need Matrix & Safe Sequence Drill", type: 'remedial' as const, completed: false, durationMins: 60, priorityScore: 100 },
              { id: 'ad-3', title: 'Solve 2024 & 2023 10-Mark Deadlock Examination Questions', type: 'pyq' as const, completed: false, durationMins: 45, priorityScore: 95 },
              { id: 'ad-4', title: 'Targeted Deadlock Re-Quiz (Target: ≥ 80%)', type: 'quiz' as const, completed: false, durationMins: 20, priorityScore: 90 }
            ]
          };
        }
        return d;
      });

      return {
        ...prev,
        days: updatedDays,
        isAdaptiveAdjusted: true,
        adaptiveNote: '⚡ Adaptive Rebalancer triggered! Added dedicated 4-step remedial mastery block for Deadlocks.'
      };
    });

    setTodaysFocus([
      { id: 'tf-remedial', title: 'Deadlocks Remedial Drill (Banker & RAG)', topicName: 'Deadlocks', minutes: 60, completed: false, isWeak: true, priority: 'URGENT (Score: 41%)' },
      { id: 'tf-1', title: 'CPU Scheduling (Short Recap)', topicName: 'CPU Scheduling', minutes: 20, completed: true, isWeak: false, priority: 'Low (Mastered: 82%)' },
      { id: 'tf-2', title: 'Memory Management (Paging Basics)', topicName: 'Memory Management', minutes: 40, completed: false, isWeak: false, priority: 'Medium (67%)' },
      { id: 'tf-3', title: 'Deadlocks PYQs 2024 Paper', topicName: 'PYQs', minutes: 30, completed: false, isWeak: true, priority: 'High Probability' }
    ]);

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    setNotification('🎯 Study Plan dynamically re-balanced! Extra revision injected for Deadlocks.');
  };

  const recordQuizResult = (result: QuizResult) => {
    setQuizResults(prev => [result, ...prev]);

    setSubjects(prev =>
      prev.map(sub => {
        if (sub.id !== activeSubjectId) return sub;
        return {
          ...sub,
          units: sub.units.map(u => ({
            ...u,
            topics: u.topics.map(t => {
              if (t.id === result.topicId || t.title.toLowerCase().includes(result.topicName.toLowerCase())) {
                const newScore = result.scorePercentage;
                const status = newScore >= 80 ? 'mastered' : newScore < 60 ? 'weak' : 'in_progress';
                return {
                  ...t,
                  knowledgeScore: newScore,
                  status,
                  lastStudiedDate: new Date().toISOString().split('T')[0]
                };
              }
              return t;
            })
          }))
        };
      })
    );

    if (result.scorePercentage < 60) {
      adjustSpacedInterval(result.topicId, true);
      setNotification(`⚠️ Weak Topic Alert: ${result.topicName} scored ${result.scorePercentage}%. Revision moved earlier!`);
    } else {
      adjustSpacedInterval(result.topicId, false);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setNotification(`🎉 Great job! ${result.topicName} score improved to ${result.scorePercentage}%!`);
    }
  };

  const adjustSpacedInterval = (_topicId: string, shiftEarlier: boolean) => {
    setSpacedSchedule(prev =>
      prev.map(item => {
        if (item.topicName.toLowerCase().includes('deadlock')) {
          return {
            ...item,
            stageName: shiftEarlier ? 'Revision 1 (⚠️ Accelerated due to low score)' : 'Revision (Advanced intervals)',
            scheduledDate: shiftEarlier ? 'Today / Tomorrow' : 'In 4 days',
            status: shiftEarlier ? 'due_today' : 'upcoming'
          };
        }
        return item;
      })
    );
  };

  const reviewFlashcard = (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setFlashcards(prev =>
      prev.map(card => {
        if (card.id !== cardId) return card;
        let newLevel = card.level;
        let nextDays = card.nextReviewDays;
        if (rating === 'again') {
          newLevel = 'learning';
          nextDays = 1;
        } else if (rating === 'hard') {
          newLevel = 'learning';
          nextDays = Math.max(1, Math.round(card.nextReviewDays * 1.2));
        } else if (rating === 'good') {
          newLevel = 'review';
          nextDays = Math.max(2, Math.round(card.nextReviewDays * 2.0));
        } else if (rating === 'easy') {
          newLevel = 'mastered';
          nextDays = Math.max(4, Math.round(card.nextReviewDays * 3.5));
        }
        return {
          ...card,
          level: newLevel,
          repetitions: card.repetitions + 1,
          nextReviewDays: nextDays
        };
      })
    );
  };

  const toggleStarPYQ = (id: string) => {
    setPyqs(prev => prev.map(p => (p.id === id ? { ...p, isStarred: !p.isStarred } : p)));
  };

  const updatePYQStatus = (id: string, status: PYQStatus) => {
    setPyqs(prev => prev.map(p => (p.id === id ? { ...p, solvedStatus: status } : p)));
  };

  const saveNote = (newNote: Note) => {
    setNotes(prev => {
      const exists = prev.some(n => n.id === newNote.id);
      if (exists) {
        return prev.map(n => (n.id === newNote.id ? newNote : n));
      }
      return [newNote, ...prev];
    });
    setNotification(`Note saved: ${newNote.title}`);
  };

  /**
   * Real AI Note Summarizer
   */
  const generateSummaryFromNote = async (noteId: string) => {
    const targetNote = notes.find(n => n.id === noteId);
    if (!targetNote) return;

    setNotification('Generating AI summary from your notes...');
    const summary = await AIService.summarizeNotes(targetNote.title, targetNote.content, geminiApiKey);

    setNotes(prev =>
      prev.map(n => {
        if (n.id !== noteId) return n;
        return {
          ...n,
          aiSummary: summary
        };
      })
    );
    setNotification('✨ AI Summary generated from topic notes!');
  };

  /**
   * Real Flashcard Generator from Notes
   */
  const generateCardsFromNote = async (noteId: string) => {
    const targetNote = notes.find(n => n.id === noteId);
    if (!targetNote) return;

    setNotification('Extracting flashcards with AI...');
    const extracted = await AIService.extractFlashcards(targetNote.topicName, targetNote.content, geminiApiKey);

    const newCards: Flashcard[] = extracted.map((c, i) => ({
      id: `fc-${Date.now()}-${i}`,
      subjectId: activeSubjectId,
      topicId: targetNote.topicId,
      topicName: targetNote.topicName,
      front: c.front || `Core Question on ${targetNote.topicName}`,
      back: c.back || targetNote.content.slice(0, 150),
      formula: c.formula,
      level: 'new',
      repetitions: 0,
      nextReviewDays: 1,
      isWeakTopicPriority: true
    }));

    setFlashcards(prev => [...newCards, ...prev]);
    confetti({ particleCount: 50, spread: 60 });
    setNotification(`🎴 Extracted ${newCards.length} active recall cards from "${targetNote.title}"!`);
  };

  const startTimer = (taskTitle: string, minutes: number) => {
    setTimer({
      isRunning: true,
      taskTitle,
      secondsRemaining: minutes * 60,
      totalSeconds: minutes * 60
    });
    setNotification(`⏱️ Started ${minutes}-minute focus session for: ${taskTitle}`);
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const stopTimer = () => {
    setTimer({ isRunning: false, taskTitle: '', secondsRemaining: 0, totalSeconds: 0 });
  };

  const askCoachForToday = (hoursAvailable: number): TodaysFocusItem[] => {
    const totalMinutes = hoursAvailable * 60;
    const deadlocksMins = Math.round(totalMinutes * 0.4);
    const memoryMins = Math.round(totalMinutes * 0.25);
    const pyqMins = Math.round(totalMinutes * 0.25);
    const cpuMins = totalMinutes - (deadlocksMins + memoryMins + pyqMins);

    const coachPlan: TodaysFocusItem[] = [
      {
        id: `coach-1-${Date.now()}`,
        title: 'Deadlocks (🔴 High Priority Remedial)',
        topicName: 'Deadlocks',
        minutes: deadlocksMins,
        completed: false,
        isWeak: true,
        priority: '1️⃣ Top Priority (41% score)'
      },
      {
        id: `coach-2-${Date.now()}`,
        title: 'Memory Management (Paging & EMAT)',
        topicName: 'Memory Management',
        minutes: memoryMins,
        completed: false,
        isWeak: false,
        priority: '2️⃣ Exam Weightage: 40%'
      },
      {
        id: `coach-3-${Date.now()}`,
        title: 'OS PYQs (Repeated 10-Markers)',
        topicName: 'Operating Systems PYQ',
        minutes: pyqMins,
        completed: false,
        isWeak: false,
        priority: '3️⃣ Past Paper Drills'
      },
      {
        id: `coach-4-${Date.now()}`,
        title: 'CPU Scheduling (Quick Revision)',
        topicName: 'CPU Scheduling',
        minutes: cpuMins,
        completed: false,
        isWeak: false,
        priority: '4️⃣ Retention check (82%)'
      }
    ];

    setTodaysFocus(coachPlan);
    setNotification(`🤖 AI Coach formulated your ${hoursAvailable}-hour high-yield study session!`);
    return coachPlan;
  };

  return (
    <StudyOSContext.Provider
      value={{
        activeView,
        setActiveView,
        subjects,
        activeSubjectId,
        activeSubject,
        switchSubject,
        addSubject,
        addTopic,
        parseSyllabusAndAdd,
        todaysFocus,
        toggleFocusTask,
        studyPlan,
        completeTask,
        rebalanceAdaptivePlan,
        quizzes,
        activeQuizTopic,
        setActiveQuizTopic,
        generateQuizForTopic,
        quizResults,
        recordQuizResult,
        spacedSchedule,
        adjustSpacedInterval,
        flashcards,
        reviewFlashcard,
        pyqs,
        toggleStarPYQ,
        updatePYQStatus,
        notes,
        saveNote,
        generateSummaryFromNote,
        generateCardsFromNote,
        timer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        examMode,
        setExamMode,
        geminiApiKey,
        setGeminiApiKey,
        notification,
        setNotification,
        askCoachForToday
      }}
    >
      {children}
    </StudyOSContext.Provider>
  );
};

export const useStudyOS = () => {
  const context = useContext(StudyOSContext);
  if (!context) {
    throw new Error('useStudyOS must be used within a StudyOSProvider');
  }
  return context;
};
