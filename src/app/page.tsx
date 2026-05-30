import Link from 'next/link';
import { Bot, Mic, Zap, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Zap,
    title: 'AI Question Generation',
    description: 'GPT-4o generates role-specific interview questions tailored to experience level and job requirements.',
  },
  {
    icon: Mic,
    title: 'Real-Time Voice Interviews',
    description: 'Candidates speak naturally with an AI interviewer powered by Vapi. No scripts, no awkward silence.',
  },
  {
    icon: BarChart3,
    title: 'Instant Feedback Reports',
    description: 'Get detailed scores on technical skills, communication, confidence, and problem-solving.',
  },
  {
    icon: Users,
    title: 'Shareable Interview Links',
    description: 'Generate a unique link per interview. Send to candidates — they join with a single click.',
  },
];

const benefits = [
  'Reduce time-to-hire by 60%',
  'Consistent interview quality across all candidates',
  'AI-powered scoring and recommendations',
  'No scheduling conflicts — interviews run 24/7',
  'Detailed feedback for every candidate',
  'Easy recruiter dashboard',
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="border-b bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">AI Recruiter</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Powered by GPT-4o + Vapi Voice AI
          </div>
          <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-bold tracking-tight leading-tight lg:text-6xl">
            AI Interviews That Actually{' '}
            <span className="text-primary">Feel Human</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Create AI-powered voice interviews in minutes. Candidates speak naturally with your AI interviewer,
            and you get instant, detailed feedback reports — no scheduling, no bias.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button size="lg" className="gap-2 px-8">
                Start Hiring Smarter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Everything you need to hire faster</h2>
            <p className="mt-3 text-muted-foreground">
              From question generation to candidate scoring — all in one platform.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">How it works</h2>
              <p className="mt-3 text-muted-foreground mb-8">
                Set up an AI interview in 3 steps and start evaluating candidates today.
              </p>
              <ol className="space-y-6">
                {[
                  { step: '01', title: 'Create an Interview', desc: 'Enter the job role, description, and requirements. AI generates tailored questions automatically.' },
                  { step: '02', title: 'Share the Link', desc: 'Copy the unique interview link and send it to your candidates via email or job board.' },
                  { step: '03', title: 'Review Feedback', desc: 'After the AI interview, get a detailed report with scores and a hire/reject recommendation.' },
                ].map((item) => (
                  <li key={item.step} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <h3 className="mb-6 font-semibold text-lg">Why teams love AI Recruiter</h3>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to transform your hiring?</h2>
          <p className="mt-4 text-primary-foreground/80">
            Join hundreds of recruiters using AI to hire smarter, faster, and fairer.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 gap-2 px-10"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Bot className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">AI Recruiter</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AI Recruiter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
