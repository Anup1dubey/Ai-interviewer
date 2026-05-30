import { createServiceClient } from '@/lib/supabase/server';
import { Feedback, GeneratedFeedback } from '@/types';

export async function saveFeedback(
  sessionId: string,
  feedback: GeneratedFeedback
): Promise<Feedback> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      session_id: sessionId,
      technical_score: feedback.technicalSkills.score,
      communication_score: feedback.communication.score,
      confidence_score: feedback.confidence.score,
      problem_solving_score: feedback.problemSolving.score,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      summary: feedback.summary,
      recommendation: feedback.finalRecommendation,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getFeedbackBySession(sessionId: string): Promise<Feedback | null> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return data[0];
}

export async function getFeedbackByInterview(interviewId: string): Promise<Feedback[]> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('feedback')
    .select('*, session:interview_sessions!inner(*)')
    .eq('session.interview_id', interviewId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveMessages(
  sessionId: string,
  messages: Array<{ role: 'assistant' | 'user'; message: string }>
): Promise<void> {
  const supabase = await createServiceClient();

  const rows = messages.map((m) => ({
    session_id: sessionId,
    role: m.role,
    message: m.message,
  }));

  const { error } = await supabase.from('interview_messages').insert(rows);
  if (error) throw new Error(error.message);
}

export async function getMessagesBySession(
  sessionId: string
): Promise<Array<{ role: string; message: string }>> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('interview_messages')
    .select('role, message')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
