// Simple in-memory rate limiter
// For production scale, replace with Upstash Redis or similar
// This works for single-instance deployments and Vercel functions (per-instance)

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically (only in long-running processes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of buckets.entries()) {
      if (entry.resetAt < now) buckets.delete(key);
    }
  }, 60_000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(identifier);

  if (!entry || entry.resetAt < now) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Pre-configured limiters for different endpoints.
// In test/development, limits are relaxed to avoid blocking E2E tests.
const isTest = process.env.NODE_ENV === "test" || process.env.PLAYWRIGHT === "1";
const multiplier = isTest ? 100 : 1;

export const authRateLimit = (id: string) => rateLimit(`auth:${id}`, 5 * multiplier, 15 * 60 * 1000);
export const registerRateLimit = (id: string) => rateLimit(`register:${id}`, 3 * multiplier, 60 * 60 * 1000);
export const searchRateLimit = (id: string) => rateLimit(`search:${id}`, 30 * multiplier, 60 * 1000);

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
