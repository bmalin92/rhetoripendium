import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session";

export async function mergeAnonymousProgress(userId: string): Promise<void> {
  try {
    const store = await cookies();
    const sessionId = store.get(SESSION_COOKIE)?.value;
    if (!sessionId) return;

    await prisma.$transaction(async (tx) => {
      await tx.submission.updateMany({
        where: { sessionId },
        data: { userId, sessionId: null },
      });

      const anonCompletions = await tx.completedLesson.findMany({
        where: { sessionId },
        select: { id: true, lessonId: true },
      });
      if (anonCompletions.length === 0) return;

      const existingUserLessonIds = new Set(
        (
          await tx.completedLesson.findMany({
            where: { userId },
            select: { lessonId: true },
          })
        ).map((c) => c.lessonId)
      );

      const toReassign = anonCompletions.filter((c) => !existingUserLessonIds.has(c.lessonId));
      const toDelete = anonCompletions.filter((c) => existingUserLessonIds.has(c.lessonId));

      if (toReassign.length > 0) {
        await tx.completedLesson.updateMany({
          where: { id: { in: toReassign.map((c) => c.id) } },
          data: { userId, sessionId: null },
        });
      }
      if (toDelete.length > 0) {
        await tx.completedLesson.deleteMany({
          where: { id: { in: toDelete.map((c) => c.id) } },
        });
      }
    });
  } catch (error) {
    console.error("Anonymous progress merge failed", error);
  }
}
