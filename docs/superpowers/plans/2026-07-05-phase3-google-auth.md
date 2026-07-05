# Phase 3: Google Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional Google sign-in on top of Phase 2's anonymous session-cookie progress model, so progress can follow a signed-in user across devices while guests keep working exactly as before.

**Architecture:** Auth.js (NextAuth v5) with the Google provider and JWT session strategy handles the OAuth exchange; a minimal custom `User` Prisma model stores just enough profile data to key progress rows; a new `getIdentity()` helper resolves either an authenticated user or the existing anonymous cookie and is the single switch point used by the two existing progress read/write paths (`src/lib/data/progress.ts`, `src/app/api/evaluate/route.ts`); a one-time merge step on first sign-in reassigns a browser's anonymous rows to the new account.

**Tech Stack:** Next.js 16.2.10 (App Router), TypeScript 5, Prisma 7.8.0 (`@prisma/adapter-pg`, Postgres/Neon), `next-auth@5.0.0-beta.31` (Google provider, JWT strategy), Tailwind CSS.

## Global Constraints

- Sign-in is optional. The Phase 2 anonymous flow (`rp_session` cookie, `src/middleware.ts`) must keep working unmodified for guests who never sign in.
- Session strategy is JWT (`session: { strategy: "jwt" }`) — no database-session table, no naming collision with the existing anonymous `Session` model.
- `User` model is minimal (`id`, `googleId`, `email`, `name`, `image`, timestamps) — no `Account`/`VerificationToken` tables, no Auth.js Prisma adapter. Google is the only provider.
- `sessionId`/`userId` are mutually exclusive per row on `CompletedLesson`/`Submission`, enforced in application code only — no Postgres `CHECK` constraint.
- Merging anonymous progress into a newly-signed-in account is additive, not destructive, and repeatable across multiple browsers signing into the same account over time. A merge failure must never block sign-in.
- Never print, echo, or expose the raw values of `DATABASE_URL`, `ANTHROPIC_API_KEY`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, or `AUTH_SECRET` in any command output, tool call, or communication.
- This project has no automated test framework. Verification is `npx tsc --noEmit`, `npm run lint`, manual/curl checks against a real `npm run dev` server and real Neon Postgres, plus (new for this phase) a real, human-driven Google OAuth sign-in — do not attempt to script the OAuth consent screen.
- `src/middleware.ts` must stay at `src/middleware.ts` (not project root) — this project uses `src/app/`, and Next.js silently no-ops root-level middleware in that layout.
- Path alias `@/*` maps to `./src/*` (confirmed in `tsconfig.json`).

---

## File Structure

```
prisma/
  schema.prisma                          # modify: add User model, make CompletedLesson/Submission dual-identity
src/
  auth.ts                                # create: Auth.js config (Google provider, JWT, callbacks)
  types/
    next-auth.d.ts                       # create: module augmentation for session.user.id / token.userId
  app/
    api/
      auth/[...nextauth]/route.ts        # create: Auth.js route handlers
      evaluate/route.ts                  # modify: use getIdentity() instead of raw cookie read
    layout.tsx                           # modify: add <AuthHeader /> to the body
  components/
    AuthHeader.tsx                       # create: sign-in/sign-out server component
  lib/
    identity.ts                         # create: getIdentity() helper
    auth/
      merge-progress.ts                  # create: anonymous -> account progress merge
    data/
      progress.ts                        # modify: use getIdentity() instead of raw cookie read
.env.example                             # modify: add AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_SECRET
```

---

### Task 1: Prisma schema — `User` model and dual-identity progress tables

**Files:**
- Modify: `prisma/schema.prisma:96-126`

**Interfaces:**
- Produces: `User` model (`id`, `googleId`, `email`, `name`, `image`, `createdAt`, `updatedAt`, back-relations `completedLessons`, `submissions`), used by Task 2's `signIn`/`jwt` callback and Task 3's merge logic.
- Produces: `CompletedLesson.userId` (nullable `String`) and its compound unique `userId_lessonId` (Prisma's default name for `@@unique([userId, lessonId])`), used by Task 4's rewritten `evaluate` route.
- Produces: `Submission.userId` (nullable `String`), used by Task 4.
- Consumes: nothing (first task).

- [ ] **Step 1: Replace lines 96-126 of `prisma/schema.prisma`**

Current content at those lines (the `Session`, `CompletedLesson`, `Submission` models):

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

Replace it with:

```prisma
model Session {
  id               String            @id
  createdAt        DateTime          @default(now())
  lastSeenAt       DateTime          @updatedAt
  completedLessons CompletedLesson[]
  submissions      Submission[]
}

model User {
  id        String   @id @default(cuid())
  googleId  String   @unique
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  completedLessons CompletedLesson[]
  submissions      Submission[]
}

model CompletedLesson {
  id          String   @id @default(cuid())
  sessionId   String?
  session     Session? @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  completedAt DateTime @default(now())

  @@unique([sessionId, lessonId])
  @@unique([userId, lessonId])
}

model Submission {
  id          String        @id @default(cuid())
  sessionId   String?
  session     Session?      @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  userId      String?
  user        User?         @relation(fields: [userId], references: [id], onDelete: Cascade)
  promptId    String
  prompt      WritingPrompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
  text        String
  evaluation  Json
  submittedAt DateTime      @default(now())

  @@index([sessionId, promptId])
  @@index([userId, promptId])
}
```

- [ ] **Step 2: Generate and apply the migration**

Run: `npx prisma migrate dev --name add_user_auth`

Expected: Prisma reports a new migration folder under `prisma/migrations/`, applies it to the dev database, and regenerates the client at `src/generated/prisma`. It will warn that it's making `sessionId` nullable on `CompletedLesson`/`Submission` — this is expected and safe since no rows currently violate the new dual-identity shape (every existing row already has a non-null `sessionId`).

- [ ] **Step 3: Verify the client typechecks**

Run: `npx tsc --noEmit`

Expected: no errors (this task only touches the schema/generated client; no application code references `User` yet).

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat: add User model and dual-identity progress tables"
```

---

### Task 2: Auth.js configuration with Google provider

**Files:**
- Create: `src/types/next-auth.d.ts`
- Create: `src/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `User` model from Task 1 (`prisma.user.upsert`).
- Produces: `auth()`, `signIn()`, `signOut()`, `handlers` exported from `@/auth`, used by Task 3 (merge logic, same file), Task 4 (`getIdentity()`), Task 5 (`AuthHeader`).
- Produces: `session.user.id: string` (typed via module augmentation), used by Task 4's `getIdentity()`.

- [ ] **Step 1: Install next-auth**

Run: `npm install next-auth@5.0.0-beta.31`

Expected: `package.json`/`package-lock.json` gain `next-auth` as a dependency; no peer-dependency warnings (already confirmed compatible with `next@16.2.10` and `react@19.2.4`).

- [ ] **Step 2: Set up the Google Cloud OAuth client (manual, one-time, human-only)**

This step cannot be performed by an agent — it requires the developer's own Google account:

1. Go to the Google Cloud Console → APIs & Services → Credentials.
2. Create an OAuth 2.0 Client ID of type "Web application".
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`.
4. Copy the generated Client ID and Client Secret.

Generate a random secret for Auth.js itself: `npx auth secret` (writes/prints a value — do not paste the value into any commit, chat message, or command that would echo it back).

Add to your local `.env` (not committed):
```
AUTH_GOOGLE_ID="<client-id-from-google-cloud-console>"
AUTH_GOOGLE_SECRET="<client-secret-from-google-cloud-console>"
AUTH_SECRET="<generated-secret>"
```

- [ ] **Step 3: Add placeholder entries to `.env.example`**

Current content (5 lines):

```
# Neon Postgres connection string (use the direct/non-pooled connection).
DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/rhetoripendium?sslmode=require"

# Anthropic API key — https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY="sk-ant-..."
```

Append:

```

# Google OAuth client — Google Cloud Console → APIs & Services → Credentials
# Authorized redirect URI (dev): http://localhost:3000/api/auth/callback/google
AUTH_GOOGLE_ID="000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Auth.js session encryption secret — generate with `npx auth secret`
AUTH_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

- [ ] **Step 4: Create `src/types/next-auth.d.ts`**

```ts
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
```

- [ ] **Step 5: Create `src/auth.ts`**

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.sub && profile.email) {
        const dbUser = await prisma.user.upsert({
          where: { googleId: profile.sub },
          create: {
            googleId: profile.sub,
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
          update: {
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
        });

        token.userId = dbUser.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.userId === "string") {
        session.user.id = token.userId;
      }
      return session;
    },
  },
});
```

Note: the `account && profile` guard is what makes this block run exactly once — right after a successful OAuth sign-in — and never again on later token refreshes, since `account`/`profile` are only passed to the `jwt` callback on that initial call. This is the hook Task 3's merge logic attaches to.

- [ ] **Step 6: Create the route handler `src/app/api/auth/[...nextauth]/route.ts`**

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 7: Verify typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors.

- [ ] **Step 8: Verify sign-in works end-to-end (manual)**

Start the dev server: `npm run dev`. In a browser, visit `http://localhost:3000/api/auth/signin`, choose Google, complete the real consent screen with your own Google account, and confirm you're redirected back signed in (Auth.js's default post-sign-in page is fine at this step — Task 5 adds the in-app header UI). Confirm a `User` row was created: `npx prisma studio` → `User` table shows one row with your `googleId`/`email`/`name`/`image` populated.

- [ ] **Step 9: Commit**

```bash
git add src/auth.ts src/types/next-auth.d.ts src/app/api/auth .env.example package.json package-lock.json
git commit -m "feat: add Auth.js Google sign-in"
```

---

### Task 3: Merge anonymous progress into a newly-signed-in account

**Files:**
- Create: `src/lib/auth/merge-progress.ts`
- Modify: `src/auth.ts` (the `jwt` callback from Task 2)

**Interfaces:**
- Consumes: `SESSION_COOKIE` from `@/lib/session` (`export const SESSION_COOKIE = "rp_session"`); `prisma` from `@/lib/db`; the `dbUser.id` computed in Task 2's `jwt` callback.
- Produces: `mergeAnonymousProgress(userId: string): Promise<void>`, called from `src/auth.ts`'s `jwt` callback. No other task depends on this function directly.

- [ ] **Step 1: Create `src/lib/auth/merge-progress.ts`**

```ts
import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session";

export async function mergeAnonymousProgress(userId: string): Promise<void> {
  try {
    const store = await cookies();
    const sessionId = store.get(SESSION_COOKIE)?.value;
    if (!sessionId) return;

    await prisma.$transaction(async (tx) => {
      await tx.submission.updateMany({
        where: { sessionId },
        data: { userId, sessionId: null },
      });

      const anonCompletions = await tx.completedLesson.findMany({
        where: { sessionId },
        select: { id: true, lessonId: true },
      });
      if (anonCompletions.length === 0) return;

      const existingUserLessonIds = new Set(
        (
          await tx.completedLesson.findMany({
            where: { userId },
            select: { lessonId: true },
          })
        ).map((c) => c.lessonId)
      );

      const toReassign = anonCompletions.filter((c) => !existingUserLessonIds.has(c.lessonId));
      const toDelete = anonCompletions.filter((c) => existingUserLessonIds.has(c.lessonId));

      if (toReassign.length > 0) {
        await tx.completedLesson.updateMany({
          where: { id: { in: toReassign.map((c) => c.id) } },
          data: { userId, sessionId: null },
        });
      }
      if (toDelete.length > 0) {
        await tx.completedLesson.deleteMany({
          where: { id: { in: toDelete.map((c) => c.id) } },
        });
      }
    });
  } catch (error) {
    console.error("Anonymous progress merge failed", error);
  }
}
```

`toDelete` rows are the anonymous browser's duplicate completions for a lesson the account already completed — dropped rather than reassigned, since `@@unique([userId, lessonId])` would otherwise reject a second row for the same pair. The `try/catch` at the top level means any failure here (including inside the transaction) is swallowed and logged: sign-in still succeeds, just without that merge.

- [ ] **Step 2: Wire the merge into `src/auth.ts`'s `jwt` callback**

In `src/auth.ts`, add the import:

```ts
import { mergeAnonymousProgress } from "@/lib/auth/merge-progress";
```

And change the `jwt` callback body from:

```ts
    async jwt({ token, account, profile }) {
      if (account && profile?.sub && profile.email) {
        const dbUser = await prisma.user.upsert({
          where: { googleId: profile.sub },
          create: {
            googleId: profile.sub,
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
          update: {
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
        });

        token.userId = dbUser.id;
      }

      return token;
    },
```

to:

```ts
    async jwt({ token, account, profile }) {
      if (account && profile?.sub && profile.email) {
        const dbUser = await prisma.user.upsert({
          where: { googleId: profile.sub },
          create: {
            googleId: profile.sub,
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
          update: {
            email: profile.email,
            name: typeof profile.name === "string" ? profile.name : null,
            image: typeof profile.picture === "string" ? profile.picture : null,
          },
        });

        token.userId = dbUser.id;

        await mergeAnonymousProgress(dbUser.id);
      }

      return token;
    },
```

- [ ] **Step 3: Verify typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors.

- [ ] **Step 4: Verify the merge manually**

With the dev server running and signed out: visit the dashboard as a guest, complete a full lesson (all its prompts) so at least one `CompletedLesson` and several `Submission` rows exist under your `rp_session` cookie. Note the lesson you completed. Then sign in with Google (`/api/auth/signin`). After redirect, check `npx prisma studio`:
- The `Submission` rows that were under your `sessionId` now show `userId` set and `sessionId` null.
- The `CompletedLesson` row for that lesson now shows `userId` set and `sessionId` null.

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/merge-progress.ts src/auth.ts
git commit -m "feat: merge anonymous progress into account on first sign-in"
```

---

### Task 4: Identity resolution — rewire progress reads and the evaluate route

**Files:**
- Create: `src/lib/identity.ts`
- Modify: `src/lib/data/progress.ts` (full file, 53 lines)
- Modify: `src/app/api/evaluate/route.ts:52-90`

**Interfaces:**
- Consumes: `auth()` from `@/auth` (Task 2); `SESSION_COOKIE` from `@/lib/session`.
- Produces: `getIdentity(): Promise<Identity>` where `type Identity = { type: "user"; id: string } | { type: "session"; id: string } | null`, consumed by `src/lib/data/progress.ts` and `src/app/api/evaluate/route.ts` in this task, and by no other file.

- [ ] **Step 1: Create `src/lib/identity.ts`**

```ts
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { SESSION_COOKIE } from "@/lib/session";

export type Identity = { type: "user"; id: string } | { type: "session"; id: string } | null;

export async function getIdentity(): Promise<Identity> {
  const session = await auth();
  if (session?.user?.id) {
    return { type: "user", id: session.user.id };
  }

  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  return sessionId ? { type: "session", id: sessionId } : null;
}
```

- [ ] **Step 2: Replace all 53 lines of `src/lib/data/progress.ts`**

```ts
import { prisma } from "@/lib/db";
import type { Evaluation } from "@/lib/evaluation/schema";
import { getIdentity } from "@/lib/identity";

export interface SubmissionView {
  id: string;
  text: string;
  evaluation: Evaluation;
  submittedAt: string;
}

export async function getCompletedLessonIds(): Promise<string[]> {
  const identity = await getIdentity();
  if (!identity) return [];

  const where = identity.type === "user" ? { userId: identity.id } : { sessionId: identity.id };

  const rows = await prisma.completedLesson.findMany({
    where,
    select: { lessonId: true },
  });
  return rows.map((r) => r.lessonId);
}

export async function getSubmissionHistoryByPrompt(
  promptIds: string[]
): Promise<Record<string, SubmissionView[]>> {
  const identity = await getIdentity();
  if (!identity || promptIds.length === 0) return {};

  const where =
    identity.type === "user"
      ? { userId: identity.id, promptId: { in: promptIds } }
      : { sessionId: identity.id, promptId: { in: promptIds } };

  const rows = await prisma.submission.findMany({
    where,
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

- [ ] **Step 3: Replace lines 52-90 of `src/app/api/evaluate/route.ts`**

Current content at those lines (the cookie import at the top of the file, plus the persistence block):

The top of the file currently reads:

```ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getPromptWithContext } from "@/lib/data/lessons";
import { evaluateSubmission } from "@/lib/claude";
import { SESSION_COOKIE } from "@/lib/session";
```

Replace with:

```ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getPromptWithContext } from "@/lib/data/lessons";
import { evaluateSubmission } from "@/lib/claude";
import { getIdentity } from "@/lib/identity";
```

Then, the persistence block currently at lines 52-90:

```ts
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
```

Replace with:

```ts
      let lessonCompleted: boolean | undefined;
      try {
        const identity = await getIdentity();

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
```

- [ ] **Step 4: Verify typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors. In particular, Prisma's generated types must accept `userId_lessonId` as a valid compound-unique selector on `completedLesson.upsert` — this comes directly from Task 1's `@@unique([userId, lessonId])`, which Prisma names `userId_lessonId` by default (mirroring the existing `sessionId_lessonId`).

- [ ] **Step 5: Verify guest flow has zero regression (curl)**

With `npm run dev` running and no `rp_session` cookie sent, confirm a fresh visit still mints one and progress still writes under it — same check as Phase 2's Task 6:

```bash
curl -i -c /tmp/rp-cookies.txt http://localhost:3000/ | head -20
```

Expected: response sets an `rp_session` cookie (via `src/middleware.ts`, unchanged by this task). Then exercise `POST /api/evaluate` with that cookie jar against a real prompt ID from `npx prisma studio`, and confirm the response still includes `evaluation` and `lessonCompleted`, and that a `Submission`/`CompletedLesson` row appears under that `sessionId` (not `userId`) in Prisma Studio.

- [ ] **Step 6: Verify signed-in flow still persists correctly (manual)**

Sign in via `/api/auth/signin`, submit a new prompt response through the running dev server's UI, and confirm in Prisma Studio that the new `Submission`/`CompletedLesson` rows carry `userId` (your account's id) and `sessionId` is null.

- [ ] **Step 7: Commit**

```bash
git add src/lib/identity.ts src/lib/data/progress.ts src/app/api/evaluate/route.ts
git commit -m "feat: resolve identity from Auth.js session or anonymous cookie"
```

---

### Task 5: `AuthHeader` UI

**Files:**
- Create: `src/components/AuthHeader.tsx`
- Modify: `src/app/layout.tsx` (full file, 33 lines)

**Interfaces:**
- Consumes: `auth`, `signIn`, `signOut` from `@/auth` (Task 2).
- Produces: `<AuthHeader />`, a server component rendered once, in `src/app/layout.tsx`. No other task depends on it.

- [ ] **Step 1: Create `src/components/AuthHeader.tsx`**

```tsx
import { auth, signIn, signOut } from "@/auth";

export async function AuthHeader() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-50 hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign in with Google
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        {session.user.name ?? session.user.email}
      </span>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Replace all 33 lines of `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthHeader } from "@/components/AuthHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rhetoripendium",
  description: "Learn the art of rhetoric and persuasion, one lesson at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="flex items-center justify-end border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
          <AuthHeader />
        </header>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors.

- [ ] **Step 4: Verify in the browser (manual)**

With `npm run dev` running, load `http://localhost:3000/` signed out — confirm a "Sign in with Google" button appears top-right. Click it, complete the real Google consent screen, and confirm you land back on the dashboard with your name (or email, if Google didn't return a name) and a "Sign out" button shown instead. Click "Sign out" and confirm it reverts to the "Sign in with Google" button.

- [ ] **Step 5: Commit**

```bash
git add src/components/AuthHeader.tsx src/app/layout.tsx
git commit -m "feat: add sign-in/sign-out header UI"
```

---

### Task 6: End-to-end verification (no code changes)

**Files:** none (verification only, mirrors Phase 2's Task 6).

**Interfaces:**
- Consumes: everything from Tasks 1-5.
- Produces: nothing — this is a gate before the final whole-branch review.

- [ ] **Step 1: Full typecheck and lint pass**

Run: `npx tsc --noEmit && npm run lint`

Expected: no errors, project-wide (not just the files touched by this branch).

- [ ] **Step 2: Guest-only regression pass**

With `npm run dev` running and a clean cookie jar (no `rp_session`, not signed in), browse the dashboard, open a lesson, submit a prompt, and confirm: the evaluation renders, the lesson's completion state updates, and reloading the page still shows the same progress — i.e., identical behavior to Phase 2, fully unaffected by this branch.

- [ ] **Step 3: Fresh-account sign-in pass**

Using a Google account that has never signed into this app before (or `npx prisma studio` → delete any existing test `User` row first), sign in via the header button. Confirm a new `User` row appears with correct `googleId`/`email`/`name`/`image`, and the dashboard shows zero completed lessons (nothing to merge, since this browser had no prior guest cookie in this test).

- [ ] **Step 4: Guest-progress-then-sign-in merge pass**

In a fresh incognito/private window (guaranteed no existing `rp_session` or Auth.js session), complete at least one full lesson as a guest. Note which lesson. Then sign in with Google from that same window. After redirect, confirm via `npx prisma studio`:
- The `Submission` rows from that guest session now carry `userId` (not `sessionId`).
- The `CompletedLesson` row for that lesson now carries `userId` (not `sessionId`).
- The dashboard (still in that same browser window) shows the lesson as completed post-sign-in — i.e., merge didn't just move rows in the DB, it's reflected live in the UI via `getIdentity()`.

- [ ] **Step 5: Repeat-merge / multi-browser pass**

From a second, different browser (or another private window with its own separate guest cookie), complete a different lesson as a guest, then sign into the same Google account used in Step 4. Confirm via Prisma Studio that this second lesson's rows also now carry the same `userId` — i.e., the account now shows both lessons completed, proving merges accumulate additively rather than overwriting.

- [ ] **Step 6: Sign-out pass**

While signed in, click "Sign out". Confirm the header reverts to "Sign in with Google" and the dashboard now shows guest-level progress again (whatever the current browser's `rp_session` cookie reflects — likely empty/fresh, since the merge step nulled out that cookie's rows).

- [ ] **Step 7: DB-failure resilience spot-check**

This mirrors Phase 2's Task 6 DB-failure check: temporarily point `DATABASE_URL` at an unreachable host (or stop local network access to Neon briefly), submit a prompt while signed in, and confirm the API still returns a rendered evaluation (`lessonCompleted: undefined` is acceptable) rather than a 500 — i.e., the existing two-stage try/catch in `/api/evaluate` still isolates DB failures from the Claude evaluation, unchanged by this branch's identity-branching logic. Restore `DATABASE_URL` afterward.

No commit for this task — proceed directly to the final whole-branch review.

---

## Self-Review Notes

- **Spec coverage:** Data Model (Task 1), Identity Resolution (Task 4), Auth Configuration & Merge (Tasks 2-3), UI Changes (Task 5), Testing/Verification Plan (Task 6) — every section of `docs/superpowers/specs/2026-07-05-phase3-google-auth-design.md` maps to a task.
- **Middleware interaction:** confirmed `src/middleware.ts`'s matcher (`["/((?!_next/static|_next/image|favicon.ico).*)"]`) already covers `/api/auth/*` — it only mints/propagates the anonymous cookie and never blocks a request, so Auth.js's own routes running through it is harmless and requires no change.
- **Implementation note vs. spec wording:** the spec describes the merge as running "inside the `signIn` callback." This plan implements it inside the `jwt` callback instead, guarded by `if (account && profile)` — the condition that is only true exactly once, immediately after a successful sign-in. This is the standard Auth.js v5 JWT-strategy pattern for doing sign-in-time DB work, and is functionally equivalent to what the spec described; the `signIn` callback name in the spec was descriptive of *when*, not a literal API requirement.
- **Type consistency:** `Identity` type (`src/lib/identity.ts`, Task 4) is used identically in `src/lib/data/progress.ts` and `src/app/api/evaluate/route.ts`. `userId_lessonId`/`sessionId_lessonId` compound-key names are consistent between Task 1's schema and Task 4's route usage. `mergeAnonymousProgress(userId: string)` signature (Task 3) matches its single call site in `src/auth.ts`.
- **No placeholders:** every step above contains complete, copy-pasteable code or an exact command with expected output.
