'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createInterviewSchema, CreateInterviewInput } from '@/lib/validations';
import { useInterview } from '@/hooks/useInterview';
import {
  EXPERIENCE_LEVELS,
  DIFFICULTY_LEVELS,
  INTERVIEW_TYPES,
  INTERVIEW_DURATIONS,
} from '@/constants';

export function CreateInterviewForm() {
  const { isLoading, createInterview } = useInterview();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateInterviewInput>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: {
      duration: 30,
    },
  });

  const onSubmit = async (data: CreateInterviewInput) => {
    await createInterview(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="role">Job Role *</Label>
        <Input
          id="role"
          placeholder="e.g. Senior React Developer"
          {...register('role')}
          disabled={isLoading}
        />
        {errors.role && (
          <p className="text-xs text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe the role, required skills, and responsibilities..."
          rows={5}
          {...register('description')}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Experience Level *</Label>
          <Select
            onValueChange={(v) => setValue('experience_level', v as CreateInterviewInput['experience_level'])}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.experience_level && (
            <p className="text-xs text-destructive">{errors.experience_level.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Difficulty *</Label>
          <Select
            onValueChange={(v) => setValue('difficulty', v as CreateInterviewInput['difficulty'])}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_LEVELS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.difficulty && (
            <p className="text-xs text-destructive">{errors.difficulty.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Interview Type *</Label>
          <Select
            onValueChange={(v) => setValue('interview_type', v as CreateInterviewInput['interview_type'])}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {INTERVIEW_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.interview_type && (
            <p className="text-xs text-destructive">{errors.interview_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Duration *</Label>
          <Select
            defaultValue="30"
            onValueChange={(v) => setValue('duration', Number(v))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {INTERVIEW_DURATIONS.map((d) => (
                <SelectItem key={d.value} value={String(d.value)}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2" disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating AI Interview...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate AI Interview
          </>
        )}
      </Button>
    </form>
  );
}
