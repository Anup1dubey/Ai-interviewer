import OpenAI from 'openai';
import { QUESTION_GENERATION_PROMPT, FEEDBACK_PROMPT, RESUME_PROFILE_PROMPT } from '@/prompts';
import { Question, GeneratedFeedback, ExperienceLevel, InterviewType, ResumeProfile } from '@/types';
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
  resumeText?: string;
}

export async function generateInterviewFeedback(
  params: GenerateFeedbackParams
): Promise<GeneratedFeedback> {
  const resumeSection = params.resumeText
    ? `\nCANDIDATE RESUME CONTEXT:\n${params.resumeText}`
    : '';
  const resumeInstruction = params.resumeText
    ? '\nWhen scoring, take into account the candidate\'s background from their resume. Reference specific projects or experience where relevant in the summary.'
    : '';

  const prompt = FEEDBACK_PROMPT
    .replace('{{transcript}}', params.transcript)
    .replace('{{jobRole}}', params.jobRole)
    .replace('{{experienceLevel}}', params.experienceLevel)
    .replace('{{resumeSection}}', resumeSection)
    .replace('{{resumeInstruction}}', resumeInstruction);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI - empty content');

    const parsed = JSON.parse(content);
    return parsed.feedback || parsed;
  } catch (parseError) {
    throw new Error(`Feedback generation failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
  }
}

export async function generateResumeProfile(resumeText: string): Promise<ResumeProfile> {
  const prompt = RESUME_PROFILE_PROMPT.replace('{{resumeText}}', resumeText.slice(0, 8000));

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const parsed = JSON.parse(content);
    return parsed.profile || parsed;
  } catch (error) {
    throw new Error(`Resume parsing failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
