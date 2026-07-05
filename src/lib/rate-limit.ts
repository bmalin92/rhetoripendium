import { prisma } from "@/lib/db";
import type { Identity } from "@/lib/identity";

const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// Fails open on a DB error — a transient hiccup here must never block a
// legitimate submission, matching this route's existing persistence
// try/catch philosophy.
export async function checkRateLimit(identity: Identity): Promise<boolean> {
  if (!identity) {
    return true;
  }

  const identityWhere =
    identity.type === "user" ? { userId: identity.id } : { sessionId: identity.id };

  try {
    const count = await prisma.submission.count({
      where: {
        ...identityWhere,
        submittedAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
      },
    });

    return count < RATE_LIMIT_MAX_SUBMISSIONS;
  } catch (error) {
    console.error("Rate limit check failed", error);
    return true;
  }
}
