export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Interview {
  id: string;
  user_id: string;
  role: string;
  description: string | null;
  experience_level: ExperienceLevel;
  difficulty: Difficulty;
  duration: number;
  interview_type: InterviewType;
  questions: Question[];
  created_at: string;
}

export interface Question {
  id: number;
  type: 'technical' | 'behavioral' | 'situational';
  question: string;
  expectedTopics: string[];
}

export interface InterviewSession {
  id: string;
  interview_id: string;
  candidate_name: string;
  status: SessionStatus;
  started_at: string | null;
  ended_at: string | null;
  overall_score: number | null;
  recommendation: string | null;
  created_at: string;
  interview?: Interview;
}

export interface InterviewMessage {
  id: string;
  session_id: string;
  role: 'assistant' | 'user';
  message: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  session_id: string;
  technical_score: number;
  communication_score: number;
  confidence_score: number;
  problem_solving_score: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  recommendation: string;
  created_at: string;
  session?: InterviewSession;
}

export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type InterviewType = 'technical' | 'behavioral' | 'mixed';
export type SessionStatus = 'pending' | 'in_progress' | 'completed';

export interface CreateInterviewData {
  role: string;
  description: string;
  experience_level: ExperienceLevel;
  difficulty: Difficulty;
  duration: number;
  interview_type: InterviewType;
}

export interface GeneratedFeedback {
  overallScore: number;
  technicalSkills: { score: number; summary: string };
  communication: { score: number; summary: string };
  problemSolving: { score: number; summary: string };
  confidence: { score: number; summary: string };
  strengths: string[];
  weaknesses: string[];
  finalRecommendation: string;
  summary: string;
}

export interface VapiMessage {
  type: string;
  role?: 'assistant' | 'user';
  transcript?: string;
  transcriptType?: string;
}
