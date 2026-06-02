import Link from 'next/link';
import { Clock, Users, Zap, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Interview } from '@/types';
import { formatDate, formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface InterviewCardProps {
  interview: Interview;
  sessionCount?: number;
}

const difficultyConfig: Record<string, { label: string; class: string }> = {
  easy: { label: 'Easy', class: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-900' },
  medium: { label: 'Medium', class: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900' },
  hard: { label: 'Hard', class: 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900' },
};

const typeConfig: Record<string, { label: string; class: string }> = {
  technical: { label: 'Technical', class: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-900' },
  behavioral: { label: 'Behavioral', class: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:ring-purple-900' },
  mixed: { label: 'Mixed', class: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:ring-indigo-900' },
};

export function InterviewCard({ interview, sessionCount = 0 }: InterviewCardProps) {
  const difficulty = difficultyConfig[interview.difficulty] ?? difficultyConfig.medium;
  const type = typeConfig[interview.interview_type] ?? typeConfig.technical;

  return (
    <Link href={`/dashboard/interview/${interview.id}`}>
      <Card className="group h-full cursor-pointer border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        {/* Accent top bar */}
        <div className="h-1 w-full rounded-t-xl bg-gradient-to-r from-primary/60 to-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <CardContent className="p-5">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                {interview.role}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Created {formatDate(interview.created_at)}
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/50 opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
          </div>

          {/* Badges */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', difficulty.class)}>
              {difficulty.label}
            </span>
            <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', type.class)}>
              {type.label}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground capitalize">
              {interview.experience_level}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              {interview.questions?.length ?? 0} questions
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(interview.duration)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {sessionCount} {sessionCount === 1 ? 'attempt' : 'attempts'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
