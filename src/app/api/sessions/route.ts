import { NextRequest, NextResponse } from 'next/server';
import { createSession, updateSessionStatus, getSessionById } from '@/services/interview.service';

export async function POST(request: NextRequest) {
  try {
    const { interviewId, candidateName } = await request.json();

    if (!interviewId || !candidateName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await createSession(interviewId, candidateName);
    return NextResponse.json({ session, sessionId: session.id });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { sessionId, status, overall_score, recommendation } = await request.json();

    if (!sessionId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
