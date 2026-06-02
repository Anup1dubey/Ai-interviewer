'use client';

import dynamic from 'next/dynamic';
import { CheckCircle, XCircle, TrendingUp, MessageSquare, Brain, Flame, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Feedback } from '@/types';
import { getScoreColor, getScoreLabel } from '@/constants';
import { cn } from '@/lib/utils';

const ScoreChart = dynamic(() => import('./ScoreChart').then((m) => m.ScoreChart), { ssr: false });

interface FeedbackCardProps {
  feedback: Feedback;
  candidateName?: string;
}

const scoreCategories = [
  { key: 'technical_score' as const, label: 'Technical Skills', icon: Brain },
  { key: 'communication_score' as const, label: 'Communication', icon: MessageSquare },
  { key: 'problem_solving_score' as const, label: 'Problem Solving', icon: TrendingUp },
  { key: 'confidence_score' as const, label: 'Confidence', icon: Flame },
];

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: typeof Brain }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-bold tabular-nums', getScoreColor(score))}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
}

const recommendationConfig = {
  hire: {
    label: 'Recommended to Hire',
    class: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900',
    icon: CheckCircle,
    iconClass: 'text-emerald-500',
  },
  consider: {
    label: 'Consider for Next Round',
    class: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900',
    icon: Award,
    iconClass: 'text-amber-500',
  },
  reject: {
    label: 'Not Recommended',
    class: 'bg-red-50 text-red-800 ring-1 ring-red-200 dark:bg-red-950/30 dark:text-red-300 dark:ring-red-900',
    icon: XCircle,
    iconClass: 'text-red-500',
  },
};

export function FeedbackCard({ feedback, candidateName }: FeedbackCardProps) {
  const overallScore = Math.round(
    (feedback.technical_score + feedback.communication_score +
      feedback.problem_solving_score + feedback.confidence_score) / 4
  );

  const rec = recommendationConfig[feedback.recommendation as keyof typeof recommendationConfig]
    ?? recommendationConfig.consider;
  const RecIcon = rec.icon;

  // SVG circle score
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="space-y-5">
      {/* Hero: Overall Score + Recommendation */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* Circular Score */}
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--muted)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r={radius} fill="none"
                  stroke="var(--primary)" strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-3xl font-extrabold tabular-nums', getScoreColor(overallScore))}>
                  {overallScore}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">/ 100</span>
              </div>
            </div>

            {/* Text info */}
            <div className="flex-1 text-center sm:text-left">
              {candidateName && (
                <p className="mb-1 text-sm text-muted-foreground">{candidateName}</p>
              )}
              <p className={cn('text-2xl font-bold', getScoreColor(overallScore))}>
                {getScoreLabel(overallScore)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Overall performance</p>

              <div className={cn('mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold', rec.class)}>
                <RecIcon className={cn('h-4 w-4', rec.iconClass)} />
                {rec.label}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart + Score breakdown side by side */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Skills Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreChart
              technicalScore={feedback.technical_score}
              communicationScore={feedback.communication_score}
              problemSolvingScore={feedback.problem_solving_score}
              confidenceScore={feedback.confidence_score}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {scoreCategories.map(({ key, label, icon }) => (
              <ScoreBar key={key} label={label} score={feedback[key]} icon={icon} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(feedback.strengths ?? []).map((strength, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(feedback.weaknesses ?? []).map((weakness, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {feedback.summary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Interview Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{feedback.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
