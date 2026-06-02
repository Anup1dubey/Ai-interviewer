import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSession, updateSessionStatus, getSessionById, getInterviewById } from '@/services/interview.service';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const createSessionSchema = z.object({
  interviewId: z.string().min(1, 'Interview ID required'),
  candidateName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  resume_text: z.string().max(20000).optional(),
});

const updateSessionSchema = z.object({
  sessionId: z.string().min(1),
  status: z.enum(['in_progress', 'completed']),
  overall_score: z.number().min(0).max(100).optional(),
  recommendation: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`session:${ip}`, 20, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { interviewId, candidateName, resume_text } = parsed.data;

    const interview = await getInterviewById(interviewId);
    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    const session = await createSession(interviewId, candidateName, resume_text);
    return NextResponse.json({ session, sessionId: session.id });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { sessionId, status, overall_score, recommendation } = parsed.data;

    const extras: Record<string, string | number> = {};
    if (status === 'in_progress') extras.started_at = new Date().toISOString();
    if (status === 'completed') {
      extras.ended_at = new Date().toISOString();
      if (overall_score !== undefined) extras.overall_score = overall_score;
      if (recommendation) extras.recommendation = recommendation;
    }

    await updateSessionStatus(sessionId, status, extras);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await getSessionById(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
