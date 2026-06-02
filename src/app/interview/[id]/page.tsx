import { CandidateJoinClient } from './CandidateJoinClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateJoinPage({ params }: PageProps) {
  const { id } = await params;
  return <CandidateJoinClient id={id} />;
}
