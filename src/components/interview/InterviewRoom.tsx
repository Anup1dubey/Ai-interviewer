'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, PhoneOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

  return { time: formatTime(seconds), start: () => setRunning(true), stop: () => setRunning(false) };
}

const statusLabels: Record<CallStatus, string> = {
  idle: 'Ready to start',
  connecting: 'Connecting...',
  active: 'Interview in progress',
  ended: 'Interview ended',
  error: 'Connection error',
};

export function InterviewRoom({ interview, sessionId, candidateName }: InterviewRoomProps) {
  const { callStatus, isMuted, isAISpeaking, messages, volumeLevel, startCall, endCall, toggleMute } = useVapi();
  const { time, start: startTimer, stop: stopTimer } = useTimer();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const isEndingRef = useRef(false);

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
    });

    await startCall(config);
    startTimer();
  }, [candidateName, interview, sessionId, startCall, startTimer]);

  const handleEnd = useCallback(async () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    stopTimer();
    endCall();
    setIsSubmitting(true);

    try {
      // Save transcript messages
      const transcriptMessages = messages
        .filter((m: VapiMessage) => m.role && m.transcript)
        .map((m: VapiMessage) => ({
          role: m.role as 'assistant' | 'user',
          message: m.transcript!,
        }));

      if (transcriptMessages.length > 0) {
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, messages: transcriptMessages }),
        });

        // Generate feedback
        const feedbackRes = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        if (feedbackRes.ok) {
          toast.success('Interview completed! Generating feedback...');
          router.push(`/interview/${interview.id}/complete?sessionId=${sessionId}`);
          return;
        }
      }

      // No transcript - just mark as completed
      await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status: 'completed' }),
      });
      router.push(`/interview/${interview.id}/complete?sessionId=${sessionId}`);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [endCall, interview.id, messages, router, sessionId, stopTimer]);

  // Auto-end when call ends or errors out
  useEffect(() => {
    if ((callStatus === 'ended' || callStatus === 'error') && hasStarted && !isSubmitting) {
      handleEnd();
    }
  }, [callStatus, hasStarted, isSubmitting, handleEnd]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold">{interview.role} Interview</h1>
          <div className="flex items-center justify-center gap-3">
            <Badge variant={callStatus === 'active' ? 'default' : 'secondary'}>
              {statusLabels[callStatus]}
            </Badge>
            {callStatus === 'active' && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {time}
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* AI Interviewer */}
          <Card className={cn(
            'transition-all',
            isAISpeaking && 'ring-2 ring-primary shadow-lg shadow-primary/10'
          )}>
            <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
              <div className={cn(
                'relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold transition-all',
                isAISpeaking && 'animate-pulse scale-110'
              )}>
                AI
                {isAISpeaking && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
                  </span>
                )}
              </div>
              <div className="text-center">
                <p className="font-medium">AI Interviewer</p>
                <p className="text-xs text-muted-foreground">
                  {isAISpeaking ? 'Speaking...' : 'Listening...'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Candidate */}
          <Card className={cn(
            'transition-all',
            callStatus === 'active' && !isAISpeaking && 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10'
          )}>
            <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
              <Avatar className="h-20 w-20 text-xl">
                <AvatarFallback className="bg-muted text-foreground text-2xl font-bold">
                  {getInitials(candidateName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{candidateName}</p>
                <p className="text-xs text-muted-foreground">
                  {isMuted ? 'Muted' : callStatus === 'active' ? 'Your turn' : 'Candidate'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transcript */}
        {messages.length > 0 && (
          <Card>
            <CardContent className="pt-4 pb-3 max-h-40 overflow-y-auto space-y-2">
              {messages.slice(-4).map((m: VapiMessage, i: number) => (
                <div
                  key={i}
                  className={cn(
                    'text-sm px-3 py-1.5 rounded-lg max-w-[85%]',
                    m.role === 'assistant'
                      ? 'bg-muted ml-0'
                      : 'bg-primary/10 ml-auto text-right'
                  )}
                >
                  <span className="text-xs text-muted-foreground block mb-0.5">
                    {m.role === 'assistant' ? 'AI Interviewer' : candidateName}
                  </span>
                  {m.transcript}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {callStatus === 'idle' && (
            <Button
              size="lg"
              className="px-10 gap-2"
              onClick={handleStart}
            >
              <Mic className="h-4 w-4" />
              Start Interview
            </Button>
          )}

          {callStatus === 'connecting' && (
            <Button size="lg" disabled className="px-10 gap-2">
              <LoadingSpinner size="sm" />
              Connecting...
            </Button>
          )}

          {callStatus === 'active' && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5 text-destructive" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="icon"
                className="h-14 w-14 rounded-full"
                onClick={handleEnd}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <PhoneOff className="h-5 w-5" />
                )}
              </Button>
            </>
          )}

          {(callStatus === 'ended' || callStatus === 'error') && (
            <div className="text-center">
              {isSubmitting ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LoadingSpinner size="sm" />
                  Generating feedback...
                </div>
              ) : (
                <p className="text-muted-foreground">Interview {callStatus}</p>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {callStatus === 'active'
            ? 'Click the red button to end the interview'
            : 'Make sure your microphone is enabled'}
        </p>
      </div>
    </div>
  );
}
