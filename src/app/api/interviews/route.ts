import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateInterviewQuestions } from '@/services/ai.service';
import { createInterview, getInterviewsByUser } from '@/services/interview.service';
import { createInterviewSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;

    const questions = await generateInterviewQuestions({
      jobTitle: data.role,
      jobDescription: data.description,
      experienceLevel: data.experience_level,
      duration: data.duration,
      interviewType: data.interview_type,
    });

    const interview = await createInterview(user.id, data, questions);

    return NextResponse.json({ interviewId: interview.id, interview });
  } catch (error) {
    console.error('Create interview error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create interview';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interviews = await getInterviewsByUser(user.id);
    return NextResponse.json({ interviews });
  } catch (error) {
    console.error('Get interviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}
