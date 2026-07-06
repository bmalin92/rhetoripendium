import { CategoryNav } from "@/components/CategoryNav";
import { LessonCard } from "@/components/LessonCard";
import { GoldRule } from "@/components/ui/GoldRule";
import type { LessonSummary } from "@/lib/types";

interface CategoryGroup {
  slug: string;
  name: string;
  description: string;
  lessons: LessonSummary[];
}

function groupByCategory(lessons: LessonSummary[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();
  for (const lesson of lessons) {
    const { slug, name, description } = lesson.category;
    let group = groups.get(slug);
    if (!group) {
      group = { slug, name, description, lessons: [] };
      groups.set(slug, group);
    }
    group.lessons.push(lesson);
  }
  return Array.from(groups.values());
}

export function LessonList({
  lessons,
  completedLessonIds,
}: {
  lessons: LessonSummary[];
  completedLessonIds: string[];
}) {
  const categoryGroups = groupByCategory(lessons);
  const categoryNavItems = categoryGroups.map((group) => ({
    slug: group.slug,
    name: group.name,
    total: group.lessons.length,
    completed: group.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length,
  }));

  return (
    <div className="flex flex-col gap-10">
      <CategoryNav categories={categoryNavItems} />
      {categoryGroups.map((group) => (
        <section key={group.slug} id={`category-${group.slug}`} className="flex scroll-mt-20 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-display text-2xl tracking-wide text-foreground">{group.name}</h2>
            <p className="max-w-2xl text-sm text-muted">{group.description}</p>
            <GoldRule className="max-w-12" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                completed={completedLessonIds.includes(lesson.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
