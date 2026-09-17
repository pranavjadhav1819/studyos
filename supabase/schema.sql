-- ================================================================
-- Study.AI — Production Supabase PostgreSQL Database Schema
-- Run this script in your Supabase Project's SQL Editor (supabase.com/dashboard)
-- ================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    target_grade TEXT DEFAULT 'A',
    exam_date TIMESTAMPTZ,
    days_left INTEGER DEFAULT 30,
    color TEXT DEFAULT '#8b5cf6',
    icon_name TEXT DEFAULT 'BookOpen',
    overall_knowledge INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Units Table (Curriculum hierarchy)
CREATE TABLE IF NOT EXISTS public.units (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Topics Table (Granular mastery tracking)
CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    hours_estimated NUMERIC DEFAULT 4.0,
    weightage TEXT DEFAULT 'High' CHECK (weightage IN ('High', 'Medium', 'Low')),
    knowledge_score INTEGER DEFAULT 50,
    status TEXT DEFAULT 'unstudied' CHECK (status IN ('unstudied', 'in_progress', 'mastered', 'weak')),
    key_concepts JSONB DEFAULT '[]'::jsonb,
    pyq_frequency_score INTEGER DEFAULT 5,
    last_studied_date DATE,
    next_revision_date DATE,
    revision_interval_days INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Study Plans Table
CREATE TABLE IF NOT EXISTS public.study_plans (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    days_count INTEGER NOT NULL,
    target_hours_per_day NUMERIC DEFAULT 4.0,
    days JSONB NOT NULL,
    is_adaptive_adjusted BOOLEAN DEFAULT FALSE,
    adaptive_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Quiz Results Table
CREATE TABLE IF NOT EXISTS public.quiz_results (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL,
    topic_id TEXT,
    topic_name TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    score_percentage INTEGER NOT NULL,
    date TEXT NOT NULL,
    is_weak BOOLEAN DEFAULT FALSE,
    weak_concepts JSONB DEFAULT '[]'::jsonb,
    strong_concepts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Flashcards Table (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.flashcards (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic_id TEXT,
    topic_name TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    formula TEXT,
    level TEXT DEFAULT 'new' CHECK (level IN ('new', 'learning', 'review', 'mastered')),
    repetitions INTEGER DEFAULT 0,
    next_review_days INTEGER DEFAULT 1,
    is_weak_topic_priority BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Notes Table
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic_id TEXT,
    topic_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    ai_summary TEXT,
    formulas JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- Indexes for Performance
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_units_subject ON public.units(subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_unit ON public.topics(unit_id);
CREATE INDEX IF NOT EXISTS idx_topics_status ON public.topics(status);
CREATE INDEX IF NOT EXISTS idx_flashcards_topic ON public.flashcards(topic_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject_id);

-- ================================================================
-- Row Level Security (RLS) Configuration
-- Allows public access for client testing, or auth-scoped access
-- ================================================================
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read & write for frontend demo/production
CREATE POLICY "Allow public read/write on subjects" ON public.subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on units" ON public.units FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on topics" ON public.topics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on study_plans" ON public.study_plans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on quiz_results" ON public.quiz_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on flashcards" ON public.flashcards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on notes" ON public.notes FOR ALL USING (true) WITH CHECK (true);
