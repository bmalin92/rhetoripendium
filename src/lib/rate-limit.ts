import { prisma } from "@/lib/db";
import type { Identity } from "@/lib/identity";

const IDENTITY_RATE_LIMIT_MAX_SUBMISSIONS = 5;
const IP_RATE_LIMIT_MAX_SUBMISSIONS = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// Fails open on a DB error — a transient hiccup here must never block a
// legitimate submission, matching this route's existing persistence
// try/catch philosophy.
//
// Two independent axes: identity (userId/sessionId) catches normal reuse;
// IP address catches a client that drops its session cookie between
// requests to obtain a fresh, zero-count identity each time. The IP
// threshold is deliberately looser than the identity one, since one IP can
// legitimately represent several real users behind shared NAT.
export async function checkRateLimit(
  identity: Identity,
  ipAddress: string | null
): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  try {
    if (identity) {
      const identityWhere =
        identity.type === "user" ? { userId: identity.id } : { sessionId: identity.id };

      const identityCount = await prisma.submission.count({
        where: {
          ...identityWhere,
          submittedAt: { gte: windowStart },
        },
      });

      if (identityCount >= IDENTITY_RATE_LIMIT_MAX_SUBMISSIONS) {
        return false;
      }
    }

    if (ipAddress) {
      const ipCount = await prisma.submission.count({
        where: {
          ipAddress,
          submittedAt: { gte: windowStart },
        },
      });

      if (ipCount >= IP_RATE_LIMIT_MAX_SUBMISSIONS) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Rate limit check failed", error);
    return true;
  }
}
