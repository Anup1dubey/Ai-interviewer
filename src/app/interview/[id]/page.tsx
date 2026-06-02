'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, Mic, Volume2, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResumeUpload } from '@/components/interview/ResumeUpload';
import { ResumeProfile } from '@/types';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

const checklist = [
  { icon: Mic, text: 'Allow microphone access when prompted' },
  { icon: Volume2, text: 'Use headphones for the best experience' },
  { icon: Clock, text: 'Set aside uninterrupted time to complete the interview' },
  { icon: ShieldCheck, text: 'Your responses are evaluated privately by AI' },
];

export default function CandidateJoinPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [candidateName, setCandidateName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState<string | null>(null);

  const handleResumeParsed = (text: string, _profile: ResumeProfile) => {
    setResumeText(text);
  };

  const handleResumeClear = () => {
    setResumeText(null);
  };

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
        body: JSON.stringify({
          interviewId: id,
          candidateName: candidateName.trim(),
          resume_text: resumeText ?? undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to join interview');
      }

      const { sessionId } = await res.json();
      router.push(`/interview/${id}/session?sessionId=${sessionId}&name=${encodeURIComponent(candidateName.trim())}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Minimal header */}
      <header className="border-b bg-background/80 backdrop-blur px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">AI Recruiter</span>
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Ready for your interview?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You&apos;ll speak with an AI interviewer. No scheduling required.
            </p>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Before you begin</CardTitle>
              <CardDescription>Make sure you&apos;re prepared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Checklist */}
              <ul className="space-y-2.5">
                {checklist.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="h-px bg-border" />

              {/* Resume upload (Phase 4) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Resume (optional)</Label>
                <ResumeUpload onParsed={handleResumeParsed} onClear={handleResumeClear} />
                {resumeText && (
                  <p className="text-xs text-emerald-600">
                    ✓ Your resume will personalize the interview questions
                  </p>
                )}
              </div>

              <div className="h-px bg-border" />

              {/* Form */}
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Your Full Name</Label>
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
                  className="w-full gap-2 h-11"
                  size="lg"
                  disabled={isLoading || !candidateName.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Setting up interview...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      Start Interview
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            This interview is AI-powered. Your responses will be recorded and evaluated automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
