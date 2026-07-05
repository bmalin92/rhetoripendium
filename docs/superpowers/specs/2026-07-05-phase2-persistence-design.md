# Phase 2: Server-Side Progress Persistence

## Context

Phase 1 built the core lesson/writing/evaluation loop with progress stored only in browser `localStorage` (`src/lib/progress.ts`, key `rhetoripendium:progress:v1`). Phase 2 moves that persistence to the server (Postgres via Prisma), so progress survives clearing browser storage, works across browsers on request, and lays groundwork for Phase 3 (Google auth) to attach real accounts to existing data.

There are no user accounts yet — that's Phase 3. Phase 2 must identify "whose" progress a record belongs to without any login step.

## Decisions

- **Identity:** anonymous session cookie. No accounts, no login friction. Phase 3 will attach a real `userId` to an existing session rather than starting over.
- **Migration:** none. Existing Phase-1 `localStorage` data is not migrated to the server; it's fine to start fresh.
- **Source of truth:** server fully replaces `localStorage`. `src/lib/progress.ts` is deleted; all reads/writes go through Postgres. No local cache, no sync-drift edge cases.

## 1. Session Mechanics

`middleware.ts` runs on every request. If no `rp_session` cookie exists, it generates an opaque random ID (`crypto.randomUUID()`) and sets it as an httpOnly, `SameSite=Lax`, 1-year cookie. This requires no DB access — it just guarantees every request, including the first Server Component render, has a stable session identifier. This is what lets Server Components read progress directly (no client-side `useEffect` + hydration workaround needed, unlike Phase 1's `ProgressBadge`/`WritingPromptForm`).

The corresponding `Session` row in Postgres is created lazily, via `upsert`, only the first time something is actually written (a submission or a lesson completion). Reads for a session with no rows yet simply return empty progress — there's no need to eagerly create a `Session` row just because someone loaded the dashboard.

## 2. Data Model

Additive to the existing schema — no Phase 1 tables change.

```prisma
model Session {
  id               String            @id  // the cookie value itself, not a separate cuid
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
  evaluation  Json          // the Evaluation object, same shape already rendered client-side
  submittedAt DateTime      @default(now())
  @@index([sessionId, promptId])
}
```

Evaluations are stored as a raw JSON column rather than normalized into columns — the shape is already Zod-validated and stable, and normalizing it would add join complexity with no real benefit at this scale. `Lesson` and `WritingPrompt` gain back-relations (`completedBy`, `submissions`).

## 3. API & Data-Access Changes

- `POST /api/evaluate` gains a persistence step after the Claude call succeeds: upsert the `Session` row (by cookie ID), insert a `Submission`, then recompute whether every prompt in the lesson now has ≥1 submission and upsert `CompletedLesson` if it just became complete. Response shape grows one field: `{ evaluation, lessonCompleted: boolean }`.
- New `src/lib/data/progress.ts` (server-only, reads the cookie via `next/headers`) exposing `getCompletedLessonIds()` and `getSubmissionHistory(lessonId)`, called directly by page components instead of a client-side fetch.
- Persistence failures are isolated in their own try/catch: if the DB write fails but the Claude evaluation succeeded, the evaluation is still returned to the user (a transient Neon hiccup shouldn't destroy feedback they already paid API cost for) with `lessonCompleted` omitted and the failure logged server-side.

## 4. Frontend Changes

- `src/lib/progress.ts` (the localStorage module) is deleted entirely.
- `src/app/page.tsx` and `src/app/lessons/[slug]/page.tsx` (Server Components) call `getCompletedLessonIds()` / `getSubmissionHistory()` directly and pass results down as props.
- `ProgressBadge` becomes a plain presentational component (`completed: boolean` prop) — no `"use client"`, no `useEffect`, no eslint-disable.
- `WritingPromptForm` stays `"use client"` (still needs interactivity for the textarea/submit) but receives `initialHistory` as a prop instead of computing it in a `useEffect` — removing that eslint-disable too.
- On successful submit, the client updates its own local component state from the API response directly.

## 5. Testing / Verification Plan

1. `prisma migrate dev` to create the new tables against the same Neon DB.
2. Fresh browser (no cookie) → submit a prompt → confirm a `Session` + `Submission` row appear in Postgres with matching IDs; reload → confirm history and completion badge reflect it server-side.
3. Submit all prompts in a lesson → confirm `CompletedLesson` is created and the dashboard badge flips.
4. Temporarily point `DATABASE_URL` at an invalid host → confirm `/api/evaluate` still returns a valid evaluation (degraded, no `lessonCompleted`) instead of a 500.
5. Confirm the cookie is `httpOnly`, `SameSite=Lax`, and not readable from `document.cookie` in the browser console.

## Out of Scope

- Rate limiting / abuse protection on `/api/evaluate` — deferred to Phase 4 (public deployment), since the app isn't publicly reachable yet.
- Cross-device sync without login — that's what Phase 3 accounts are for.
- Migrating existing Phase 1 `localStorage` data.
