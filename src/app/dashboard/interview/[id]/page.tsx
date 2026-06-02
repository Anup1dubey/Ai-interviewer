import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Zap, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { getInterviewById, getSessionsByInterview } from '@/services/interview.service';
import { generateShareableLink, formatDate, formatDuration } from '@/lib/utils';
import { CopyLinkButton } from '@/components/dashboard/CopyLinkButton';
import { CandidateRanking } from '@/components/dashboard/CandidateRanking';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400',
  hard: 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400',
};

export default async function InterviewDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const interview = await getInterviewById(id);
  if (!interview || interview.user_id !== user.id) notFound();

  const sessions = await getSessionsByInterview(id);
  const shareableLink = generateShareableLink(id);
  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="p-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{interview.role}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Created {formatDate(interview.created_at)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize', difficultyColors[interview.difficulty])}>
              {interview.difficulty}
            </span>
            <span className="rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 px-2.5 py-0.5 text-[11px] font-semibold capitalize">
              {interview.interview_type}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground capitalize">
              {interview.experience_level}
            </span>
          </div>
        </div>
        <Link href={shareableLink} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2 shrink-0">
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: shareable link + questions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Shareable link */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Share with Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-4 py-3">
                <span className="flex-1 truncate font-mono text-xs text-muted-foreground">
                  {shareableLink}
                </span>
                <CopyLinkButton link={shareableLink} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Candidates open this link, enter their name, and start the voice interview immediately.
              </p>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Interview Questions
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({interview.questions?.length ?? 0})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interview.questions?.map((q, i) => (
                <div key={q.id}>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed">{q.question}</p>
                      {q.expectedTopics?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {q.expectedTopics.map((topic) => (
                            <span key={topic} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="shrink-0 capitalize text-[11px]">
                      {q.type}
                    </Badge>
                  </div>
                  {i < interview.questions.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: stats + ranking */}
        <div className="space-y-6">
          {/* Quick stats */}
          <Card>
            <CardContent className="divide-y pt-0">
              {[
                { label: 'Total Attempts', value: sessions.length, icon: Users },
                { label: 'Completed', value: completedCount, icon: Users },
                { label: 'Duration', value: formatDuration(interview.duration), icon: Clock },
                { label: 'Questions', value: interview.questions?.length ?? 0, icon: Zap },
              ].map(({ label, value }, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Candidate ranking (Phase 5) */}
          <CandidateRanking sessions={sessions} interviewId={id} />
        </div>
      </div>
    </div>
  );
}
