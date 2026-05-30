'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, Mic, Video, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CandidateJoinPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [candidateName, setCandidateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId: id, candidateName: candidateName.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to join interview');
      }

      const { sessionId } = await res.json();
      router.push(`/interview/${id}/session?sessionId=${sessionId}&name=${encodeURIComponent(candidateName.trim())}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">AI Recruiter</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join Interview</CardTitle>
            <CardDescription>
              You&apos;re about to start an AI-powered voice interview. Make sure your microphone is ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Requirements */}
            <div className="rounded-xl bg-muted/50 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Before you begin
              </p>
              <div className="space-y-2">
                {[
                  { icon: Mic, text: 'Allow microphone access when prompted' },
                  { icon: Video, text: 'Find a quiet place with no distractions' },
                  { icon: Clock, text: 'Set aside enough time to complete the interview' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Jane Smith"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={isLoading || !candidateName.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparing Interview...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Join Interview
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          This interview is conducted by an AI. Your responses will be recorded and evaluated.
        </p>
      </div>
    </div>
  );
}
