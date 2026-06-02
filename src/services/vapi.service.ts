import { Question, ExperienceLevel } from '@/types';
import { VOICE_INTERVIEW_PROMPT } from '@/prompts';

interface BuildAssistantParams {
  candidateName: string;
  jobRole: string;
  experienceLevel: ExperienceLevel;
  questions: Question[];
  resumeText?: string | null;
}

export function buildVapiAssistantConfig(params: BuildAssistantParams) {
  const questionsText = params.questions
    .map((q, i) => `${i + 1}. [${q.type.toUpperCase()}] ${q.question}`)
    .join('\n');

  const resumeSection = params.resumeText
    ? `\nCANDIDATE BACKGROUND (use this to personalize questions):\n${params.resumeText}`
    : '';

  const systemPrompt = VOICE_INTERVIEW_PROMPT
    .replace('{{candidateName}}', params.candidateName)
    .replace('{{jobRole}}', params.jobRole)
    .replace('{{experienceLevel}}', params.experienceLevel)
    .replace('{{resumeSection}}', resumeSection)
    .replace('{{questions}}', questionsText);

  return {
    transcriber: {
      provider: 'deepgram' as const,
      model: 'nova-2',
      language: 'en',
    },
    model: {
      provider: 'openai' as const,
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 300,
    },
    voice: {
      provider: 'openai' as const,
      voiceId: 'nova',
    },
    firstMessage: `Hello ${params.candidateName}! I'm your AI interviewer today. I'll be conducting your interview for the ${params.jobRole} position. Before we begin, I want to let you know this is a friendly conversation — just be yourself and take your time. Are you ready to start?`,
    endCallFunctionEnabled: true,
    recordingEnabled: false,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 3600,
    backgroundSound: 'off' as const,
  };
}
