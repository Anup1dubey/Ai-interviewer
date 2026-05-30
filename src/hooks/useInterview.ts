'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UseInterviewReturn {
  isLoading: boolean;
  createInterview: (data: object) => Promise<void>;
}

export function useInterview(): UseInterviewReturn {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createInterview = async (data: object) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create interview');
      }

      const { interviewId } = await response.json();
      toast.success('Interview created successfully!');
      router.push(`/dashboard/interview/${interviewId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, createInterview };
}
