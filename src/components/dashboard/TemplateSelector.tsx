'use client';

import { useState } from 'react';
import { INTERVIEW_TEMPLATES, InterviewTemplate } from '@/constants/templates';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  onSelect: (template: InterviewTemplate) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (template: InterviewTemplate) => {
    setSelected(template.id);
    onSelect(template);
    setOpen(false);
  };

  return (
    <div className="mb-6">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between gap-2 border-dashed"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <LayoutTemplate className="h-4 w-4" />
          {selected
            ? `Template: ${INTERVIEW_TEMPLATES.find((t) => t.id === selected)?.name}`
            : 'Start from a template (optional)'}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </Button>

      {open && (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border bg-card p-3 shadow-md">
          {INTERVIEW_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleSelect(template)}
              className={cn(
                'flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted',
                selected === template.id && 'bg-primary/5 ring-1 ring-primary/30'
              )}
            >
              <span className="mt-0.5 text-xl">{template.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">{template.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground capitalize">{template.tag}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
