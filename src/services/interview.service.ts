import { createClient, createServiceClient } from '@/lib/supabase/server';
import { Interview, InterviewSession, CreateInterviewData, Question } from '@/types';

export async function createInterview(
  userId: string,
  data: CreateInterviewData,
  questions: Question[]
): Promise<Interview> {
  const supabase = await createClient();

  const { data: interview, error } = await supabase
    .from('interviews')
    .insert({
      user_id: userId,
      role: data.role,
      description: data.description,
      experience_level: data.experience_level,
      difficulty: data.difficulty,
      duration: data.duration,
      interview_type: data.interview_type,
      questions,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return interview;
}

export async function getInterviewsByUser(userId: string): Promise<Interview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getSessionsByInterview(interviewId: string): Promise<InterviewSession[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('interview_id', interviewId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createSession(
  interviewId: string,
  candidateName: string
): Promise<InterviewSession> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('interview_sessions')
    .insert({
      interview_id: interviewId,
      candidate_name: candidateName,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSessionStatus(
  sessionId: string,
  status: 'in_progress' | 'completed',
  extras?: { overall_score?: number; recommendation?: string; ended_at?: string; started_at?: string }
): Promise<void> {
  const supabase = await createServiceClient();

  const { error } = await supabase
    .from('interview_sessions')
    .update({ status, ...extras })
    .eq('id', sessionId);

  if (error) throw new Error(error.message);
}

export async function getSessionById(sessionId: string): Promise<InterviewSession | null> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*, interview:interviews(*)')
    .eq('id', sessionId)
    .single();

  if (error) return null;
  return data;
}
