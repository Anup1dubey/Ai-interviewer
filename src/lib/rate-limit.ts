const store = new Map<string, { count: number; resetAt: number }>();

function cleanStore() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  if (store.size > 10_000) cleanStore();

  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) return { allowed: false, remaining: 0 };

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export function getClientIp(req: Request): string {
  const forwarded = (req.headers as Headers).get('x-forwarded-for');
  return forwarded?.split(',')[0].trim() ?? 'unknown';
}
