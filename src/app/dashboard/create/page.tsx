import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateInterviewForm } from '@/components/dashboard/CreateInterviewForm';

export default function CreateInterviewPage() {
  return (
    <div className="p-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create AI Interview</h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details — AI will generate tailored questions instantly.
            </p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Interview Details</CardTitle>
            <CardDescription>
              The more specific your description, the better the questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <CreateInterviewForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
