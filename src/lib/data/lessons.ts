import { prisma } from "@/lib/db";
import type { LessonDetail, LessonSummary } from "@/lib/types";

const summaryInclude = {
  devices: { include: { device: true } },
} as const;

const detailInclude = {
  sections: { orderBy: { order: "asc" as const } },
  prompts: {
    orderBy: { order: "asc" as const },
    include: { criteria: { orderBy: { order: "asc" as const } } },
  },
  devices: { include: { device: true } },
} as const;

type LessonWithSummaryInclude = Awaited<ReturnType<typeof getLessons>>[number];
type LessonWithDetailInclude = NonNullable<Awaited<ReturnType<typeof getLessonBySlug>>>;

function toLessonSummary(lesson: LessonWithSummaryInclude): LessonSummary {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    subtitle: lesson.subtitle,
    summary: lesson.summary,
    order: lesson.order,
    devices: lesson.devices.map((ld) => ({ slug: ld.device.slug, name: ld.device.name })),
  };
}

function toLessonDetail(lesson: LessonWithDetailInclude): LessonDetail {
  return {
    ...toLessonSummary(lesson),
    sections: lesson.sections.map((s) => ({
      id: s.id,
      order: s.order,
      kind: s.kind,
      heading: s.heading,
      content: s.content,
    })),
    prompts: lesson.prompts.map((p) => ({
      id: p.id,
      order: p.order,
      prompt: p.prompt,
      instructions: p.instructions,
      minWords: p.minWords,
      maxWords: p.maxWords,
      criteria: p.criteria.map((c) => ({
        id: c.id,
        key: c.key,
        label: c.label,
        description: c.description,
      })),
    })),
  };
}

export async function getLessons() {
  return prisma.lesson.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: summaryInclude,
  });
}

export async function getLessonBySlug(slug: string) {
  return prisma.lesson.findFirst({
    where: { slug, published: true },
    include: detailInclude,
  });
}

export async function getLessonSummaries(): Promise<LessonSummary[]> {
  const lessons = await getLessons();
  return lessons.map(toLessonSummary);
}

export async function getLessonDetailBySlug(slug: string): Promise<LessonDetail | null> {
  const lesson = await getLessonBySlug(slug);
  return lesson ? toLessonDetail(lesson) : null;
}

export async function getPromptWithContext(promptId: string) {
  return prisma.writingPrompt.findUnique({
    where: { id: promptId },
    include: {
      criteria: { orderBy: { order: "asc" } },
      lesson: {
        include: {
          devices: { include: { device: true } },
        },
      },
    },
  });
}
