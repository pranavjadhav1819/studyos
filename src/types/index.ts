export type TopicWeightage = 'High' | 'Medium' | 'Low';
export type TopicStatus = 'unstudied' | 'in_progress' | 'mastered' | 'weak';

export interface Topic {
  id: string;
  title: string;
  unitId: string;
  hoursEstimated: number;
  weightage: TopicWeightage;
  knowledgeScore: number; // 0 - 100%
  status: TopicStatus;
  keyConcepts: string[];
  pyqFrequencyScore: number; // 1 - 10
  lastStudiedDate?: string;
  nextRevisionDate?: string;
  revisionIntervalDays: number;
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  targetGrade: string;
  examDate: string;
  daysLeft: number;
  color: string;
  iconName: string;
  overallKnowledge: number;
  units: Unit[];
}

export type TaskType = 'concept' | 'pyq' | 'quiz' | 'revision' | 'remedial';

export interface StudyTask {
  id: string;
  title: string;
  type: TaskType;
  completed: boolean;
  topicId?: string;
  durationMins: number;
  priorityScore: number; // calculated: Weakness * Weightage * TimePressure
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  dateStr: string;
  focusTopics: string[];
  tasks: StudyTask[];
  isRevisionOrPYQ: boolean;
  isWeakRemediation?: boolean;
}

export interface StudyPlan {
  id: string;
  subjectId: string;
  daysCount: number;
  targetHoursPerDay: number;
  days: DayPlan[];
  isAdaptiveAdjusted: boolean;
  adaptiveNote?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  conceptTag: string;
  explanation: string;
  yearAppeared?: string;
}

export interface Quiz {
  id: string;
  topicId: string;
  topicName: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizConceptAnalysis {
  concept: string;
  passed: boolean;
}

export interface QuizResult {
  id: string;
  quizId: string;
  topicId: string;
  topicName: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  date: string;
  isWeak: boolean;
  weakConcepts: string[];
  strongConcepts: string[];
}

export interface SpacedScheduleItem {
  id: string;
  topicId: string;
  topicName: string;
  stageName: string; // e.g. "Learned", "Revision 1", "Revision 2"
  scheduledDate: string;
  status: 'completed' | 'due_today' | 'upcoming';
  lastScore?: number;
}

export type PYQDifficulty = 'Easy' | 'Medium' | 'Hard';
export type PYQStatus = 'unsolved' | 'attempted' | 'mastered';

export interface PYQ {
  id: string;
  subjectId: string;
  topicId: string;
  topicName: string;
  year: number;
  examType: string;
  marks: number;
  repeatedTimes: number;
  questionText: string;
  modelAnswer: string;
  keyPoints: string[];
  difficulty: PYQDifficulty;
  solvedStatus: PYQStatus;
  isStarred: boolean;
}

export type FlashcardMastery = 'new' | 'learning' | 'review' | 'mastered';

export interface Flashcard {
  id: string;
  subjectId: string;
  topicId: string;
  topicName: string;
  front: string;
  back: string;
  formula?: string;
  level: FlashcardMastery;
  repetitions: number;
  nextReviewDays: number;
  isWeakTopicPriority: boolean;
}

export interface FormulaItem {
  name: string;
  formula: string;
  note: string;
}

export interface Note {
  id: string;
  subjectId: string;
  topicId: string;
  topicName: string;
  title: string;
  content: string;
  aiSummary?: string;
  formulas: FormulaItem[];
  updatedAt: string;
  tags: string[];
}

export type DoubtMode = 'eli5' | 'exam' | 'formulas';

export interface DoubtMessage {
  id: string;
  role: 'user' | 'assistant';
  simpleExplanation: string;
  example: string;
  rememberRule: string;
  examTip: string;
  relatedTopicId?: string;
  timestamp: string;
}

export interface DayStudyTime {
  day: string;
  hours: number;
}

export interface SubjectBenchmark {
  name: string;
  score: number;
  isWeak: boolean;
}

export type ExamPrepPhase = 'learning' | 'consolidation' | 'revision_pyq' | 'exam_mode';
