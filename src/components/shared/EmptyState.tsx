import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
        <Icon className="h-9 w-9 text-primary/60" />
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
