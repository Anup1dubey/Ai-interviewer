-- ============================================================
-- AI Recruiter - Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE
-- Synced from Supabase Auth via trigger
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INTERVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  description TEXT,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration INTEGER NOT NULL DEFAULT 30,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('technical', 'behavioral', 'mixed')),
  questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can CRUD own interviews"
  ON public.interviews FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read interviews by id"
  ON public.interviews FOR SELECT
  USING (true);

-- ============================================================
-- INTERVIEW SESSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
  recommendation TEXT CHECK (recommendation IN ('hire', 'consider', 'reject')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create sessions"
  ON public.interview_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session"
  ON public.interview_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can read sessions"
  ON public.interview_sessions FOR SELECT
  USING (true);

-- ============================================================
-- INTERVIEW MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.interview_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('assistant', 'user')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.interview_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
  ON public.interview_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read messages"
  ON public.interview_messages FOR SELECT
  USING (true);

-- ============================================================
-- FEEDBACK TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  technical_score INTEGER NOT NULL DEFAULT 0 CHECK (technical_score BETWEEN 0 AND 100),
  communication_score INTEGER NOT NULL DEFAULT 0 CHECK (communication_score BETWEEN 0 AND 100),
  confidence_score INTEGER NOT NULL DEFAULT 0 CHECK (confidence_score BETWEEN 0 AND 100),
  problem_solving_score INTEGER NOT NULL DEFAULT 0 CHECK (problem_solving_score BETWEEN 0 AND 100),
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  summary TEXT,
  recommendation TEXT CHECK (recommendation IN ('hire', 'consider', 'reject')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read feedback"
  ON public.feedback FOR SELECT
  USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_interview_id ON public.interview_sessions(interview_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON public.interview_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_session_id ON public.feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON public.interviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.interview_sessions(created_at DESC);
