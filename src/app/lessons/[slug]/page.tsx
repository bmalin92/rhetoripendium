import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonContent } from "@/components/LessonContent";
import { WritingPromptForm } from "@/components/WritingPromptForm";
import { getLessonDetailBySlug } from "@/lib/data/lessons";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonDetailBySlug(slug);

  if (!lesson) notFound();

  const lessonPromptIds = lesson.prompts.map((p) => p.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12 sm:px-10">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          ← All lessons
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {lesson.title}
        </h1>
        {lesson.subtitle && (
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">{lesson.subtitle}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lesson.devices.map((device) => (
            <span
              key={device.slug}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {device.name}
            </span>
          ))}
        </div>
      </div>

      <LessonContent sections={lesson.sections} />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Put it into practice
        </h2>
        {lesson.prompts.map((prompt) => (
          <WritingPromptForm
            key={prompt.id}
            prompt={prompt}
            lessonId={lesson.id}
            lessonPromptIds={lessonPromptIds}
          />
        ))}
      </div>
    </div>
  );
}
