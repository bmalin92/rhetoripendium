import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import type { Evaluation } from "@/lib/evaluation/schema";
import { SESSION_COOKIE } from "@/lib/session";

export interface SubmissionView {
  id: string;
  text: string;
  evaluation: Evaluation;
  submittedAt: string;
}

async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function getCompletedLessonIds(): Promise<string[]> {
  const sessionId = await getSessionId();
  if (!sessionId) return [];

  const rows = await prisma.completedLesson.findMany({
    where: { sessionId },
    select: { lessonId: true },
  });
  return rows.map((r) => r.lessonId);
}

export async function getSubmissionHistoryByPrompt(
  promptIds: string[]
): Promise<Record<string, SubmissionView[]>> {
  const sessionId = await getSessionId();
  if (!sessionId || promptIds.length === 0) return {};

  const rows = await prisma.submission.findMany({
    where: { sessionId, promptId: { in: promptIds } },
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
