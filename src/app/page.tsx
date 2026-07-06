import { LessonList } from "@/components/LessonList";
import { GoldRule } from "@/components/ui/GoldRule";
import { getCompletedLessonIds } from "@/lib/data/progress";
import { getLessonSummaries } from "@/lib/data/lessons";

export default async function Home() {
  const [lessons, completedLessonIds] = await Promise.all([
    getLessonSummaries(),
    getCompletedLessonIds(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-10">
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-4xl tracking-wide text-foreground">Rhetoripendium</h1>
        <p className="max-w-2xl text-muted">
          Learn the art of rhetoric and persuasion — logos, ethos, pathos, and the classical
          devices behind great writing — then put each lesson to work in your own writing and get
          a rigorous critique.
        </p>
        <GoldRule className="max-w-16" />
      </header>
      <LessonList lessons={lessons} completedLessonIds={completedLessonIds} />
    </div>
  );
}
