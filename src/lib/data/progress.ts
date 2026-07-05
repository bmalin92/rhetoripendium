import { prisma } from "@/lib/db";
import type { Evaluation } from "@/lib/evaluation/schema";
import { getIdentity } from "@/lib/identity";

export interface SubmissionView {
  id: string;
  text: string;
  evaluation: Evaluation;
  submittedAt: string;
}

export async function getCompletedLessonIds(): Promise<string[]> {
  const identity = await getIdentity();
  if (!identity) return [];

  const where = identity.type === "user" ? { userId: identity.id } : { sessionId: identity.id };

  const rows = await prisma.completedLesson.findMany({
    where,
    select: { lessonId: true },
  });
  return rows.map((r) => r.lessonId);
}

export async function getSubmissionHistoryByPrompt(
  promptIds: string[]
): Promise<Record<string, SubmissionView[]>> {
  const identity = await getIdentity();
  if (!identity || promptIds.length === 0) return {};

  const where =
    identity.type === "user"
      ? { userId: identity.id, promptId: { in: promptIds } }
      : { sessionId: identity.id, promptId: { in: promptIds } };

  const rows = await prisma.submission.findMany({
    where,
    orderBy: { submittedAt: "desc" },
  });

  const result: Record<string, SubmissionView[]> = {};
  for (const row of rows) {
    const list = result[row.promptId] ?? [];
    list.push({
      id: row.id,
      text: row.text,
      evaluation: row.evaluation as Evaluation,
      submittedAt: row.submittedAt.toISOString(),
    });
    result[row.promptId] = list;
  }
  return result;
}
