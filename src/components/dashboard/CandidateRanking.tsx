import Link from 'next/link';
import { Trophy, CheckCircle, XCircle, Clock, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InterviewSession } from '@/types';
import { formatDate } from '@/lib/utils';
import { getScoreColor } from '@/constants';
import { cn } from '@/lib/utils';

interface CandidateRankingProps {
  sessions: InterviewSession[];
  interviewId: string;
}

const recommendationConfig = {
  hire: {
    label: 'Hire',
    class: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400',
    icon: CheckCircle,
  },
  consider: {
    label: 'Consider',
    class: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400',
    icon: Clock,
  },
  reject: {
    label: 'Reject',
    class: 'bg-red-100 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400',
    icon: XCircle,
  },
};

const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-700'];

export function CandidateRanking({ sessions, interviewId }: CandidateRankingProps) {
  const completed = sessions
    .filter((s) => s.status === 'completed' && s.overall_score !== null)
    .sort((a, b) => (b.overall_score ?? 0) - (a.overall_score ?? 0));

  const pending = sessions.filter((s) => s.status !== 'completed');

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            Candidate Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-6">
            No candidates yet. Share the interview link to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-primary" />
          Candidate Ranking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {completed.map((session, index) => {
          const rec = session.recommendation
            ? recommendationConfig[session.recommendation as keyof typeof recommendationConfig]
            : null;
          const RecIcon = rec?.icon;

          return (
            <Link
              key={session.id}
              href={`/dashboard/interview/${interviewId}/feedback/${session.id}`}
              className="flex items-center gap-3 rounded-xl border p-3 transition-all hover:bg-muted/50 hover:border-primary/20 group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                {index < 3 ? (
                  <Medal className={cn('h-5 w-5', medalColors[index])} />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                  {session.candidate_name}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(session.created_at)}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {rec && RecIcon && (
                  <span className={cn('hidden sm:flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', rec.class)}>
                    <RecIcon className="h-3 w-3" />
                    {rec.label}
                  </span>
                )}
                {session.overall_score !== null && (
                  <span className={cn('text-lg font-bold tabular-nums', getScoreColor(session.overall_score))}>
                    {session.overall_score}
                  </span>
                )}
              </div>
            </Link>
          );
        })}

        {pending.map((session) => (
          <div
            key={session.id}
            className="flex items-center gap-3 rounded-xl border border-dashed p-3 opacity-60"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{session.candidate_name}</p>
              <p className="text-xs text-muted-foreground capitalize">{session.status.replace('_', ' ')}</p>
            </div>
            <Badge variant="outline" className="text-xs capitalize shrink-0">
              {session.status.replace('_', ' ')}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
