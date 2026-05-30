import { CheckCircle, XCircle, TrendingUp, MessageSquare, Brain, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Feedback } from '@/types';
import { getScoreColor, getScoreLabel } from '@/constants';
import { cn } from '@/lib/utils';

interface FeedbackCardProps {
  feedback: Feedback;
  candidateName?: string;
}

const scoreCategories = [
  { key: 'technical_score', label: 'Technical Skills', icon: Brain },
  { key: 'communication_score', label: 'Communication', icon: MessageSquare },
  { key: 'problem_solving_score', label: 'Problem Solving', icon: TrendingUp },
  { key: 'confidence_score', label: 'Confidence', icon: Flame },
] as const;

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: typeof Brain }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className={cn('text-sm font-bold', getScoreColor(score))}>{score}/100</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
}

export function FeedbackCard({ feedback, candidateName }: FeedbackCardProps) {
  const overallScore = Math.round(
    (feedback.technical_score + feedback.communication_score +
      feedback.problem_solving_score + feedback.confidence_score) / 4
  );

  const isHire = feedback.recommendation === 'hire';
  const isConsider = feedback.recommendation === 'consider';

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              {candidateName && (
                <p className="text-sm text-muted-foreground mb-1">{candidateName}</p>
              )}
              <p className="text-4xl font-bold">{overallScore}<span className="text-xl text-muted-foreground">/100</span></p>
              <p className={cn('text-sm font-medium mt-1', getScoreColor(overallScore))}>
                {getScoreLabel(overallScore)}
              </p>
            </div>
            <div className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
              isHire
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : isConsider
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {isHire ? (
                <><CheckCircle className="h-4 w-4" /> Hire</>
              ) : isConsider ? (
                <><CheckCircle className="h-4 w-4" /> Consider</>
              ) : (
                <><XCircle className="h-4 w-4" /> Reject</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {scoreCategories.map(({ key, label, icon }) => (
            <ScoreBar
              key={key}
              label={label}
              score={feedback[key]}
              icon={icon}
            />
          ))}
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.strengths?.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.weaknesses?.map((weakness, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {feedback.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{feedback.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
