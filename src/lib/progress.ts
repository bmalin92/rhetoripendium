"use client";

import type { Evaluation } from "@/lib/evaluation/schema";

const STORAGE_KEY = "rhetoripendium:progress:v1";

export interface StoredSubmission {
  id: string;
  submittedAt: string;
  text: string;
  evaluation: Evaluation;
}

export interface ProgressStore {
  version: 1;
  completedLessons: string[];
  submissions: Record<string, StoredSubmission[]>;
}

function emptyStore(): ProgressStore {
  return { version: 1, completedLessons: [], submissions: {} };
}

export function loadProgress(): ProgressStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as ProgressStore;
    if (parsed.version !== 1) return emptyStore();
    return parsed;
  } catch {
    return emptyStore();
  }
}

function saveProgress(store: ProgressStore) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // private browsing / storage disabled — degrade silently, progress just won't persist
  }
}

export function getSubmissionsForPrompt(promptId: string): StoredSubmission[] {
  return loadProgress().submissions[promptId] ?? [];
}

export function isLessonCompleted(lessonId: string): boolean {
  return loadProgress().completedLessons.includes(lessonId);
}

/** Records a submission for a prompt, then marks the lesson complete once every
 * one of its prompt ids has at least one submission recorded. */
export function recordSubmission(params: {
  lessonId: string;
  lessonPromptIds: string[];
  promptId: string;
  text: string;
  evaluation: Evaluation;
}): ProgressStore {
  const store = loadProgress();
  const existing = store.submissions[params.promptId] ?? [];
  const submission: StoredSubmission = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    text: params.text,
    evaluation: params.evaluation,
  };
  store.submissions[params.promptId] = [submission, ...existing];

  const allPromptsHaveSubmission = params.lessonPromptIds.every(
    (id) => (store.submissions[id]?.length ?? 0) > 0
  );
  if (allPromptsHaveSubmission && !store.completedLessons.includes(params.lessonId)) {
    store.completedLessons = [...store.completedLessons, params.lessonId];
  }

  saveProgress(store);
  return store;
}
