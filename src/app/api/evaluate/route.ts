import { NextResponse } from "next/server";
import { z } from "zod";

import { getPromptWithContext } from "@/lib/data/lessons";
import { evaluateSubmission } from "@/lib/claude";

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

  try {
    const evaluation = await evaluateSubmission({
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

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Evaluation failed", error);
    return NextResponse.json(
      { error: "evaluation_failed", detail: "Failed to evaluate submission." },
      { status: 502 }
    );
  }
}
