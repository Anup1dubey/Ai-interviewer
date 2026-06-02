'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, PhoneOff, Clock, Bot, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVapi, CallStatus } from '@/hooks/useVapi';
import { buildVapiAssistantConfig } from '@/services/vapi.service';
import { Interview, VapiMessage } from '@/types';
import { toast } from 'sonner';
import { cn, getInitials } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface InterviewRoomProps {
  interview: Interview;
  sessionId: string;
  candidateName: string;
  resumeText?: string | null;
}

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };
  return { time: formatTime(seconds), start: () => setRunning(true), stop: () => setRunning(false), seconds };
}

const statusConfig: Record<CallStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  idle: { label: 'Ready', variant: 'secondary' },
  connecting: { label: 'Connecting...', variant: 'outline' },
  active: { label: 'Live', variant: 'default' },
  ended: { label: 'Ended', variant: 'secondary' },
  error: { label: 'Error', variant: 'destructive' },
};

export function InterviewRoom({ interview, sessionId, candidateName, resumeText }: InterviewRoomProps) {
  const { callStatus, isMuted, isAISpeaking, messages, startCall, endCall, toggleMute } = useVapi();
  const { time, start: startTimer, stop: stopTimer } = useTimer();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const isEndingRef = useRef(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStart = useCallback(async () => {
    setHasStarted(true);
    await fetch('/api/sessions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, status: 'in_progress' }),
    });

    const config = buildVapiAssistantConfig({
      candidateName,
      jobRole: interview.role,
      experienceLevel: interview.experience_level,
      questions: interview.questions,
      resumeText,
    });

    await startCall(config);
    startTimer();
  }, [candidateName, interview, sessionId, startCall, startTimer, resumeText]);

  const handleEnd = useCallback(async () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;
    stopTimer();
    endCall();
    setIsSubmitting(true);

    try {
      const transcriptMessages = messages
        .filter((m: VapiMessage) => m.role && m.transcript)
        .map((m: VapiMessage) => ({ role: m.role as 'assistant' | 'user', message: m.transcript! }));

      if (transcriptMessages.length > 0) {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, messages: transcriptMessages }),
        });

        const feedbackRes = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (feedbackRes.ok) {
          toast.success('Interview completed! Generating your feedback...');
          router.push(`/interview/${interview.id}/complete?sessionId=${sessionId}`);
          return;
        }
      }

      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status: 'completed' }),
      });
      router.push(`/interview/${interview.id}/complete?sessionId=${sessionId}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [endCall, interview.id, messages, router, sessionId, stopTimer]);

  useEffect(() => {
    if ((callStatus === 'ended' || callStatus === 'error') && hasStarted && !isSubmitting) {
      handleEnd();
    }
  }, [callStatus, hasStarted, isSubmitting, handleEnd]);

  const statusInfo = statusConfig[callStatus];
  const isActive = callStatus === 'active';
  const candidateSpeaking = isActive && !isAISpeaking;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{interview.role}</p>
            <p className="text-xs text-slate-400 capitalize">{interview.experience_level} · {interview.interview_type}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={statusInfo.variant}
            className={cn(
              'text-xs px-3',
              callStatus === 'active' && 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40 animate-pulse'
            )}
          >
            {callStatus === 'active' && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            )}
            {statusInfo.label}
          </Badge>

          {isActive && (
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-300">
              <Clock className="h-3.5 w-3.5" />
              {time}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
        <div className="w-full max-w-3xl space-y-6">

          {/* Participant cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* AI Card */}
            <div className={cn(
              'relative overflow-hidden rounded-2xl border p-6 text-center transition-all duration-300',
              isAISpeaking
                ? 'border-primary/60 bg-primary/10 shadow-lg shadow-primary/20'
                : 'border-white/10 bg-white/5'
            )}>
              {isAISpeaking && (
                <>
                  <span className="absolute inset-0 animate-ping rounded-2xl ring-2 ring-primary/30 ring-offset-0" />
                  <span className="absolute inset-0 rounded-2xl ring-2 ring-primary/20" />
                </>
              )}
              <div className={cn(
                'relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-primary-foreground font-bold text-2xl transition-all duration-300',
                isAISpeaking
                  ? 'from-primary to-primary/70 scale-110 shadow-lg shadow-primary/30'
                  : 'from-slate-700 to-slate-600 text-slate-400'
              )}>
                AI
                {isAISpeaking && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-white">AI Interviewer</p>
              <p className={cn('mt-1 text-xs', isAISpeaking ? 'text-primary' : 'text-slate-500')}>
                {isAISpeaking ? '● Speaking...' : isActive ? '○ Listening' : '—'}
              </p>
            </div>

            {/* Candidate Card */}
            <div className={cn(
              'relative overflow-hidden rounded-2xl border p-6 text-center transition-all duration-300',
              candidateSpeaking
                ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                : 'border-white/10 bg-white/5'
            )}>
              {candidateSpeaking && (
                <span className="absolute inset-0 rounded-2xl ring-2 ring-emerald-500/20" />
              )}
              <div className={cn(
                'relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-bold transition-all duration-300',
                candidateSpeaking
                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-700 text-slate-300'
              )}>
                {getInitials(candidateName)}
              </div>
              <p className="text-sm font-semibold text-white truncate">{candidateName}</p>
              <p className={cn('mt-1 text-xs', candidateSpeaking ? 'text-emerald-400' : isMuted ? 'text-red-400' : 'text-slate-500')}>
                {isMuted ? '✕ Muted' : candidateSpeaking ? '● Speaking...' : isActive ? '○ Listening' : '—'}
              </p>
            </div>
          </div>

          {/* Live transcript */}
          {messages.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Transcript</p>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <div
                ref={transcriptRef}
                className="max-h-44 overflow-y-auto p-4 space-y-3 scrollbar-thin"
              >
                {messages.map((m: VapiMessage, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm',
                      m.role === 'assistant'
                        ? 'bg-white/10 text-slate-200 mr-auto'
                        : 'bg-primary/20 text-primary-foreground/90 ml-auto text-right'
                    )}
                  >
                    <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                      {m.role === 'assistant' ? 'AI Interviewer' : candidateName}
                    </p>
                    {m.transcript}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {callStatus === 'idle' && (
              <Button
                size="lg"
                className="gap-2 px-10 h-12 rounded-full shadow-lg shadow-primary/30"
                onClick={handleStart}
              >
                <Mic className="h-5 w-5" />
                Start Interview
              </Button>
            )}

            {callStatus === 'connecting' && (
              <Button size="lg" disabled className="gap-2 px-10 h-12 rounded-full">
                <LoadingSpinner size="sm" />
                Connecting...
              </Button>
            )}

            {isActive && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    'h-12 w-12 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20',
                    isMuted && 'border-red-500/50 bg-red-500/20 text-red-400'
                  )}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  className="h-14 w-14 rounded-full shadow-lg shadow-red-500/30"
                  onClick={handleEnd}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <LoadingSpinner size="sm" /> : <PhoneOff className="h-5 w-5" />}
                </Button>
              </div>
            )}

            {(callStatus === 'ended' || callStatus === 'error') && (
              <div className="flex items-center gap-3 text-slate-400">
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="text-sm">Generating feedback...</span>
                  </>
                ) : (
                  <span className="text-sm">Interview {callStatus}</span>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-slate-500">
            {isActive
              ? 'Press the red button to end the interview when done'
              : callStatus === 'idle'
              ? 'Ensure your microphone is enabled before starting'
              : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
