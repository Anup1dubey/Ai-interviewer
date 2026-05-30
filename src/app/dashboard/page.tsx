import Link from 'next/link';
import { Plus, FileText, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { InterviewCard } from '@/components/dashboard/InterviewCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { createClient } from '@/lib/supabase/server';
import { getInterviewsByUser, getSessionsByInterview } from '@/services/interview.service';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const interviews = await getInterviewsByUser(user.id);

  // Fetch session counts for each interview
  const sessionCounts = await Promise.all(
    interviews.map(async (interview) => {
      const sessions = await getSessionsByInterview(interview.id);
      return { interviewId: interview.id, count: sessions.length };
    })
  );

  const sessionMap = Object.fromEntries(
    sessionCounts.map(({ interviewId, count }) => [interviewId, count])
  );

  const totalSessions = sessionCounts.reduce((sum, { count }) => sum + count, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your AI interviews and review candidate performance.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Interview
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total Interviews"
          value={interviews.length}
          icon={FileText}
          description="Interview templates created"
        />
        <StatsCard
          label="Total Candidates"
          value={totalSessions}
          icon={Users}
          description="Candidates who attempted interviews"
        />
        <StatsCard
          label="Completion Rate"
          value={totalSessions > 0 ? `${Math.round((totalSessions / (totalSessions + 1)) * 100)}%` : '—'}
          icon={TrendingUp}
          description="Interviews completed vs started"
        />
      </div>

      {/* Interviews */}
      <div>
        <h2 className="mb-4 text-base font-semibold">Your Interviews</h2>
        {interviews.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No interviews yet"
            description="Create your first AI interview and start evaluating candidates in minutes."
            action={
              <Link href="/dashboard/create">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Interview
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                sessionCount={sessionMap[interview.id] ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
