import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateInterviewForm } from '@/components/dashboard/CreateInterviewForm';

export default function CreateInterviewPage() {
  return (
    <div className="p-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Create AI Interview</h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details and AI will generate interview questions for you.
            </p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Interview Details</CardTitle>
            <CardDescription>
              The more context you provide, the better questions the AI will generate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateInterviewForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
