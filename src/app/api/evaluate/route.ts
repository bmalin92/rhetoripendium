import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getPromptWithContext } from "@/lib/data/lessons";
import { evaluateSubmission } from "@/lib/claude";
import { getIdentity } from "@/lib/identity";
import { checkRateLimit } from "@/lib/rate-limit";

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

  const identity = await getIdentity();
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0]?.trim() || null : null;

  const withinRateLimit = await checkRateLimit(identity, ipAddress);
  if (!withinRateLimit) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "You've submitted a lot in the last few minutes — try again shortly.",
      },
      { status: 429 }
    );
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
    if (identity) {
      if (identity.type === "session") {
        await prisma.session.upsert({
          where: { id: identity.id },
          create: { id: identity.id },
          update: { lastSeenAt: new Date() },
        });
      }

      const identityWhere =
        identity.type === "user" ? { userId: identity.id } : { sessionId: identity.id };

      await prisma.submission.create({
        data: { ...identityWhere, promptId, text: submission, evaluation, ipAddress },
      });

      const lessonPromptIds = prompt.lesson.prompts.map((p) => p.id);
      const submitted = await prisma.submission.findMany({
        where: { ...identityWhere, promptId: { in: lessonPromptIds } },
        distinct: ["promptId"],
        select: { promptId: true },
      });
      const submittedIds = new Set(submitted.map((s) => s.promptId));
      lessonCompleted = lessonPromptIds.every((id) => submittedIds.has(id));

      if (lessonCompleted) {
        if (identity.type === "user") {
          await prisma.completedLesson.upsert({
            where: { userId_lessonId: { userId: identity.id, lessonId: prompt.lesson.id } },
            create: { userId: identity.id, lessonId: prompt.lesson.id },
            update: {},
          });
        } else {
          await prisma.completedLesson.upsert({
            where: { sessionId_lessonId: { sessionId: identity.id, lessonId: prompt.lesson.id } },
            create: { sessionId: identity.id, lessonId: prompt.lesson.id },
            update: {},
          });
        }
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
