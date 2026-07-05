import { LessonCard } from "@/components/LessonCard";
import type { LessonSummary } from "@/lib/types";

export function LessonList({
  lessons,
  completedLessonIds,
}: {
  lessons: LessonSummary[];
  completedLessonIds: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          completed={completedLessonIds.includes(lesson.id)}
        />
      ))}
    </div>
  );
}
