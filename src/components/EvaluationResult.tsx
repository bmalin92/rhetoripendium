import { LaurelSprig } from "@/components/motifs/LaurelSprig";
import { MeanderRule } from "@/components/motifs/MeanderRule";
import { GoldRule } from "@/components/ui/GoldRule";
import { Panel } from "@/components/ui/Panel";
import type { Evaluation } from "@/lib/evaluation/schema";

const VERDICT_STYLES: Record<string, string> = {
  poor: "bg-verdict-poor/15 text-verdict-poor",
  needs_significant_work: "bg-verdict-poor/15 text-verdict-poor",
  developing: "bg-verdict-developing/15 text-verdict-developing",
  proficient: "bg-verdict-proficient/15 text-verdict-proficient",
  solid: "bg-verdict-proficient/15 text-verdict-proficient",
  excellent: "bg-verdict-excellent/15 text-verdict-excellent",
};

function VerdictBadge({ verdict }: { verdict: string }) {
  return (
    <span
      className={`font-heading inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        VERDICT_STYLES[verdict] ?? "bg-surface text-muted"
      }`}
    >
      {verdict.replaceAll("_", " ")}
    </span>
  );
}

export function EvaluationResult({ evaluation }: { evaluation: Evaluation }) {
  const isExcellent = evaluation.overallVerdict === "excellent";

  return (
    <Panel className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-heading text-lg font-semibold text-foreground">Evaluation</h4>
        <div className="flex items-center gap-1.5">
          {isExcellent && <LaurelSprig className="text-gold" />}
          <VerdictBadge verdict={evaluation.overallVerdict} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-muted">
          Device usage: {evaluation.deviceUsed ? "Detected" : "Not detected"}
        </p>
        <p className="mt-1 text-sm text-foreground">{evaluation.deviceAnalysis}</p>
      </div>

      <div className="flex flex-col gap-3">
        {evaluation.criteria.map((c) => (
          <div key={c.key} className="border-t border-border pt-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{c.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">{c.score}/5</span>
                <VerdictBadge verdict={c.verdict} />
              </div>
            </div>
            <p className="mt-1 text-sm text-foreground">{c.feedback}</p>
          </div>
        ))}
      </div>

      {(evaluation.strengths.length > 0 || evaluation.weaknesses.length > 0) && (
        <>
          <MeanderRule />
          <div className="flex flex-col gap-5 sm:flex-row">
            {evaluation.strengths.length > 0 && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Strengths</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-foreground">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.strengths.length > 0 && evaluation.weaknesses.length > 0 && (
              <GoldRule orientation="vertical" className="hidden sm:block" />
            )}
            {evaluation.weaknesses.length > 0 && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Weaknesses</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-foreground">
                  {evaluation.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      <div className="border-t border-border pt-3">
        <p className="text-sm font-semibold text-foreground">Summary</p>
        <p className="mt-1 text-sm text-foreground">{evaluation.summary}</p>
      </div>
    </Panel>
  );
}
