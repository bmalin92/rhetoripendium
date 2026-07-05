import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonContent } from "@/components/LessonContent";
import { WritingPromptForm } from "@/components/WritingPromptForm";
import { getLessonDetailBySlug } from "@/lib/data/lessons";
import { getSubmissionHistoryByPrompt } from "@/lib/data/progress";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonDetailBySlug(slug);

  if (!lesson) notFound();

  const promptIds = lesson.prompts.map((p) => p.id);
  const historyByPrompt = await getSubmissionHistoryByPrompt(promptIds);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12 sm:px-10">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-gold">
          ← All lessons
        </Link>
        <h1 className="font-display mt-3 text-3xl tracking-wide text-foreground">
          {lesson.title}
        </h1>
        {lesson.subtitle && <p className="mt-1 text-muted">{lesson.subtitle}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lesson.devices.map((device) => (
            <span
              key={device.slug}
              className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted"
            >
              {device.name}
            </span>
          ))}
        </div>
      </div>

      <LessonContent sections={lesson.sections} />

      <div className="flex flex-col gap-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Put it into practice
        </h2>
        {lesson.prompts.map((prompt) => (
          <WritingPromptForm
            key={prompt.id}
            prompt={prompt}
            initialHistory={historyByPrompt[prompt.id] ?? []}
          />
        ))}
      </div>
    </div>
  );
}
