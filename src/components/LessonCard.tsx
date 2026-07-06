import Link from "next/link";

import { LessonStatusSeal } from "@/components/LessonStatusSeal";
import { Panel } from "@/components/ui/Panel";
import type { LessonSummary } from "@/lib/types";

export function LessonCard({ lesson, completed }: { lesson: LessonSummary; completed: boolean }) {
  return (
    <Link href={`/lessons/${lesson.slug}`} className="group block h-full">
      <Panel className="relative flex h-full flex-col gap-3 p-5 transition hover:border-trevi">
        <LessonStatusSeal completed={completed} />
        <h2 className="pr-9 font-heading text-xl font-semibold text-foreground">{lesson.title}</h2>
        {lesson.subtitle && <p className="text-sm text-muted">{lesson.subtitle}</p>}
        <p className="text-sm text-foreground">{lesson.summary}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {lesson.devices.map((device) => (
            <span
              key={device.slug}
              className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-muted"
            >
              {device.name}
            </span>
          ))}
        </div>
      </Panel>
    </Link>
  );
}
