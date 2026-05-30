import { notFound } from 'next/navigation';
import { getInterviewById } from '@/services/interview.service';
import { InterviewRoom } from '@/components/interview/InterviewRoom';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sessionId?: string; name?: string }>;
}

export default async function SessionPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { sessionId, name } = await searchParams;

  if (!sessionId || !name) notFound();

  const interview = await getInterviewById(id);
  if (!interview) notFound();

  return (
    <InterviewRoom
      interview={interview}
      sessionId={sessionId}
      candidateName={decodeURIComponent(name)}
    />
  );
}
