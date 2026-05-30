import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Users, Clock, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { getInterviewById, getSessionsByInterview } from '@/services/interview.service';
import { generateShareableLink, formatDate, formatDuration } from '@/lib/utils';
import { CopyLinkButton } from '@/components/dashboard/CopyLinkButton';
import { getScoreColor } from '@/constants';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InterviewDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const interview = await getInterviewById(id);
  if (!interview || interview.user_id !== user.id) notFound();

  const sessions = await getSessionsByInterview(id);
  const shareableLink = generateShareableLink(id);

  const completedSessions = sessions.filter((s) => s.status === 'completed');

  return (
    <div className="p-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{interview.role}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Created {formatDate(interview.created_at)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">{interview.difficulty}</Badge>
            <Badge variant="secondary" className="capitalize">{interview.interview_type}</Badge>
            <Badge variant="secondary" className="capitalize">{interview.experience_level}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={shareableLink} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-3.5 w-3.5" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shareable Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shareable Interview Link</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
                <span className="flex-1 truncate text-sm font-mono text-muted-foreground">
                  {shareableLink}
                </span>
                <CopyLinkButton link={shareableLink} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Share this link with candidates. They can join with just their name.
              </p>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Interview Questions ({interview.questions?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interview.questions?.map((q, i) => (
                <div key={q.id} className="space-y-1">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{q.question}</p>
                      {q.expectedTopics?.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {q.expectedTopics.map((topic) => (
                            <span
                              key={topic}
                              className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 capitalize text-xs"
                    >
                      {q.type}
                    </Badge>
                  </div>
                  {i < interview.questions.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Attempts</span>
                <span className="font-semibold">{sessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-semibold">{completedSessions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-semibold">{formatDuration(interview.duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Questions</span>
                <span className="font-semibold">{interview.questions?.length ?? 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Candidates ({sessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No candidates yet. Share the link to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{session.candidate_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(session.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.overall_score !== null && (
                            <span className={cn('text-sm font-bold', getScoreColor(session.overall_score))}>
                              {session.overall_score}
                            </span>
                          )}
                          {session.status === 'completed' ? (
                            <Link href={`/dashboard/interview/${id}/feedback/${session.id}`}>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                View
                              </Button>
                            </Link>
                          ) : (
                            <Badge variant="outline" className="text-xs capitalize">
                              {session.status.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
