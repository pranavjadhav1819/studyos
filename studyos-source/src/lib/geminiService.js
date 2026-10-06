/**
 * Google Gemini AI Service for ADHD-Friendly StudyOS
 * Uses Gemini 2.5 Flash for ultra-fast, low-latency responses.
 */

const DEFAULT_KEY =
  (import.meta.env?.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'your-gemini-api-key')
    ? import.meta.env.VITE_GEMINI_API_KEY
    : '';

export function getGeminiKey() {
  const custom = localStorage.getItem('studyos_gemini_key');
  if (custom && custom.trim()) return custom.trim();
  return DEFAULT_KEY;
}

export function setGeminiKey(key) {
  if (key) localStorage.setItem('studyos_gemini_key', key.trim());
  else localStorage.removeItem('studyos_gemini_key');
}

/**
 * Direct call to Gemini REST API without heavy SDK overhead
 */
async function callGemini(prompt, systemInstruction = '', jsonMode = false) {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('Gemini API key is not configured.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini request failed: ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}

/**
 * ⚡ ADHD Task Paralysis Breaker ("Unstick Me!")
 * Takes an overwhelming topic/task and breaks it into 3 tiny, ultra-low-friction micro-steps.
 */
export async function breakDownTask(topicName) {
  const prompt = `A student with ADHD is experiencing severe task paralysis and procrastination around studying this topic: "${topicName}".
Break this down into EXACTLY 3 microscopic, ridiculously easy steps to get them started right now without feeling overwhelmed.
Step 1 MUST be under 3 minutes and practically effortless (e.g. read 1 sentence, open notes, write 1 title).
Step 2 should take 5-7 minutes.
Step 3 should take 5 minutes to test knowledge or summarize.

Return STRICT JSON matching this exact structure:
{
  "topic": "${topicName}",
  "dopamineHook": "A witty, encouraging, validating 1-sentence pep talk for an ADHD brain",
  "steps": [
    { "stepNumber": 1, "title": "Micro-Step 1 Title", "description": "What to do right now in 2-3 mins", "durationMins": 3 },
    { "stepNumber": 2, "title": "Micro-Step 2 Title", "description": "Next tiny action in 5-7 mins", "durationMins": 7 },
    { "stepNumber": 3, "title": "Micro-Step 3 Title", "description": "Quick victory check in 5 mins", "durationMins": 5 }
  ],
  "rewardTip": "A small dopamine reward idea for when they finish step 3"
}`;

  try {
    const text = await callGemini(
      prompt,
      'You are a specialized ADHD academic coach. You break overwhelming study tasks into bite-sized momentum-builders.',
      true
    );
    return JSON.parse(text);
  } catch (err) {
    console.warn('Gemini breakdown failed, using smart offline fallback:', err);
    return {
      topic: topicName,
      dopamineHook: "The hardest part is just opening the page. Once you start, your brain's natural momentum will kick in!",
      steps: [
        {
          stepNumber: 1,
          title: `Glance at ${topicName} (2 Minutes)`,
          description: `Just open your notes or textbook and find the first header. Read only the first definition. No pressure to memorize!`,
          durationMins: 3,
        },
        {
          stepNumber: 2,
          title: 'Doodle or Write 1 Core Concept (5 Minutes)',
          description: `Jot down the single most important term, equation, or draw a 30-second stick diagram of how it works.`,
          durationMins: 5,
        },
        {
          stepNumber: 3,
          title: 'Explain It to an Imaginary 5-Year-Old (5 Minutes)',
          description: `Say out loud in plain English: "This thing basically just does X because Y." You are done with today's hurdle!`,
          durationMins: 5,
        },
      ],
      rewardTip: 'Grab a cold drink, stretch, and check off your first victory!',
    };
  }
}

/**
 * 🧠 ADHD Socratic Doubt Solver
 * Answers concisely with:
 * 1. ELI5 simple explanation (max 2 sentences)
 * 2. Visual ASCII / code diagram
 * 3. Sticky 1-line mnemonic rule
 * 4. Exam tip
 */
export async function solveDoubtADHD(question, topicContext = '') {
  const prompt = `Student with ADHD asked: "${question}"
Topic Context: ${topicContext || 'General Engineering / Science'}

Provide an ultra-clear, low-cognitive-load response formatted STRICTLY as JSON with these keys:
{
  "simpleExplanation": "Concise ELI5 explanation in 2 short sentences max. Zero fluff or jargon.",
  "asciiDiagram": "A simple 3-5 line ASCII diagram or visual flow to cement the concept visually",
  "mnemonic": "A catchy, funny, or vivid 1-line memory hook to never forget this",
  "examTip": "1 essential point examiners award marks for in university tests"
}`;

  try {
    const text = await callGemini(
      prompt,
      'You are an ADHD-friendly academic tutor. You avoid dense text walls, emphasize visuals and mnemonics.',
      true
    );
    return JSON.parse(text);
  } catch (err) {
    console.warn('Gemini doubt solve failed, using smart offline fallback:', err);
    return {
      simpleExplanation: `For "${question}": Think of it as a state where tasks need shared resources and must follow a clean sequence to prevent chaos or blockages.`,
      asciiDiagram: `[Input Request] ──► [Check Resource Safe?] ──► [Grant & Execute]\n                          └──(If Unsafe)──► [Queue / Wait]`,
      mnemonic: '"Hold what you need, release when you leave, never circular wait."',
      examTip: 'Define all necessary conditions first and always draw a state diagram for full marks.',
    };
  }
}

/**
 * 📝 ADHD High-Yield Note Summarizer
 * Turns messy notes into crisp bullet points with bold anchor words.
 */
export async function summarizeForADHD(title, rawContent) {
  const prompt = `Summarize these study notes for "${title}" specifically for a student with ADHD who gets overwhelmed by dense paragraphs.
Use bold anchor keywords at the start of bullets, keep items under 15 words each, and include a "Must-Remember Formula/Rule" at the end.
Notes:
${rawContent}`;

  try {
    const text = await callGemini(
      prompt,
      'You are an ADHD notes editor. You turn walls of text into high-contrast, easily scannable bullet points.'
    );
    return text.trim();
  } catch (err) {
    const lines = rawContent.split('\n').filter((l) => l.trim().length > 0);
    return (
      `**Core Takeaway:** ${title}\n` +
      lines
        .slice(0, 4)
        .map((l) => `• **Key Point:** ${l.replace(/^[#*-]\s*/, '')}`)
        .join('\n')
    );
  }
}
