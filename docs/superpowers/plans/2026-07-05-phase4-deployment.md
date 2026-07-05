# Phase 4: Public Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Rhetoripendium reachable by other people via a free Vercel `*.vercel.app` URL, with basic rate limiting on the paid Claude-evaluation endpoint so a public URL doesn't create unbounded cost exposure.

**Architecture:** Two small code changes (a database-backed rate-limit check wired into `/api/evaluate`, and a build-script change so production migrations apply automatically), followed by one deployment task covering Vercel project setup, Google OAuth production configuration, and end-to-end verification against the live URL. No new services, no new database tables — rate limiting reuses the existing `Submission` table's `submittedAt` timestamps.

**Tech Stack:** Next.js 16.2.10 (App Router), TypeScript 5, Prisma 7.8.0 (`@prisma/adapter-pg`, Postgres on Neon), Vercel (free tier), existing Auth.js v5 / Google OAuth setup from Phase 3.

## Global Constraints

- No custom domain purchase — production URL is Vercel's free `<project>.vercel.app` subdomain.
- Rate limit: **5 submissions per 10 minutes per identity** (signed-in `userId` or anonymous `sessionId`), enforced via `prisma.submission.count()` against the existing `Submission` table — no new table, no external service (e.g. no Redis).
- Rate-limit check must run **before** the Claude API call in `/api/evaluate`, so a limited request never incurs Anthropic API cost.
- Rate-limit check fails **open** (allows the request) on a DB error — a transient DB hiccup must never block a legitimate submission, consistent with this project's existing DB-failure-isolation pattern in `/api/evaluate`.
- Production `DATABASE_URL` in Vercel must be Neon's **pooled** connection string (hostname ending `-pooler`), not the direct one used in local `.env` — operational/env-var change only, no code or schema change.
- `prisma migrate deploy` must run automatically as part of the Vercel build, before `next build`.
- Google OAuth consent screen must be switched from "Testing" to "In production" so any Google user can sign in; the resulting "unverified app" warning is accepted, not resolved, in this phase.
- Production needs its own freshly generated `AUTH_SECRET`, distinct from the local dev one.
- No automated test framework in this project (deliberate, established norm) — verification is `npx tsc --noEmit`, `npm run lint`, and manual/curl-based checks against a real dev server (and, for the deployment task, the real production URL).

---

### Task 1: Rate limiting on `/api/evaluate`

**Files:**
- Create: `src/lib/rate-limit.ts`
- Modify: `src/app/api/evaluate/route.ts` (full file, 105 lines)

**Interfaces:**
- Consumes: `Identity` type from `src/lib/identity.ts` (`{ type: "user"; id: string } | { type: "session"; id: string } | null`), `prisma` from `src/lib/db.ts`.
- Produces: `checkRateLimit(identity: Identity): Promise<boolean>` — `true` means the request may proceed, `false` means the identity has hit the limit. No other task depends on this.

- [ ] **Step 1: Create `src/lib/rate-limit.ts`**

```ts
import { prisma } from "@/lib/db";
import type { Identity } from "@/lib/identity";

const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// Fails open on a DB error — a transient hiccup here must never block a
// legitimate submission, matching this route's existing persistence
// try/catch philosophy.
export async function checkRateLimit(identity: Identity): Promise<boolean> {
  if (!identity) {
    return true;
  }

  const identityWhere =
    identity.type === "user" ? { userId: identity.id } : { sessionId: identity.id };

  try {
    const count = await prisma.submission.count({
      where: {
        ...identityWhere,
        submittedAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
      },
    });

    return count < RATE_LIMIT_MAX_SUBMISSIONS;
  } catch (error) {
    console.error("Rate limit check failed", error);
    return true;
  }
}
```

- [ ] **Step 2: Replace `src/app/api/evaluate/route.ts` in full**

```ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getPromptWithContext } from "@/lib/data/lessons";
import { evaluateSubmission } from "@/lib/claude";
import { getIdentity } from "@/lib/identity";
import { checkRateLimit } from "@/lib/rate-limit";

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

  const identity = await getIdentity();

  const withinRateLimit = await checkRateLimit(identity);
  if (!withinRateLimit) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "You've submitted a lot in the last few minutes — try again shortly.",
      },
      { status: 429 }
    );
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
    if (identity) {
      if (identity.type === "session") {
        await prisma.session.upsert({
          where: { id: identity.id },
          create: { id: identity.id },
          update: { lastSeenAt: new Date() },
        });
      }

      const identityWhere =
        identity.type === "user" ? { userId: identity.id } : { sessionId: identity.id };

      await prisma.submission.create({
        data: { ...identityWhere, promptId, text: submission, evaluation },
      });

      const lessonPromptIds = prompt.lesson.prompts.map((p) => p.id);
      const submitted = await prisma.submission.findMany({
        where: { ...identityWhere, promptId: { in: lessonPromptIds } },
        distinct: ["promptId"],
        select: { promptId: true },
      });
      const submittedIds = new Set(submitted.map((s) => s.promptId));
      lessonCompleted = lessonPromptIds.every((id) => submittedIds.has(id));

      if (lessonCompleted) {
        if (identity.type === "user") {
          await prisma.completedLesson.upsert({
            where: { userId_lessonId: { userId: identity.id, lessonId: prompt.lesson.id } },
            create: { userId: identity.id, lessonId: prompt.lesson.id },
            update: {},
          });
        } else {
          await prisma.completedLesson.upsert({
            where: { sessionId_lessonId: { sessionId: identity.id, lessonId: prompt.lesson.id } },
            create: { sessionId: identity.id, lessonId: prompt.lesson.id },
            update: {},
          });
        }
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

The only changes from the current file: one new import (`checkRateLimit`), `getIdentity()` is now called once up-front (instead of inside the persistence `try` block), and the new rate-limit check sits between the prompt lookup and the Claude call. The persistence block is otherwise unchanged — it now reads the already-resolved `identity` variable instead of re-fetching it.

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual verification against a real dev server**

With `npm run dev` running and a fresh cookie jar, submit the same prompt 6 times in quick succession as the same guest identity (reuse a real `promptId` from `GET /api/lessons/<slug>`, e.g. via curl with `-c`/`-b` on a shared cookie file):

```bash
for i in 1 2 3 4 5 6; do
  curl -s -c jar.txt -b jar.txt -X POST http://localhost:3000/api/evaluate \
    -H "Content-Type: application/json" \
    -d '{"promptId":"<real-prompt-id>","submission":"<at least minWords words>"}' \
    -w " [status: %{http_code}]\n" -o /dev/null
done
```

Expected: submissions 1-5 return `status: 200`; submission 6 returns `status: 429`. Confirm via `npx prisma studio` (or a direct query) that exactly 5 `Submission` rows exist for that session, not 6 — the 6th request must not have reached the Claude call or persistence.

- [ ] **Step 5: Commit**

```bash
git add src/lib/rate-limit.ts src/app/api/evaluate/route.ts
git commit -m "feat: rate-limit /api/evaluate to cap Claude API cost exposure"
```

---

### Task 2: Build script runs migrations automatically

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: nothing later tasks depend on directly — this is an operational change that Task 3's Vercel deployment relies on implicitly (Vercel runs `npm run build`).

- [ ] **Step 1: Update the `build` script**

In `package.json`, change:

```json
    "build": "next build",
```

to:

```json
    "build": "prisma migrate deploy && next build",
```

- [ ] **Step 2: Verify locally**

Run: `npm run build`
Expected: Prisma reports no pending migrations (`No pending migrations to apply.` or equivalent — the dev database is already up to date from Phases 1-3), followed by a normal successful Next.js production build. This confirms the new build command works end-to-end before it's relied on in Vercel's build environment.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "build: run prisma migrate deploy before next build"
```

---

### Task 3: Deploy to Vercel and verify (no code changes)

**Files:** none — this task is Vercel project setup, Google Cloud Console configuration, and end-to-end verification against the live URL. Mirrors the "verification-only" task pattern used in Phases 2-3, but with real deployment steps that only the project owner can perform (creating a Vercel account/project, and changing Google Cloud Console settings).

**Interfaces:**
- Consumes: the rate-limited `/api/evaluate` from Task 1, the migration-aware build from Task 2.
- Produces: a live production URL. Nothing else depends on it.

- [ ] **Step 1: Create the Vercel project (manual)**

Sign in to Vercel (or create an account) and import the `bmalin92/rhetoripendium` GitHub repository as a new project. Accept Vercel's auto-detected Next.js framework settings — no custom build command override needed beyond what Task 2 already put in `package.json`.

- [ ] **Step 2: Set production environment variables in Vercel (manual)**

In the Vercel project's Settings → Environment Variables (Production scope), set:
- `DATABASE_URL` — Neon's **pooled** connection string for this project (Neon dashboard → same project → connection string with a `-pooler` hostname suffix), **not** the direct one from local `.env`.
- `ANTHROPIC_API_KEY` — same value as local `.env`.
- `AUTH_GOOGLE_ID` — same value as local `.env`.
- `AUTH_GOOGLE_SECRET` — same value as local `.env`.
- `AUTH_SECRET` — a **freshly generated** value, distinct from the local dev one. Generate with `openssl rand -base64 33` (run locally, paste the output directly into Vercel's dashboard — do not commit it anywhere).

- [ ] **Step 3: Deploy and note the URL**

Trigger the first deployment (Vercel deploys automatically once the project is created and env vars are set). Note the assigned `https://<project-name>.vercel.app` URL.

- [ ] **Step 4: Add the production redirect URI in Google Cloud Console (manual)**

Google Cloud Console → APIs & Services → Credentials → the existing OAuth 2.0 Client (created in Phase 3) → Authorized redirect URIs → add:

```
https://<project-name>.vercel.app/api/auth/callback/google
```

Keep the existing `http://localhost:3000/api/auth/callback/google` entry — both must coexist so local dev keeps working.

- [ ] **Step 5: Publish the OAuth consent screen (manual)**

Google Cloud Console → APIs & Services → OAuth consent screen → change publishing status from "Testing" to "In production." Confirm the prompt about the "unverified app" warning that users will see — this is expected and accepted per this phase's scope, not something to resolve now.

- [ ] **Step 6: Verify the live deployment**

Against the real `https://<project-name>.vercel.app` URL:

1. Guest flow: browse the dashboard, open a lesson, submit a prompt, confirm the evaluation renders and reloading the page still shows the same completion state.
2. Google sign-in: click "Sign in with Google," confirm the "unverified app" warning appears and can be clicked through ("Advanced" → "Go to \<project-name\> (unsafe)" or equivalent), confirm sign-in succeeds and a new `User` row appears in the production database (check via `npx prisma studio` pointed at the pooled `DATABASE_URL`, or Neon's own SQL editor).
3. Rate limiting: submit 6 prompts in quick succession as the same signed-in account; confirm the 6th is rejected (429 / friendly message in the UI) rather than calling Claude.
4. Migration correctness: confirm `npx prisma migrate status` (run locally with `DATABASE_URL` temporarily pointed at the production pooled connection string) reports the schema is up to date, with no drift.
5. Local dev regression: confirm `npm run dev` against `localhost:3000` still works — guest flow and Google sign-in both still succeed locally, proving the two `AUTH_SECRET` values and two redirect URIs coexist without interfering.

No commit for this task.

---

## Self-Review Notes

- **Spec coverage:** Rate Limiting (Task 1), Database Connection / pooled `DATABASE_URL` (Task 3 Step 2), Build Configuration (Task 2), Vercel Project Setup (Task 3 Steps 1-5), Testing/Verification Plan (Task 3 Step 6) — every section of `docs/superpowers/specs/2026-07-05-phase4-deployment-design.md` maps to a task.
- **Fail-open rate limiting:** `checkRateLimit`'s try/catch returning `true` on error is a deliberate implementation of the spec's "fails open on a DB error" constraint — matches the existing `/api/evaluate` persistence try/catch's established philosophy (never let a DB hiccup block a legitimate user action) exactly.
- **Type consistency:** `checkRateLimit(identity: Identity): Promise<boolean>` (Task 1) matches its single call site in `src/app/api/evaluate/route.ts` (Task 1, Step 2). `Identity` type is imported, not redefined, from `src/lib/identity.ts` (Phase 3), preventing drift.
- **No placeholders:** every step contains complete, copy-pasteable code or an exact command with expected output. Task 3's manual steps are inherently human/console actions (creating accounts, changing cloud console settings) — these are described precisely (exact menu paths, exact values) rather than left vague, which is the correct level of detail for a step no subagent can execute directly.
