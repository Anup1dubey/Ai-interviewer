import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveMessages, getMessagesBySession } from '@/services/feedback.service';

const saveMessagesSchema = z.object({
  sessionId: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(['assistant', 'user']),
      message: z.string().min(1).max(10000),
    })
  ).min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = saveMessagesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await saveMessages(parsed.data.sessionId, parsed.data.messages);
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
