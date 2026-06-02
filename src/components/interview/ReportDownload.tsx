'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Feedback, InterviewSession } from '@/types';
import { getScoreLabel } from '@/constants';

interface ReportDownloadProps {
  feedback: Feedback;
  session: InterviewSession;
}

export function ReportDownload({ feedback, session }: ReportDownloadProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const interview = session.interview;
      const overallScore = Math.round(
        (feedback.technical_score + feedback.communication_score +
          feedback.problem_solving_score + feedback.confidence_score) / 4
      );

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Interview Report — ${session.candidate_name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; padding: 40px; max-width: 760px; margin: 0 auto; }
  .header { border-bottom: 3px solid #5b21b6; padding-bottom: 24px; margin-bottom: 32px; }
  .brand { font-size: 13px; font-weight: 700; color: #7c3aed; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 16px; }
  h1 { font-size: 28px; font-weight: 700; color: #111; margin-bottom: 4px; }
  .subtitle { color: #6b7280; font-size: 14px; }
  .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 28px 0; }
  .meta-item { background: #f8f7ff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; }
  .meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; font-weight: 600; margin-bottom: 4px; }
  .meta-value { font-size: 14px; font-weight: 600; color: #111; }
  .score-banner { background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; border-radius: 14px; padding: 24px 28px; margin: 28px 0; display: flex; align-items: center; justify-content: space-between; }
  .score-number { font-size: 52px; font-weight: 800; line-height: 1; }
  .score-label { font-size: 14px; opacity: 0.85; margin-top: 4px; }
  .recommendation { display: inline-block; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 999px; padding: 6px 16px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  h2 { font-size: 16px; font-weight: 700; margin: 28px 0 14px; color: #111; display: flex; align-items: center; gap: 8px; }
  h2::before { content: ''; display: inline-block; width: 4px; height: 16px; background: #7c3aed; border-radius: 2px; }
  .score-row { margin-bottom: 12px; }
  .score-row-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 13px; }
  .score-row-label { font-weight: 500; color: #374151; }
  .score-row-value { font-weight: 700; }
  .bar-track { background: #f3f4f6; border-radius: 999px; height: 7px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #7c3aed, #a855f7); }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 8px; }
  .list-card { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
  .list-card h3 { font-size: 13px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #374151; }
  ul { padding-left: 0; list-style: none; }
  li { font-size: 13px; color: #4b5563; padding: 4px 0; padding-left: 16px; position: relative; }
  li::before { content: '•'; position: absolute; left: 0; color: #7c3aed; }
  .summary-box { background: #f8f7ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 16px; margin-top: 8px; font-size: 13px; line-height: 1.7; color: #374151; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div class="brand">AI Recruiter Platform</div>
  <h1>${session.candidate_name}</h1>
  <p class="subtitle">${interview?.role ?? 'Interview'} · ${interview?.experience_level ?? ''} level · Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
</div>

<div class="meta-grid">
  <div class="meta-item"><div class="meta-label">Role</div><div class="meta-value">${interview?.role ?? '—'}</div></div>
  <div class="meta-item"><div class="meta-label">Interview Type</div><div class="meta-value" style="text-transform:capitalize">${interview?.interview_type ?? '—'}</div></div>
  <div class="meta-item"><div class="meta-label">Difficulty</div><div class="meta-value" style="text-transform:capitalize">${interview?.difficulty ?? '—'}</div></div>
</div>

<div class="score-banner">
  <div>
    <div class="score-number">${overallScore}</div>
    <div class="score-label">${getScoreLabel(overallScore)} · Overall Score</div>
  </div>
  <div class="recommendation">${feedback.recommendation}</div>
</div>

<h2>Score Breakdown</h2>
${[
  { label: 'Technical Skills', score: feedback.technical_score },
  { label: 'Communication', score: feedback.communication_score },
  { label: 'Problem Solving', score: feedback.problem_solving_score },
  { label: 'Confidence', score: feedback.confidence_score },
].map(({ label, score }) => `
<div class="score-row">
  <div class="score-row-header">
    <span class="score-row-label">${label}</span>
    <span class="score-row-value">${score}/100</span>
  </div>
  <div class="bar-track"><div class="bar-fill" style="width:${score}%"></div></div>
</div>`).join('')}

<h2>Strengths & Areas to Improve</h2>
<div class="two-col">
  <div class="list-card">
    <h3>✓ Strengths</h3>
    <ul>${(feedback.strengths ?? []).map((s) => `<li>${s}</li>`).join('')}</ul>
  </div>
  <div class="list-card">
    <h3>△ Areas to Improve</h3>
    <ul>${(feedback.weaknesses ?? []).map((w) => `<li>${w}</li>`).join('')}</ul>
  </div>
</div>

${feedback.summary ? `
<h2>Summary</h2>
<div class="summary-box">${feedback.summary}</div>
` : ''}

<div class="footer">
  <span>AI Recruiter — Automated Candidate Assessment</span>
  <span>Confidential</span>
</div>
</body>
</html>`;

      const win = window.open('', '_blank');
      if (!win) { setLoading(false); return; }
      win.document.write(html);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Download Report
    </Button>
  );
}
