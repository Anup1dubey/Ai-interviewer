import OpenAI from 'openai';
import { QUESTION_GENERATION_PROMPT, FEEDBACK_PROMPT } from '@/prompts';
import { Question, GeneratedFeedback, ExperienceLevel, InterviewType } from '@/types';
import { calculateQuestionCount } from '@/lib/utils';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

interface GenerateQuestionsParams {
  jobTitle: string;
  jobDescription: string;
  experienceLevel: ExperienceLevel;
  duration: number;
  interviewType: InterviewType;
}

export async function generateInterviewQuestions(
  params: GenerateQuestionsParams
): Promise<Question[]> {
  const questionCount = calculateQuestionCount(params.duration);

  const prompt = QUESTION_GENERATION_PROMPT
    .replace('{{jobTitle}}', params.jobTitle)
    .replace('{{jobDescription}}', params.jobDescription)
    .replace('{{experienceLevel}}', params.experienceLevel)
    .replace('{{duration}}', params.duration.toString())
    .replace('{{interviewType}}', params.interviewType)
    .replace('{{questionCount}}', questionCount.toString());

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI - empty content');

    const parsed = JSON.parse(content);
    const questions = parsed.interviewPlan?.questions ?? [];
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error(`Invalid questions format: ${JSON.stringify(questions).substring(0, 100)}`);
    }
    
    return questions;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('AI Question Generation Error:', errorMsg);
    throw new Error(`Failed to generate interview questions: ${errorMsg}`);
  }
}

interface GenerateFeedbackParams {
  transcript: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
}

export async function generateInterviewFeedback(
  params: GenerateFeedbackParams
): Promise<GeneratedFeedback> {
  const prompt = FEEDBACK_PROMPT
    .replace('{{transcript}}', params.transcript)
    .replace('{{jobRole}}', params.jobRole)
    .replace('{{experienceLevel}}', params.experienceLevel);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI - empty content');

  try {
    const parsed = JSON.parse(content);
    return parsed.feedback || parsed;
  } catch (parseError) {
    throw new Error(`JSON parse failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
  }
}
