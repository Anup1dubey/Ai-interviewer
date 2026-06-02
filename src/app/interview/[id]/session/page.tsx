import { notFound } from 'next/navigation';
import { getInterviewById, getSessionById } from '@/services/interview.service';
import { InterviewRoom } from '@/components/interview/InterviewRoom';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sessionId?: string; name?: string }>;
}

export default async function SessionPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { sessionId, name } = await searchParams;

  if (!sessionId || !name) notFound();

  const [interview, session] = await Promise.all([
    getInterviewById(id),
    getSessionById(sessionId),
  ]);

  if (!interview || !session) notFound();

  return (
    <InterviewRoom
      interview={interview}
      sessionId={sessionId}
      candidateName={decodeURIComponent(name)}
      resumeText={session.resume_text}
    />
  );
}
