'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { VapiMessage } from '@/types';

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';

interface UseVapiReturn {
  callStatus: CallStatus;
  isMuted: boolean;
  isAISpeaking: boolean;
  messages: VapiMessage[];
  volumeLevel: number;
  startCall: (assistantConfig: object) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
}

export function useVapi(): UseVapiReturn {
  const vapiRef = useRef<Vapi | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [messages, setMessages] = useState<VapiMessage[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on('call-start', () => setCallStatus('active'));
    vapi.on('call-end', () => setCallStatus('ended'));
    vapi.on('speech-start', () => setIsAISpeaking(true));
    vapi.on('speech-end', () => setIsAISpeaking(false));
    vapi.on('volume-level', (level: number) => setVolumeLevel(level));

    vapi.on('message', (message: VapiMessage) => {
      if (
        message.type === 'transcript' &&
        message.transcriptType === 'final'
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    vapi.on('error', (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as { message: unknown }).message)
          : JSON.stringify(error);

      // Vapi fires this when the AI finishes the call — it's a normal end, not a real error
      if (message.includes('Meeting has ended') || message.includes('ejection')) {
        return;
      }

      console.error('Vapi error:', message || error);
      setCallStatus('error');
    });

    return () => {
      vapi.stop();
      vapiRef.current = null;
    };
  }, []);

  const startCall = useCallback(async (assistantConfig: object) => {
    if (!vapiRef.current) return;
    setCallStatus('connecting');
    setMessages([]);
    try {
      await vapiRef.current.start(assistantConfig as Parameters<Vapi['start']>[0]);
    } catch (err) {
      console.error('Failed to start call:', err);
      setCallStatus('error');
    }
  }, []);

  const endCall = useCallback(() => {
    vapiRef.current?.stop();
    setCallStatus('ended');
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  return {
    callStatus,
    isMuted,
    isAISpeaking,
    messages,
    volumeLevel,
    startCall,
    endCall,
    toggleMute,
  };
}
