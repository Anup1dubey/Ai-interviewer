import Link from 'next/link';
import { ArrowRight, Clock, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Interview } from '@/types';
import { formatDate, formatDuration } from '@/lib/utils';

interface InterviewCardProps {
  interview: Interview;
  sessionCount?: number;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const typeColors: Record<string, string> = {
  technical: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  behavioral: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  mixed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
};

export function InterviewCard({ interview, sessionCount = 0 }: InterviewCardProps) {
  return (
    <Link href={`/dashboard/interview/${interview.id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-base group-hover:text-primary transition-colors">
                {interview.role}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Created {formatDate(interview.created_at)}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${difficultyColors[interview.difficulty]}`}
            >
              {interview.difficulty}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeColors[interview.interview_type]}`}
            >
              {interview.interview_type}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
              {interview.experience_level}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              {interview.questions?.length ?? 0} questions
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(interview.duration)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {sessionCount} {sessionCount === 1 ? 'attempt' : 'attempts'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
