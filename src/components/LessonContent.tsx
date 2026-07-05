import ReactMarkdown from "react-markdown";

import type { SectionView } from "@/lib/types";

const KIND_LABEL: Record<SectionView["kind"], string> = {
  EXPLANATION: "Explanation",
  EXAMPLE: "Example",
  CLASSICAL_EXAMPLE: "Classical Example",
  SUMMARY: "Summary",
};

export function LessonContent({ sections }: { sections: SectionView[] }) {
  return (
    <div className="flex flex-col gap-8">
      {sections.map((section) => (
        <section
          key={section.id}
          className={
            section.kind === "CLASSICAL_EXAMPLE"
              ? "rounded-lg border-l-4 border-amber-400 bg-amber-50 p-5 dark:border-amber-500/60 dark:bg-amber-950/20"
              : section.kind === "SUMMARY"
                ? "rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
                : ""
          }
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            {KIND_LABEL[section.kind]}
          </p>
          {section.heading && (
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {section.heading}
            </h3>
          )}
          <div className="markdown-content text-zinc-700 dark:text-zinc-300">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
        </section>
      ))}
    </div>
  );
}
