"use client";

import { useEffect, useState } from "react";

import { isLessonCompleted } from "@/lib/progress";

export function ProgressBadge({ lessonId }: { lessonId: string }) {
  const [completed, setCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so this must run post-mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompleted(isLessonCompleted(lessonId));
  }, [lessonId]);

  if (completed === null) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        completed
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {completed ? "Completed" : "Not started"}
    </span>
  );
}
