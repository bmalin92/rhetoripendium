import type { Evaluation } from "@/lib/evaluation/schema";

const VERDICT_STYLES: Record<string, string> = {
  poor: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  needs_significant_work: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  developing: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  proficient: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  solid: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  excellent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

function VerdictBadge({ verdict }: { verdict: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        VERDICT_STYLES[verdict] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {verdict.replaceAll("_", " ")}
    </span>
  );
}

export function EvaluationResult({ evaluation }: { evaluation: Evaluation }) {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Evaluation</h4>
        <VerdictBadge verdict={evaluation.overallVerdict} />
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Device usage: {evaluation.deviceUsed ? "Detected" : "Not detected"}
        </p>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{evaluation.deviceAnalysis}</p>
      </div>

      <div className="flex flex-col gap-3">
        {evaluation.criteria.map((c) => (
          <div key={c.key} className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{c.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{c.score}/5</span>
                <VerdictBadge verdict={c.verdict} />
              </div>
            </div>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{c.feedback}</p>
          </div>
        ))}
      </div>

      {evaluation.strengths.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Strengths</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {evaluation.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {evaluation.weaknesses.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Weaknesses</p>
          <ul className="mt-1 list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {evaluation.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Summary</p>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{evaluation.summary}</p>
      </div>
    </div>
  );
}
