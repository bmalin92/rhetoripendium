# Phase 2: Server-Side Progress Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Phase 1's `localStorage`-only progress tracking with Postgres-backed persistence, identified by an anonymous session cookie (no accounts yet — that's Phase 3).

**Architecture:** `middleware.ts` guarantees every request carries a stable `rp_session` cookie before it reaches any Server Component or Route Handler. `POST /api/evaluate` persists each submission and recomputes lesson completion server-side. Server Components (`page.tsx` files) read progress directly from Postgres via a new `src/lib/data/progress.ts` module and pass it down as props — no client-side `useEffect`/hydration workaround needed.

**Tech Stack:** Next.js 16.2.10 (App Router), Prisma 7.8.0 with `@prisma/adapter-pg`, Postgres (Neon), Zod v4, TypeScript 5.

## Global Constraints

- Session cookie name is exactly `rp_session`, defined once in `src/lib/session.ts` and imported everywhere else — never inline the string elsewhere.
- The `Session.id` column IS the cookie value (a `crypto.randomUUID()` string) — not a separate `cuid()`. Don't add a redundant surrogate key.
- This project has no automated test framework (no jest/vitest installed) — Phase 1 verified behavior manually via `curl` and one-off `tsx` scripts. Follow that same pattern for verification steps in this plan; do not introduce a new test runner.
- `DATABASE_URL` and `ANTHROPIC_API_KEY` live in `.env` (git-ignored). Never print their values in command output.
- Every new/modified server-side file that touches Postgres imports `prisma` from `@/lib/db` (existing singleton) — never instantiate a new `PrismaClient`.

---

### Task 1: Prisma schema — add `Session`, `CompletedLesson`, `Submission` models

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: `Session` model (`id: String @id`), `CompletedLesson` model (`@@unique([sessionId, lessonId])`, Prisma-generated compound-key name `sessionId_lessonId`), `Submission` model (`evaluation: Json`, `@@index([sessionId, promptId])`). All three are consumed by Task 4 (`src/app/api/evaluate/route.ts`) and Task 3 (`src/lib/data/progress.ts`).

- [ ] **Step 1: Add the three new models and back-relations**

In `prisma/schema.prisma`, add `completedBy CompletedLesson[]` to the existing `Lesson` model (after the `devices` field) and `submissions Submission[]` to the existing `WritingPrompt` model (after the `criteria` field). Then append these three new models at the end of the file:

```prisma
model Session {
  id               String            @id
  createdAt        DateTime          @default(now())
  lastSeenAt       DateTime          @updatedAt
  completedLessons CompletedLesson[]
  submissions      Submission[]
}

model CompletedLesson {
  id          String   @id @default(cuid())
  sessionId   String
  session     Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  completedAt DateTime @default(now())

  @@unique([sessionId, lessonId])
}

model Submission {
  id          String        @id @default(cuid())
  sessionId   String
  session     Session       @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  promptId    String
  prompt      WritingPrompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
  text        String
  evaluation  Json
  submittedAt DateTime      @default(now())

  @@index([sessionId, promptId])
}
```

- [ ] **Step 2: Run the migration**

Run: `npx prisma migrate dev --name add_progress_persistence`
Expected: prompts for a migration name are skipped (name given via flag); output ends with `Your database is now in sync with your schema.` and a new folder appears under `prisma/migrations/` starting with today's timestamp and ending in `_add_progress_persistence`.

- [ ] **Step 3: Verify the tables exist**

Run: `npx prisma studio` briefly, or non-interactively:
```bash
npx tsx -e "
import { prisma } from './src/lib/db';
(async () => {
  const tables = await prisma.\$queryRaw\`select table_name from information_schema.tables where table_schema = 'public' order by table_name\`;
  console.log(tables);
  await prisma.\$disconnect();
})();
"
```
Expected: the array includes `Session`, `CompletedLesson`, `Submission` alongside the existing Phase 1 tables.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (the new models generate types automatically via the `prisma-client` generator on `migrate dev`).

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add Session, CompletedLesson, Submission models for Phase 2 persistence"
```

---

### Task 2: Session cookie middleware

**Files:**
- Create: `src/lib/session.ts`
- Create: `middleware.ts` (project root, alongside `package.json` — NOT under `src/`, per Next.js convention)

**Interfaces:**
- Produces: `SESSION_COOKIE` constant (string `"rp_session"`), imported by Task 3 (`src/lib/data/progress.ts`) and Task 4 (`src/app/api/evaluate/route.ts`).
- Consumes: nothing from earlier tasks.

- [ ] **Step 1: Create the shared cookie-name constant**

Create `src/lib/session.ts`:

```ts
export const SESSION_COOKIE = "rp_session";
```

- [ ] **Step 2: Create the middleware**

Create `middleware.ts` at the project root:

```ts
import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  const sessionId = existing ?? crypto.randomUUID();

  if (!existing) {
    // Propagate the new cookie onto the request itself so Server Components
    // and Route Handlers further down the SAME request see it immediately,
    // instead of only on the next request after the browser stores it.
    request.cookies.set(SESSION_COOKIE, sessionId);
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  if (!existing) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_SECONDS,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 3: Verify the cookie is set on first request**

With the dev server running (`npm run dev`), run:
```bash
curl -sI http://localhost:3000/ | grep -i set-cookie
```
Expected: a line like `set-cookie: rp_session=<uuid>; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax`.

- [ ] **Step 4: Verify the cookie is NOT re-set on a subsequent request**

Run:
```bash
COOKIE=$(curl -sI http://localhost:3000/ | grep -i set-cookie | sed -E 's/.*rp_session=([^;]+).*/\1/')
curl -sI http://localhost:3000/ -H "Cookie: rp_session=$COOKIE" | grep -i set-cookie
```
Expected: no output (no `Set-Cookie` header, since the middleware saw the cookie already present).

- [ ] **Step 5: Typecheck and commit**

Run: `npx tsc --noEmit` — expect no errors.

```bash
git add src/lib/session.ts middleware.ts
git commit -m "feat: add anonymous session-cookie middleware"
```

---

### Task 3: Server-side progress data-access layer

**Files:**
- Create: `src/lib/data/progress.ts`

**Interfaces:**
- Consumes: `prisma` from `@/lib/db` (existing), `SESSION_COOKIE` from `@/lib/session` (Task 2), `Evaluation` type from `@/lib/evaluation/schema` (existing).
- Produces: `getCompletedLessonIds(): Promise<string[]>` and `getSubmissionHistoryByPrompt(promptIds: string[]): Promise<Record<string, SubmissionView[]>>`, plus the `SubmissionView` interface — consumed by Task 5 (`src/app/page.tsx`, `src/app/lessons/[slug]/page.tsx`, `src/components/WritingPromptForm.tsx`).

- [ ] **Step 1: Write the module**

Create `src/lib/data/progress.ts`:

```ts
import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import type { Evaluation } from "@/lib/evaluation/schema";
import { SESSION_COOKIE } from "@/lib/session";

export interface SubmissionView {
  id: string;
  text: string;
  evaluation: Evaluation;
  submittedAt: string;
}

async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function getCompletedLessonIds(): Promise<string[]> {
  const sessionId = await getSessionId();
  if (!sessionId) return [];

  const rows = await prisma.completedLesson.findMany({
    where: { sessionId },
    select: { lessonId: true },
  });
  return rows.map((r) => r.lessonId);
}

export async function getSubmissionHistoryByPrompt(
  promptIds: string[]
): Promise<Record<string, SubmissionView[]>> {
  const sessionId = await getSessionId();
  if (!sessionId || promptIds.length === 0) return {};

  const rows = await prisma.submission.findMany({
    where: { sessionId, promptId: { in: promptIds } },
    orderBy: { submittedAt: "desc" },
  });

  const result: Record<string, SubmissionView[]> = {};
  for (const row of rows) {
    const list = result[row.promptId] ?? [];
    list.push({
      id: row.id,
      text: row.text,
      evaluation: row.evaluation as Evaluation,
      submittedAt: row.submittedAt.toISOString(),
    });
    result[row.promptId] = list;
  }
  return result;
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors. (This module isn't wired into any page yet, so there's nothing to manually exercise until Task 5 — that's fine, it's pure data access with no branching logic worth testing in isolation.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/progress.ts
git commit -m "feat: add server-side progress data-access layer"
```

---

### Task 4: Persist submissions and lesson completion in `/api/evaluate`

**Files:**
- Modify: `src/lib/data/lessons.ts:84-96` (the `getPromptWithContext` function)
- Modify: `src/app/api/evaluate/route.ts`

**Interfaces:**
- Consumes: `SESSION_COOKIE` from `@/lib/session` (Task 2), `prisma` from `@/lib/db`.
- Produces: `POST /api/evaluate` now returns `{ evaluation: Evaluation, lessonCompleted?: boolean }` (the extra field is optional/omitted if persistence failed) — consumed by Task 5's `WritingPromptForm.tsx`, though the current UI doesn't need to render it (see Task 5 notes).

- [ ] **Step 1: Extend `getPromptWithContext` to include sibling prompt IDs**

In `src/lib/data/lessons.ts`, modify the `lesson.include` block inside `getPromptWithContext` (currently lines 84-96) so the lesson relation also includes its prompts' IDs — needed to compute lesson completion:

```ts
export async function getPromptWithContext(promptId: string) {
  return prisma.writingPrompt.findUnique({
    where: { id: promptId },
    include: {
      criteria: { orderBy: { order: "asc" } },
      lesson: {
        include: {
          devices: { include: { device: true } },
          prompts: { select: { id: true } },
        },
      },
    },
  });
}
```

- [ ] **Step 2: Add persistence to the evaluate route**

Replace the full contents of `src/app/api/evaluate/route.ts` with:

```ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getPromptWithContext } from "@/lib/data/lessons";
import { evaluateSubmission } from "@/lib/claude";
import { SESSION_COOKIE } from "@/lib/session";

const requestSchema = z.object({
  promptId: z.string().min(1),
  submission: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { promptId, submission } = parsed.data;

  const prompt = await getPromptWithContext(promptId);
  if (!prompt) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let evaluation;
  try {
    evaluation = await evaluateSubmission({
      lessonTitle: prompt.lesson.title,
      deviceNames: prompt.lesson.devices.map((ld) => ld.device.name),
      promptText: prompt.prompt,
      promptInstructions: prompt.instructions,
      criteria: prompt.criteria.map((c) => ({
        key: c.key,
        label: c.label,
        description: c.description,
      })),
      submission,
    });
  } catch (error) {
    console.error("Evaluation failed", error);
    return NextResponse.json(
      { error: "evaluation_failed", detail: "Failed to evaluate submission." },
      { status: 502 }
    );
  }

  let lessonCompleted: boolean | undefined;
  try {
    const store = await cookies();
    const sessionId = store.get(SESSION_COOKIE)?.value;

    if (sessionId) {
      await prisma.session.upsert({
        where: { id: sessionId },
        create: { id: sessionId },
        update: { lastSeenAt: new Date() },
      });

      await prisma.submission.create({
        data: { sessionId, promptId, text: submission, evaluation },
      });

      const lessonPromptIds = prompt.lesson.prompts.map((p) => p.id);
      const submitted = await prisma.submission.findMany({
        where: { sessionId, promptId: { in: lessonPromptIds } },
        distinct: ["promptId"],
        select: { promptId: true },
      });
      const submittedIds = new Set(submitted.map((s) => s.promptId));
      lessonCompleted = lessonPromptIds.every((id) => submittedIds.has(id));

      if (lessonCompleted) {
        await prisma.completedLesson.upsert({
          where: { sessionId_lessonId: { sessionId, lessonId: prompt.lesson.id } },
          create: { sessionId, lessonId: prompt.lesson.id },
          update: {},
        });
      }
    }
  } catch (error) {
    // A transient DB hiccup shouldn't discard an evaluation the user already
    // paid Claude API cost for — log it and return the evaluation anyway.
    console.error("Progress persistence failed", error);
    lessonCompleted = undefined;
  }

  return NextResponse.json({ evaluation, lessonCompleted });
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Verify persistence end-to-end with curl**

Get a real `promptId` (any lesson slug works):
```bash
curl -s http://localhost:3000/api/lessons/ethos-establishing-credibility | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['prompts'][0]['id'])"
```

Capture a session cookie and submit against that `promptId`:
```bash
curl -sc /tmp/rp_cookies.txt http://localhost:3000/ -o /dev/null
PROMPT_ID="<paste id from above>"
curl -sb /tmp/rp_cookies.txt -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d "{\"promptId\":\"$PROMPT_ID\",\"submission\":\"This is a deliberately short test submission for persistence verification.\"}" \
  --max-time 60 | python3 -m json.tool
```
Expected: JSON response includes `"lessonCompleted"` (true or false depending on how many prompts the lesson has).

- [ ] **Step 5: Verify the rows landed in Postgres**

```bash
SESSION_ID=$(grep rp_session /tmp/rp_cookies.txt | awk '{print $7}')
npx tsx -e "
import { prisma } from './src/lib/db';
(async () => {
  const subs = await prisma.submission.findMany({ where: { sessionId: '$SESSION_ID' } });
  console.log('submissions:', subs.length);
  await prisma.\$disconnect();
})();
"
```
Expected: `submissions: 1`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/lessons.ts src/app/api/evaluate/route.ts
git commit -m "feat: persist submissions and lesson completion in the evaluate route"
```

---

### Task 5: Wire Server Components to server-side progress, delete `localStorage` module

**Files:**
- Delete: `src/lib/progress.ts`
- Modify: `src/components/ProgressBadge.tsx`
- Modify: `src/components/LessonCard.tsx`
- Modify: `src/components/LessonList.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/WritingPromptForm.tsx`
- Modify: `src/app/lessons/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getCompletedLessonIds`, `getSubmissionHistoryByPrompt`, `SubmissionView` from `@/lib/data/progress` (Task 3).
- Produces: nothing consumed by later tasks — this is the last code task.

- [ ] **Step 1: Delete the localStorage module**

```bash
rm src/lib/progress.ts
```

- [ ] **Step 2: Simplify `ProgressBadge` to a plain presentational component**

Replace the full contents of `src/components/ProgressBadge.tsx` with:

```tsx
export function ProgressBadge({ completed }: { completed: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        completed
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {completed ? "Completed" : "Not started"}
    </span>
  );
}
```

- [ ] **Step 3: Pass `completed` through `LessonCard`**

In `src/components/LessonCard.tsx`, change the function signature and the `ProgressBadge` usage:

```tsx
export function LessonCard({ lesson, completed }: { lesson: LessonSummary; completed: boolean }) {
  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{lesson.title}</h2>
        <ProgressBadge completed={completed} />
      </div>
```

(The rest of the file — subtitle, summary, device tags — is unchanged.)

- [ ] **Step 4: Pass `completedLessonIds` through `LessonList`**

Replace the full contents of `src/components/LessonList.tsx` with:

```tsx
import { LessonCard } from "@/components/LessonCard";
import type { LessonSummary } from "@/lib/types";

export function LessonList({
  lessons,
  completedLessonIds,
}: {
  lessons: LessonSummary[];
  completedLessonIds: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          completed={completedLessonIds.includes(lesson.id)}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Fetch completion state in the dashboard page**

In `src/app/page.tsx`, fetch both in parallel and pass the new prop:

```tsx
import { LessonList } from "@/components/LessonList";
import { getCompletedLessonIds } from "@/lib/data/progress";
import { getLessonSummaries } from "@/lib/data/lessons";

export default async function Home() {
  const [lessons, completedLessonIds] = await Promise.all([
    getLessonSummaries(),
    getCompletedLessonIds(),
  ]);

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
      <LessonList lessons={lessons} completedLessonIds={completedLessonIds} />
    </div>
  );
}
```

- [ ] **Step 6: Rewrite `WritingPromptForm` to take server-fetched history as a prop**

Replace the full contents of `src/components/WritingPromptForm.tsx` with:

```tsx
"use client";

import { useState } from "react";

import { EvaluationResult } from "@/components/EvaluationResult";
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
```

Note: `lessonId` and `lessonPromptIds` props are dropped — lesson-completion logic now lives entirely server-side in `/api/evaluate` (Task 4), so the client no longer needs to know its siblings' IDs.

- [ ] **Step 7: Fetch history in the lesson detail page and drop the now-unused prop**

Replace the full contents of `src/app/lessons/[slug]/page.tsx` with:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import { LessonContent } from "@/components/LessonContent";
import { WritingPromptForm } from "@/components/WritingPromptForm";
import { getLessonDetailBySlug } from "@/lib/data/lessons";
import { getSubmissionHistoryByPrompt } from "@/lib/data/progress";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonDetailBySlug(slug);

  if (!lesson) notFound();

  const promptIds = lesson.prompts.map((p) => p.id);
  const historyByPrompt = await getSubmissionHistoryByPrompt(promptIds);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12 sm:px-10">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          ← All lessons
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {lesson.title}
        </h1>
        {lesson.subtitle && (
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">{lesson.subtitle}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lesson.devices.map((device) => (
            <span
              key={device.slug}
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {device.name}
            </span>
          ))}
        </div>
      </div>

      <LessonContent sections={lesson.sections} />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Put it into practice
        </h2>
        {lesson.prompts.map((prompt) => (
          <WritingPromptForm
            key={prompt.id}
            prompt={prompt}
            initialHistory={historyByPrompt[prompt.id] ?? []}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Typecheck and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors or warnings (this should also confirm the two Phase-1 `eslint-disable-next-line react-hooks/set-state-in-effect` comments are gone, since the components that had them no longer use `useEffect` for this purpose).

- [ ] **Step 9: Manual end-to-end verification**

With `npm run dev` running:
1. Open a fresh incognito window (no existing `rp_session` cookie) to `http://localhost:3000` — confirm the dashboard renders all 5 lessons with "Not started" badges.
2. Open a lesson, submit a prompt, confirm the evaluation renders.
3. Reload the lesson page — confirm "Previous submission" now shows the evaluation you just got (server-fetched, not client cache).
4. Navigate back to the dashboard — confirm the badge is still "Not started" if the lesson has more than one prompt, or "Completed" if that was its only prompt.
5. If the lesson has multiple prompts, submit the remaining ones, then check the dashboard again — confirm the badge flips to "Completed".
6. Open DevTools → Application → Cookies — confirm `rp_session` is present, `HttpOnly` is checked, and there's no equivalent data left in Local Storage.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: replace localStorage progress with server-rendered progress from Postgres"
```

---

### Task 6: Resilience verification — DB failure shouldn't break evaluation

**Files:** none (verification only)

- [ ] **Step 1: Stop the normal dev server**

Kill whatever `npm run dev` process is currently running (Ctrl+C in its terminal, or `pkill -f "next dev"`).

- [ ] **Step 2: Start the dev server with a deliberately broken DB connection**

Shell-exported environment variables take precedence over `.env` in Next.js, so this overrides `DATABASE_URL` for this run only — no file edits needed:

```bash
DATABASE_URL="postgresql://invalid:invalid@localhost:5432/nonexistent" npm run dev &
sleep 3
```

- [ ] **Step 3: Confirm evaluation still succeeds despite the broken DB**

Get a real `promptId` first (the lessons API doesn't touch `DATABASE_URL` via the broken connection differently than before — it'll actually fail too, so instead reuse a `promptId` value you already captured earlier in Task 4 Step 4, or hardcode one you know from the seed data):

```bash
PROMPT_ID="<a promptId captured earlier>"
curl -s -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d "{\"promptId\":\"$PROMPT_ID\",\"submission\":\"Resilience check submission for Phase 2 verification.\"}" \
  --max-time 60 | python3 -m json.tool
```
Expected: response body still contains a full `"evaluation": {...}` object; `"lessonCompleted"` is absent (`null`/omitted) since the DB write failed. The dev server's terminal output shows a `Progress persistence failed` line with a Postgres connection error.

Note: since `getPromptWithContext` also needs the DB to look up the prompt, this specific test only works while the prompt lookup still succeeds against a *cached* connection, or by using a lesson slug already warmed up. If the lookup itself 404s/500s because the broken connection also blocks reads, that's expected too — the important behavior under test is specifically the code path in Task 4 Step 2 where the Claude call already succeeded and only the persistence `try/catch` block fails; confirm by reading `src/app/api/evaluate/route.ts` and tracing that `evaluation` is computed and returned before the persistence `try` block runs, independent of its outcome.

- [ ] **Step 4: Restore normal operation**

Kill the broken-DB dev server process, then run `npm run dev` normally (using the real `.env`) and re-run the Task 4 Step 4 curl check to confirm persistence works again.

- [ ] **Step 5: No commit needed** — this task is verification only, confirming behavior already implemented in Task 4.
