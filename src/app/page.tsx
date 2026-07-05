import { LessonList } from "@/components/LessonList";
import { getLessonSummaries } from "@/lib/data/lessons";

export default async function Home() {
  const lessons = await getLessonSummaries();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 sm:px-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Rhetoripendium
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Learn the art of rhetoric and persuasion — logos, ethos, pathos, and the classical
          devices behind great writing — then put each lesson to work in your own writing and get
          a rigorous critique.
        </p>
      </header>
      <LessonList lessons={lessons} />
    </div>
  );
}
