import Link from 'next/link';
import { CheckCircle, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getFeedbackBySession } from '@/services/feedback.service';
import { getSessionById } from '@/services/interview.service';
import { FeedbackCard } from '@/components/interview/FeedbackCard';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sessionId?: string }>;
}

export default async function CompletePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { sessionId } = await searchParams;

  let feedback = null;
  let session = null;

  if (sessionId) {
    [feedback, session] = await Promise.all([
      getFeedbackBySession(sessionId),
      getSessionById(sessionId),
    ]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold">AI Recruiter</span>
        </Link>
      </header>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          {/* Completion banner */}
          <Card className="mb-6 border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30">
            <CardContent className="flex items-center gap-4 pt-6 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/50">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="font-semibold text-emerald-900 dark:text-emerald-100">
                  Interview Completed!
                </h1>
                <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-300">
                  {session?.candidate_name
                    ? `Great job, ${session.candidate_name}! Your responses have been evaluated.`
                    : 'Your interview has been completed. Thank you for your time!'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {feedback ? (
            <FeedbackCard feedback={feedback} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Your feedback is being generated. Check back in a moment!
                </p>
              </CardContent>
            </Card>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Thank you for using AI Recruiter. Good luck with your application!
          </p>
        </div>
      </div>
    </div>
  );
}
