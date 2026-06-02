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
import { EXPERIENCE_LEVELS, DIFFICULTY_LEVELS, INTERVIEW_TYPES, INTERVIEW_DURATIONS } from '@/constants';
import { TemplateSelector } from './TemplateSelector';
import { InterviewTemplate } from '@/constants/templates';

export function CreateInterviewForm() {
  const { isLoading, createInterview } = useInterview();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateInterviewInput>({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: { duration: 30 },
  });

  const handleTemplateSelect = (template: InterviewTemplate) => {
    reset({
      role: template.role,
      description: template.description,
      experience_level: template.experience_level,
      difficulty: template.difficulty,
      duration: template.duration,
      interview_type: template.interview_type,
    });
  };

  const onSubmit = async (data: CreateInterviewInput) => {
    await createInterview(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TemplateSelector onSelect={handleTemplateSelect} />

      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role Details</p>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium">Job Title <span className="text-destructive">*</span></Label>
          <Input
            id="role"
            placeholder="e.g. Senior React Developer"
            {...register('role')}
            disabled={isLoading}
          />
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">Job Description <span className="text-destructive">*</span></Label>
          <Textarea
            id="description"
            placeholder="Describe responsibilities, required skills, and what you're looking for in a candidate..."
            rows={5}
            {...register('description')}
            disabled={isLoading}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interview Settings</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Experience Level <span className="text-destructive">*</span></Label>
            <Select
              onValueChange={(v) => setValue('experience_level', v as CreateInterviewInput['experience_level'])}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.experience_level && <p className="text-xs text-destructive">{errors.experience_level.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Difficulty <span className="text-destructive">*</span></Label>
            <Select
              onValueChange={(v) => setValue('difficulty', v as CreateInterviewInput['difficulty'])}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.difficulty && <p className="text-xs text-destructive">{errors.difficulty.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Interview Type <span className="text-destructive">*</span></Label>
            <Select
              onValueChange={(v) => setValue('interview_type', v as CreateInterviewInput['interview_type'])}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {INTERVIEW_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.interview_type && <p className="text-xs text-destructive">{errors.interview_type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Duration <span className="text-destructive">*</span></Label>
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
                  <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2 h-11" disabled={isLoading} size="lg">
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
