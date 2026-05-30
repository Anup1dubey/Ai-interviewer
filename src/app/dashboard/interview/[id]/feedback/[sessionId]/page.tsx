import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getFeedbackBySession } from '@/services/feedback.service';
import { getSessionById } from '@/services/interview.service';
import { FeedbackCard } from '@/components/interview/FeedbackCard';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string; sessionId: string }>;
}

export default async function FeedbackPage({ params }: PageProps) {
  const { id, sessionId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const session = await getSessionById(sessionId);
  if (!session) notFound();

  const feedback = await getFeedbackBySession(sessionId);
  if (!feedback) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No feedback available for this session yet.</p>
        <Link href={`/dashboard/interview/${id}`} className="mt-4 inline-block text-sm underline">
          Back to Interview
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        href={`/dashboard/interview/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Interview
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Candidate Feedback</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {session.candidate_name} · {session.interview?.role} ·{' '}
          {session.ended_at ? formatDate(session.ended_at) : formatDate(session.created_at)}
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <FeedbackCard feedback={feedback} candidateName={session.candidate_name} />
      </div>
    </div>
  );
}
