import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewFeedback } from '@/services/ai.service';
import { saveFeedback, getFeedbackBySession, getMessagesBySession } from '@/services/feedback.service';
import { getSessionById, updateSessionStatus } from '@/services/interview.service';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`feedback:${ip}`, 5, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait before generating feedback again.' }, { status: 429 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Prevent duplicate feedback generation
    const existing = await getFeedbackBySession(sessionId);
    if (existing) {
      return NextResponse.json({ feedback: existing, generatedFeedback: null, cached: true });
    }

    const session = await getSessionById(sessionId);
    if (!session || !session.interview) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const messages = await getMessagesBySession(sessionId);
    if (messages.length === 0) {
      return NextResponse.json({ error: 'No transcript found for this session' }, { status: 400 });
    }

    const transcript = messages
      .map((m) => `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.message}`)
      .join('\n\n');

    const generatedFeedback = await generateInterviewFeedback({
      transcript,
      jobRole: session.interview.role,
      experienceLevel: session.interview.experience_level,
      resumeText: session.resume_text ?? undefined,
    });

    const feedback = await saveFeedback(sessionId, generatedFeedback);

    await updateSessionStatus(sessionId, 'completed', {
      overall_score: generatedFeedback.overallScore,
      recommendation: generatedFeedback.finalRecommendation,
      ended_at: new Date().toISOString(),
    });

    return NextResponse.json({ feedback, generatedFeedback });
  } catch (error) {
    console.error('Generate feedback error:', error);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const feedback = await getFeedbackBySession(sessionId);
    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}
