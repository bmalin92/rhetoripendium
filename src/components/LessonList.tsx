import { LessonCard } from "@/components/LessonCard";
import type { LessonSummary } from "@/lib/types";

export function LessonList({ lessons }: { lessons: LessonSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
