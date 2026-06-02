import { NextRequest, NextResponse } from 'next/server';
import { createRequire } from 'module';
import { generateResumeProfile } from '@/services/ai.service';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// Load lib/pdf-parse.js directly to bypass the module.parent test-file guard in index.js
const _require = createRequire(import.meta.url);
const pdfParse = _require('pdf-parse/lib/pdf-parse.js') as (
  buffer: Buffer,
  options?: object
) => Promise<{ text: string; numpages: number; info: object }>;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`resume:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text?.trim() ?? '';

    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF. Please ensure it contains selectable text (not a scanned image).' },
        { status: 422 }
      );
    }

    const profile = await generateResumeProfile(rawText);

    const resumeText = [
      profile.skills.length ? `Skills: ${profile.skills.join(', ')}` : '',
      profile.experience.length ? `Experience: ${profile.experience.join(' | ')}` : '',
      profile.projects.length ? `Projects: ${profile.projects.join(' | ')}` : '',
      profile.education.length ? `Education: ${profile.education.join(' | ')}` : '',
      profile.summary ? `Summary: ${profile.summary}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return NextResponse.json({ profile, resumeText });
  } catch (error) {
    console.error('Resume parse error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
  }
}
