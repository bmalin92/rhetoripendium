import Link from "next/link";

import { ProgressBadge } from "@/components/ProgressBadge";
import type { LessonSummary } from "@/lib/types";

export function LessonCard({ lesson }: { lesson: LessonSummary }) {
  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{lesson.title}</h2>
        <ProgressBadge lessonId={lesson.id} />
      </div>
      {lesson.subtitle && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{lesson.subtitle}</p>
      )}
      <p className="text-sm text-zinc-700 dark:text-zinc-300">{lesson.summary}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {lesson.devices.map((device) => (
          <span
            key={device.slug}
            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {device.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
