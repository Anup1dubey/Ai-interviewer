'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ResumeProfile } from '@/types';

interface ResumeUploadProps {
  onParsed: (resumeText: string, profile: ResumeProfile) => void;
  onClear: () => void;
}

export function ResumeUpload({ onParsed, onClear }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selected: File) => {
    if (!selected.name.endsWith('.pdf') && selected.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }

    setFile(selected);
    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', selected);

      const res = await fetch('/api/resume', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to process resume');
      }

      const { resumeText, profile: parsedProfile } = await res.json();
      setProfile(parsedProfile);
      setStatus('done');
      onParsed(resumeText, parsedProfile);
      toast.success('Resume parsed successfully!');
    } catch (err) {
      console.error(err);
      setStatus('error');
      toast.error(err instanceof Error ? err.message : 'Failed to parse resume');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped);
  };

  const handleClear = () => {
    setFile(null);
    setProfile(null);
    setStatus('idle');
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  if (status === 'done' && profile) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Resume Parsed
            </span>
          </div>
          <button onClick={handleClear} className="text-emerald-600 hover:text-emerald-800 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-2">{file?.name}</p>
        {profile.summary && (
          <p className="text-xs text-emerald-700 dark:text-emerald-400 line-clamp-2 leading-relaxed">
            {profile.summary}
          </p>
        )}
        {profile.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {profile.skills.slice(0, 5).map((skill) => (
              <span key={skill} className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                {skill}
              </span>
            ))}
            {profile.skills.length > 5 && (
              <span className="text-[11px] text-emerald-600">+{profile.skills.length - 5} more</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={status === 'uploading'}
      />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all',
          dragOver ? 'border-primary/70 bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/50',
          status === 'uploading' && 'pointer-events-none opacity-60'
        )}
      >
        {status === 'uploading' ? (
          <>
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Parsing resume with AI...</p>
          </>
        ) : status === 'error' ? (
          <>
            <FileText className="h-7 w-7 text-destructive" />
            <p className="text-sm font-medium text-destructive">Failed to parse. Try again.</p>
          </>
        ) : (
          <>
            <Upload className="h-7 w-7 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Upload resume <span className="text-muted-foreground font-normal">(optional)</span></p>
              <p className="text-xs text-muted-foreground mt-0.5">PDF · Max 5MB · Personalizes interview questions</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
