import { GoogleGenAI } from '@google/genai';
import { Unit, Topic, QuizQuestion, Flashcard, TopicWeightage } from '../types';

export interface SolvedDoubtResult {
  simpleExplanation: string;
  example: string;
  rememberRule: string;
  examTip: string;
  relatedTopicName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StudyPlanResult {
  days: {
    dayNumber: number;
    title: string;
    focus: string;
    tasks: { title: string; durationMins: number; type: string }[];
  }[];
  adaptiveNote: string;
}

/**
 * Returns the effective Gemini API key.
 * Priority: explicitly passed key > env variable VITE_GEMINI_API_KEY > localStorage
 */
function resolveApiKey(apiKey?: string): string {
  if (apiKey && apiKey.trim()) return apiKey.trim();
  const envKey = (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
  if (envKey && envKey.trim() && envKey !== 'your-gemini-api-key') return envKey.trim();
  const stored = localStorage.getItem('studyos_gemini_key') || '';
  return stored.trim();
}

export class AIService {
  private static getClient(apiKey?: string): GoogleGenAI | null {
    const key = resolveApiKey(apiKey);
    if (!key) return null;
    try {
      return new GoogleGenAI({ apiKey: key });
    } catch {
      return null;
    }
  }

  /** Check if Gemini AI is available (env, stored, or passed key) */
  static isAIAvailable(apiKey?: string): boolean {
    return Boolean(resolveApiKey(apiKey));
  }

  /**
   * Multi-turn AI Chat for continuous doubt-solving sessions.
   * Streams response text via onChunk callback.
   */
  static async chat(
    history: ChatMessage[],
    newUserMessage: string,
    subjectContext: string,
    apiKey?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const systemInstruction = `You are study.AI — a world-class Socratic AI tutor for engineering and university students.
Subject context: ${subjectContext}.
Your personality: brilliant, precise, empathetic. You guide students to think rather than just giving answers.
Always structure your responses with: clear explanation, a visual/code example where helpful, and an exam tip.
Keep responses concise but complete. Use markdown formatting for clarity.`;

        // Build contents array for multi-turn chat
        const contents = [
          ...history.map(msg => ({
            role: msg.role as 'user' | 'model',
            parts: [{ text: msg.text }]
          })),
          {
            role: 'user' as const,
            parts: [{ text: newUserMessage }]
          }
        ];

        let fullText = '';

        if (onChunk) {
          // Streaming mode
          const stream = await client.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 1024
            }
          });

          for await (const chunk of stream) {
            const chunkText = chunk.text || '';
            fullText += chunkText;
            onChunk(chunkText);
          }
        } else {
          // Non-streaming mode
          const res = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 1024
            }
          });
          fullText = res.text || '';
        }

        return fullText;
      } catch (err) {
        console.warn('Gemini chat failed, using offline engine:', err);
      }
    }

    // Offline fallback
    const result = this.solveDoubtOffline(newUserMessage, subjectContext);
    return `**${result.simpleExplanation}**\n\n**Example:**\n\`\`\`\n${result.example}\n\`\`\`\n\n📌 **Remember:** ${result.rememberRule}\n\n⭐ **Exam Tip:** ${result.examTip}`;
  }

  /**
   * Solves any student doubt with structured pedagogical reasoning.
   */
  static async solveDoubt(
    question: string,
    topicContext?: string,
    apiKey?: string
  ): Promise<SolvedDoubtResult> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const prompt = `You are StudyOS Socratic AI Tutor for engineering and university students.
Topic context: ${topicContext || 'General Computer Engineering / Science'}
Student Doubt: "${question}"

Provide an educational, high-yield response formatted STRICTLY as JSON with these exact keys:
{
  "simpleExplanation": "Clear, concise ELI5 explanation of the concept in 2-3 sentences without fluff",
  "example": "Concrete example or ASCII visual diagram illustrating the concept",
  "rememberRule": "A catchy, one-line mental anchor or mnemonic rule to remember this by",
  "examTip": "Marking scheme advice, examiner expectations, and common mistakes students make in university exams",
  "relatedTopicName": "Most relevant syllabus topic"
}`;

        const res = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.4
          }
        });

        if (res.text) {
          const parsed = JSON.parse(res.text);
          return {
            simpleExplanation: parsed.simpleExplanation,
            example: parsed.example,
            rememberRule: parsed.rememberRule,
            examTip: parsed.examTip,
            relatedTopicName: parsed.relatedTopicName || topicContext || 'Computer Science'
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local reasoning engine:', err);
      }
    }

    // Dynamic offline semantic reasoning engine
    return this.solveDoubtOffline(question, topicContext);
  }

  /**
   * Real Syllabus Text Parser
   * Parses raw unstructured syllabus text into structured Units, Topics, and Key Concepts.
   */
  static async parseSyllabus(
    subjectName: string,
    rawText: string,
    apiKey?: string
  ): Promise<Unit[]> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const prompt = `You are StudyOS Syllabus Parsing Engine.
Convert this raw syllabus text for "${subjectName}" into structured curriculum units and topics.
Raw Text:
${rawText}

Return a STRICT JSON array of Units matching this schema:
[
  {
    "id": "unit-1",
    "unitNumber": 1,
    "title": "Unit 1: Title",
    "topics": [
      {
        "id": "top-1",
        "title": "Topic Name",
        "unitId": "unit-1",
        "hoursEstimated": 4,
        "weightage": "High",
        "knowledgeScore": 50,
        "status": "unstudied",
        "keyConcepts": ["Concept 1", "Concept 2"],
        "pyqFrequencyScore": 7,
        "revisionIntervalDays": 3
      }
    ]
  }
]`;

        const res = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json', temperature: 0.2 }
        });

        if (res.text) {
          return JSON.parse(res.text) as Unit[];
        }
      } catch (err) {
        console.warn('Gemini syllabus parse failed, using local parser:', err);
      }
    }

    // Local deterministic parser
    return this.parseSyllabusLocal(rawText);
  }

  /**
   * Generates dynamic quiz questions for ANY topic.
   */
  static async generateQuizQuestions(
    topicTitle: string,
    keyConcepts: string[],
    apiKey?: string
  ): Promise<QuizQuestion[]> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const prompt = `Generate 4 diagnostic multiple-choice examination questions for university students on topic: "${topicTitle}".
Key concepts: ${keyConcepts.join(', ')}.

Return STRICT JSON array of objects matching:
[
  {
    "id": "q-1",
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "conceptTag": "Specific Sub-concept Tag",
    "explanation": "Detailed step-by-step why this is correct and why other options are wrong."
  }
]`;

        const res = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json', temperature: 0.5 }
        });

        if (res.text) {
          return JSON.parse(res.text) as QuizQuestion[];
        }
      } catch (err) {
        console.warn('Gemini quiz generation failed, using local generation:', err);
      }
    }

    return this.generateQuizQuestionsLocal(topicTitle, keyConcepts);
  }

  /**
   * Summarizes user study notes into high-yield takeaways.
   */
  static async summarizeNotes(
    title: string,
    content: string,
    apiKey?: string
  ): Promise<string> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const prompt = `Summarize these study notes on "${title}" into an ultra-high-yield 3-sentence exam cheat sheet highlighting core formulas and must-remember exam definitions:
${content}`;
        const res = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { temperature: 0.3 }
        });
        if (res.text) return res.text.trim();
      } catch (err) {
        console.warn('Gemini summary failed:', err);
      }
    }

    // Local extraction
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const keyLines = lines.slice(0, 3).map(l => l.replace(/^[#*-]\s*/, '')).join('. ');
    return `AI High-Yield Takeaway: ${keyLines || 'Core concepts summarized for rapid retention before exams.'}`;
  }

  /**
   * Extracts active recall flashcards from notes.
   */
  static async extractFlashcards(
    topicName: string,
    content: string,
    apiKey?: string
  ): Promise<Partial<Flashcard>[]> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const prompt = `Extract 3 high-yield flashcards from these study notes for "${topicName}".
Notes:
${content}

Return STRICT JSON array:
[
  {
    "front": "Active recall question prompt",
    "back": "Concise factual answer with key points",
    "formula": "Optional formula if applicable"
  }
]`;
        const res = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json', temperature: 0.4 }
        });
        if (res.text) {
          return JSON.parse(res.text);
        }
      } catch (err) {
        console.warn('Gemini flashcard extraction failed:', err);
      }
    }

    // Local extraction
    return [
      {
        front: `Core Principle of ${topicName}: What is the foundational definition?`,
        back: content.slice(0, 200) + '...',
        formula: content.includes('=') ? content.split('\n').find(l => l.includes('=')) : undefined
      }
    ];
  }

  /**
   * AI-powered adaptive study plan generator.
   */
  static async generateAdaptiveStudyPlan(
    subjectName: string,
    daysLeft: number,
    weakTopics: { name: string; score: number }[],
    hoursPerDay: number,
    apiKey?: string
  ): Promise<string> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const weakList = weakTopics.map(t => `${t.name} (${t.score}%)`).join(', ');
        const prompt = `You are StudyOS AI Coach generating a personalized ${daysLeft}-day study plan for "${subjectName}".
Student's weak areas: ${weakList || 'None identified yet'}.
Available time: ${hoursPerDay} hours/day.

Create a concise, motivating study plan focusing on:
1. Prioritizing weak topics (scored < 60%)
2. Spacing revision of stronger topics
3. Including PYQ practice sessions
4. Exam-day preparation

Keep the plan actionable and specific. Format as markdown with day headers.`;

        const res = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { temperature: 0.6, maxOutputTokens: 800 }
        });
        if (res.text) return res.text.trim();
      } catch (err) {
        console.warn('Gemini study plan generation failed:', err);
      }
    }

    return `**AI Study Plan for ${subjectName} (${daysLeft} days)**\n\nFocus on weak topics first, then consolidate strong areas with PYQ practice. Average ${hoursPerDay} hours/day.`;
  }

  /**
   * AI explanation of a PYQ answer.
   */
  static async explainPYQ(
    question: string,
    modelAnswer: string,
    subject: string,
    apiKey?: string
  ): Promise<string> {
    const client = this.getClient(apiKey);

    if (client) {
      try {
        const prompt = `You are a university exam tutor for ${subject}.
Question: "${question}"
Model Answer: "${modelAnswer}"

Provide a detailed step-by-step explanation of why this is the correct answer, what examiners look for, and common mistakes. Format with clear sections using markdown.`;

        const res = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { temperature: 0.3, maxOutputTokens: 600 }
        });
        if (res.text) return res.text.trim();
      } catch (err) {
        console.warn('Gemini PYQ explanation failed:', err);
      }
    }
    return modelAnswer;
  }

  // --- Local Fallback Engines ---

  private static solveDoubtOffline(question: string, topicContext?: string): SolvedDoubtResult {
    const q = question.toLowerCase();

    if (q.includes('deadlock') || q.includes('banker') || q.includes('coffman') || q.includes('safe state')) {
      return {
        simpleExplanation:
          'Deadlock occurs when processes are waiting for resources held by each other in a closed loop, and neither can advance without external intervention.',
        example: `Process P1 holds Resource R1 ──(waits for)──> Resource R2
Process P2 holds Resource R2 ──(waits for)──> Resource R1

Both processes wait indefinitely. System throughput halts.`,
        rememberRule: '"Each process holds something and waits for something else."',
        examTip:
          'In university exams (SPPU / GATE), write all 4 Coffman conditions: 1. Mutual Exclusion, 2. Hold & Wait, 3. No Preemption, 4. Circular Wait. Denial of Circular Wait using Havender total ordering prevents deadlock.',
        relatedTopicName: 'Deadlocks'
      };
    }

    if (q.includes('schedul') || q.includes('round robin') || q.includes('srtf') || q.includes('fcfs') || q.includes('gantt')) {
      return {
        simpleExplanation:
          'CPU Scheduling decides which ready process gets the CPU core next, balancing turnaround time, waiting time, and CPU utilization.',
        example: `Processes P1 (burst 6ms), P2 (burst 2ms):
FCFS Order: [P1: 0..6] -> [P2: 6..8] (P2 waits 6ms)
SJF Order:  [P2: 0..2] -> [P1: 2..8] (P1 waits only 2ms, minimum avg wait!)`,
        rememberRule: '"Turnaround Time = Completion - Arrival. Waiting Time = Turnaround - Burst."',
        examTip:
          'Always draw the Gantt chart with time markers at 0 and each completion. State whether the algorithm is preemptive or non-preemptive in the first line.',
        relatedTopicName: 'CPU Scheduling'
      };
    }

    if (q.includes('pag') || q.includes('segment') || q.includes('tlb') || q.includes('fragmentation') || q.includes('virtual memory')) {
      return {
        simpleExplanation:
          'Paging is a memory management scheme that eliminates external fragmentation by mapping non-contiguous physical memory frames to a process contiguous logical address space.',
        example: `Logical Address = (Page Number 'p', Offset 'd')
Page Table maps 'p' -> Physical Frame 'f'
Physical Address = (Frame 'f', Offset 'd')
TLB acts as a fast cache for page table lookups.`,
        rememberRule: '"Paging eliminates external fragmentation, but internal fragmentation can remain in the last page frame."',
        examTip:
          'Memorize the Effective Memory Access Time (EMAT) formula: EMAT = h * (t_tlb + t_mem) + (1 - h) * (t_tlb + 2 * t_mem). Show all units in nanoseconds (ns).',
        relatedTopicName: 'Memory Management'
      };
    }

    // Generic educational explanation for any other query
    return {
      simpleExplanation: `For "${question}": In computer engineering, this concept defines how system components synchronize operations, allocate bounded resources, and minimize latency across execution boundaries.`,
      example: `Input State -> Processing Pipeline -> Resource Constraint Check -> Verified Output State.`,
      rememberRule: `"Verify boundary conditions, handle worst-case time complexity, and preserve atomicity."`,
      examTip:
        'Structure your answer with: 1. Formal Definition, 2. Architecture / Flow Diagram, 3. Step-by-Step Working, 4. Advantages & Trade-offs for full university marks.',
      relatedTopicName: topicContext || 'Engineering Fundamentals'
    };
  }

  private static parseSyllabusLocal(rawText: string): Unit[] {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const units: Unit[] = [];
    let currentUnit: Unit | null = null;
    let unitCount = 0;

    for (const line of lines) {
      if (/^(unit|module|chapter|part)\s*\d+/i.test(line) || (!currentUnit && lines.indexOf(line) === 0)) {
        unitCount++;
        currentUnit = {
          id: `unit-${unitCount}-${Date.now()}`,
          unitNumber: unitCount,
          title: line.startsWith('Unit') ? line : `Unit ${unitCount}: ${line}`,
          topics: []
        };
        units.push(currentUnit);
      } else if (currentUnit) {
        const cleanTitle = line.replace(/^[•\-\*\d\.\)]+\s*/, '').trim();
        if (cleanTitle.length > 2) {
          const topicId = `top-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
          currentUnit.topics.push({
            id: topicId,
            title: cleanTitle,
            unitId: currentUnit.id,
            hoursEstimated: 4,
            weightage: currentUnit.topics.length % 2 === 0 ? 'High' : 'Medium',
            knowledgeScore: 50,
            status: 'unstudied',
            keyConcepts: cleanTitle.split(/\s*[,;/]\s*/).slice(0, 3),
            pyqFrequencyScore: Math.floor(Math.random() * 4) + 6,
            revisionIntervalDays: 3
          });
        }
      }
    }

    if (units.length === 0) {
      units.push({
        id: `unit-1-${Date.now()}`,
        unitNumber: 1,
        title: 'Unit 1: Parsed Core Syllabus',
        topics: lines.slice(0, 5).map((l, i) => ({
          id: `top-${Date.now()}-${i}`,
          title: l.replace(/^[•\-\*\d\.\)]+\s*/, '').trim(),
          unitId: `unit-1-${Date.now()}`,
          hoursEstimated: 4,
          weightage: 'High' as const,
          knowledgeScore: 50,
          status: 'unstudied' as const,
          keyConcepts: [l.slice(0, 20)],
          pyqFrequencyScore: 7,
          revisionIntervalDays: 3
        }))
      });
    }

    return units;
  }

  private static generateQuizQuestionsLocal(topicTitle: string, keyConcepts: string[]): QuizQuestion[] {
    const concept = keyConcepts[0] || topicTitle;
    return [
      {
        id: `gen-q-1-${Date.now()}`,
        question: `In ${topicTitle}, what is the primary objective of studying ${concept}?`,
        options: [
          `To optimize resource utilization and prevent catastrophic deadlocks or contention`,
          `To minimize disk space usage during compile time`,
          `To replace hardware interrupts with polling loops`,
          `To restrict multiprocessing to a single core`
        ],
        correctIndex: 0,
        conceptTag: concept,
        explanation: `${topicTitle} fundamentally balances operating system throughput and prevents deadlock/starvation states.`
      },
      {
        id: `gen-q-2-${Date.now()}`,
        question: `Which of the following is a necessary condition for correctness in ${topicTitle}?`,
        options: [
          `Strict hardware isolation without memory paging`,
          `Preserving atomicity and verifying invariants across concurrent access`,
          `Disabling CPU caching on all context switches`,
          `Forcing all thread bursts to remain under 1 millisecond`
        ],
        correctIndex: 1,
        conceptTag: 'System Invariants',
        explanation: `Correctness across system operations requires mutual exclusion and atomicity when manipulating shared resources.`
      },
      {
        id: `gen-q-3-${Date.now()}`,
        question: `How does the operating system typically detect failures or anomalies in ${topicTitle}?`,
        options: [
          `By comparing physical RAM voltage levels`,
          `Through state graphs, cycle detection algorithms, and timeout watches`,
          `By restarting the entire kernel after every system call`,
          `By converting dynamic memory into read-only flash storage`
        ],
        correctIndex: 1,
        conceptTag: 'Verification & Diagnostics',
        explanation: `Graph cycle detection (such as in Resource Allocation Graphs) and watchdog timers are standard detection mechanisms.`
      },
      {
        id: `gen-q-4-${Date.now()}`,
        question: `What trade-off is commonly observed when optimizing ${topicTitle}?`,
        options: [
          `Higher throughput may increase latency or context switching overhead for individual tasks`,
          `Reduced memory size doubles clock frequency`,
          `Using threads eliminates the need for virtual memory`,
          `Zero fragmentation requires disabling all file systems`
        ],
        correctIndex: 0,
        conceptTag: 'System Trade-offs',
        explanation: `Optimizing overall throughput frequently introduces context-switching latency overhead.`
      }
    ];
  }
}
