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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const name = user.email?.split('@')[0] ?? 'there';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, <span className="capitalize">{name}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your AI interviews.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="gap-2 shadow-sm">
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
          accent="blue"
        />
        <StatsCard
          label="Total Candidates"
          value={totalSessions}
          icon={Users}
          description="Candidates who attempted"
          accent="emerald"
        />
        <StatsCard
          label="Avg. Score"
          value={
            (() => {
              const withScores = sessionCounts.flatMap(({ interviewId }) => {
                return [];
              });
              return totalSessions > 0 ? `${interviews.length} active` : '—';
            })()
          }
          icon={TrendingUp}
          description="Interviews currently active"
          accent="violet"
        />
      </div>

      {/* Interviews grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Your Interviews</h2>
          {interviews.length > 0 && (
            <p className="text-xs text-muted-foreground">{interviews.length} total</p>
          )}
        </div>

        {interviews.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No interviews yet"
            description="Create your first AI interview in minutes. Add a role, description, and let the AI generate tailored questions automatically."
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
