import ReactMarkdown from "react-markdown";

import { GoldRule } from "@/components/ui/GoldRule";
import { Panel } from "@/components/ui/Panel";
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
      {sections.map((section, i) => {
        const body = (
          <>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {KIND_LABEL[section.kind]}
            </p>
            {section.heading && (
              <h3 className="font-heading mb-2 text-2xl font-semibold text-foreground">
                {section.heading}
              </h3>
            )}
            <div className="markdown-content text-foreground">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </>
        );

        return (
          <div key={section.id} className="flex flex-col gap-8">
            {i > 0 && <GoldRule />}
            {section.kind === "CLASSICAL_EXAMPLE" ? (
              <Panel className="ml-4 border-l-4 border-l-accent p-5 sm:ml-8">{body}</Panel>
            ) : (
              <section
                className={
                  section.kind === "SUMMARY"
                    ? "texture-paper rounded-lg border border-border bg-surface p-5"
                    : ""
                }
              >
                {body}
              </section>
            )}
          </div>
        );
      })}
    </div>
  );
}
