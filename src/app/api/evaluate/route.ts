import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getPromptWithContext } from "@/lib/data/lessons";
import { evaluateSubmission } from "@/lib/claude";
import { SESSION_COOKIE } from "@/lib/session";

const requestSchema = z.object({
  promptId: z.string().min(1),
  submission: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { promptId, submission } = parsed.data;

  const prompt = await getPromptWithContext(promptId);
  if (!prompt) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let evaluation;
  try {
    evaluation = await evaluateSubmission({
      lessonTitle: prompt.lesson.title,
      deviceNames: prompt.lesson.devices.map((ld) => ld.device.name),
      promptText: prompt.prompt,
      promptInstructions: prompt.instructions,
      criteria: prompt.criteria.map((c) => ({
        key: c.key,
        label: c.label,
        description: c.description,
      })),
      submission,
    });
  } catch (error) {
    console.error("Evaluation failed", error);
    return NextResponse.json(
      { error: "evaluation_failed", detail: "Failed to evaluate submission." },
      { status: 502 }
    );
  }

  let lessonCompleted: boolean | undefined;
  try {
    const store = await cookies();
    const sessionId = store.get(SESSION_COOKIE)?.value;

    if (sessionId) {
      await prisma.session.upsert({
        where: { id: sessionId },
        create: { id: sessionId },
        update: { lastSeenAt: new Date() },
      });

      await prisma.submission.create({
        data: { sessionId, promptId, text: submission, evaluation },
      });

      const lessonPromptIds = prompt.lesson.prompts.map((p) => p.id);
      const submitted = await prisma.submission.findMany({
        where: { sessionId, promptId: { in: lessonPromptIds } },
        distinct: ["promptId"],
        select: { promptId: true },
      });
      const submittedIds = new Set(submitted.map((s) => s.promptId));
      lessonCompleted = lessonPromptIds.every((id) => submittedIds.has(id));

      if (lessonCompleted) {
        await prisma.completedLesson.upsert({
          where: { sessionId_lessonId: { sessionId, lessonId: prompt.lesson.id } },
          create: { sessionId, lessonId: prompt.lesson.id },
          update: {},
        });
      }
    }
  } catch (error) {
    // A transient DB hiccup shouldn't discard an evaluation the user already
    // paid Claude API cost for — log it and return the evaluation anyway.
    console.error("Progress persistence failed", error);
    lessonCompleted = undefined;
  }

  return NextResponse.json({ evaluation, lessonCompleted });
}
