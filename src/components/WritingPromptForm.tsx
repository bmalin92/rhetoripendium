"use client";

import { useState } from "react";

import { EvaluationResult } from "@/components/EvaluationResult";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import type { SubmissionView } from "@/lib/data/progress";
import type { Evaluation } from "@/lib/evaluation/schema";
import type { PromptView } from "@/lib/types";

export function WritingPromptForm({
  prompt,
  initialHistory,
}: {
  prompt: PromptView;
  initialHistory: SubmissionView[];
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestEvaluation, setLatestEvaluation] = useState<Evaluation | null>(null);
  const [history, setHistory] = useState<SubmissionView[]>(initialHistory);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt.id, submission: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail ?? data.error ?? "Evaluation failed");
      }
      const evaluation = data.evaluation as Evaluation;
      setLatestEvaluation(evaluation);
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          text,
          evaluation,
          submittedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Panel className="flex flex-col gap-4 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Writing Prompt</p>
        <p className="mt-1 text-foreground">{prompt.prompt}</p>
        {prompt.instructions && <p className="mt-2 text-sm text-muted">{prompt.instructions}</p>}
        {(prompt.minWords || prompt.maxWords) && (
          <p className="mt-2 text-xs text-muted">
            {prompt.minWords ?? 0}
            {prompt.maxWords ? `-${prompt.maxWords}` : "+"} words
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Write your response here..."
          className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none"
          required
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            {text.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <Button type="submit" variant="primary" disabled={submitting || text.trim().length === 0}>
            {submitting ? "Evaluating..." : "Submit for evaluation"}
          </Button>
        </div>
        {error && <p className="text-sm text-verdict-poor">{error}</p>}
      </form>

      {latestEvaluation && <EvaluationResult evaluation={latestEvaluation} />}

      {!latestEvaluation && history.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Previous submission
          </p>
          <EvaluationResult evaluation={history[0].evaluation} />
        </div>
      )}
    </Panel>
  );
}
