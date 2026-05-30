import { z } from 'zod';

export const createInterviewSchema = z.object({
  role: z.string().min(2, 'Job role must be at least 2 characters'),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
  experience_level: z.enum(['junior', 'mid', 'senior', 'lead']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.number().min(15).max(120),
  interview_type: z.enum(['technical', 'behavioral', 'mixed']),
});

export const joinInterviewSchema = z.object({
  candidate_name: z.string().min(2, 'Name must be at least 2 characters'),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type JoinInterviewInput = z.infer<typeof joinInterviewSchema>;
