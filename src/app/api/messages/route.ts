import { NextRequest, NextResponse } from 'next/server';
import { saveMessages, getMessagesBySession } from '@/services/feedback.service';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, messages } = await request.json();

    if (!sessionId || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await saveMessages(sessionId, messages);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save messages error:', error);
    return NextResponse.json({ error: 'Failed to save messages' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const messages = await getMessagesBySession(sessionId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
