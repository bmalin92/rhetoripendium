import Link from "next/link";

import { LaurelSprig } from "@/components/motifs/LaurelSprig";
import { ProgressBadge } from "@/components/ProgressBadge";
import { Panel } from "@/components/ui/Panel";
import type { LessonSummary } from "@/lib/types";

export function LessonCard({ lesson, completed }: { lesson: LessonSummary; completed: boolean }) {
  return (
    <Link href={`/lessons/${lesson.slug}`}>
      <Panel className="flex h-full flex-col gap-3 p-5 transition hover:border-gold">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-heading text-xl font-semibold text-foreground">{lesson.title}</h2>
          <div className="flex items-center gap-1.5">
            {completed && <LaurelSprig className="text-gold" />}
            <ProgressBadge completed={completed} />
          </div>
        </div>
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
