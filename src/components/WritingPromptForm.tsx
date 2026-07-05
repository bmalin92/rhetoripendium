"use client";

import { useEffect, useState } from "react";

import { EvaluationResult } from "@/components/EvaluationResult";
import type { Evaluation } from "@/lib/evaluation/schema";
import { getSubmissionsForPrompt, recordSubmission, type StoredSubmission } from "@/lib/progress";
import type { PromptView } from "@/lib/types";

export function WritingPromptForm({
  prompt,
  lessonId,
  lessonPromptIds,
}: {
  prompt: PromptView;
  lessonId: string;
  lessonPromptIds: string[];
}) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestEvaluation, setLatestEvaluation] = useState<Evaluation | null>(null);
  const [history, setHistory] = useState<StoredSubmission[]>([]);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so this must run post-mount to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(getSubmissionsForPrompt(prompt.id));
  }, [prompt.id]);

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
      const store = recordSubmission({
        lessonId,
        lessonPromptIds,
        promptId: prompt.id,
        text,
        evaluation,
      });
      setHistory(store.submissions[prompt.id] ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          Writing Prompt
        </p>
        <p className="mt-1 text-zinc-800 dark:text-zinc-200">{prompt.prompt}</p>
        {prompt.instructions && (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{prompt.instructions}</p>
        )}
        {(prompt.minWords || prompt.maxWords) && (
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
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
          className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          required
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {text.trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <button
            type="submit"
            disabled={submitting || text.trim().length === 0}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {submitting ? "Evaluating..." : "Submit for evaluation"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>

      {latestEvaluation && <EvaluationResult evaluation={latestEvaluation} />}

      {!latestEvaluation && history.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            Previous submission
          </p>
          <EvaluationResult evaluation={history[0].evaluation} />
        </div>
      )}
    </div>
  );
}
