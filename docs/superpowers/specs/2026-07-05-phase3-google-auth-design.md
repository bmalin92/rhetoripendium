# Phase 3: Google Auth

## Context

Phase 2 gave every visitor persistent progress keyed by an anonymous, httpOnly session cookie (`rp_session`) — no login, no accounts. That progress is tied to one browser: clearing cookies or switching devices starts over. Phase 3 adds optional Google sign-in so progress can follow a person across devices, while keeping the anonymous flow fully intact for anyone who never signs in.

Phase 4 (public deployment) is not yet in scope — this phase only needs to work for a single developer/tester using a real Google account against a local dev server.

## Decisions

- **Sign-in is optional, not required.** The Phase 2 anonymous flow keeps working unmodified for guests. Signing in is what upgrades a visitor to cross-device progress.
- **Auth.js (NextAuth v5)** with the Google provider, not a hand-rolled OAuth flow or a hosted auth SaaS — it owns the OAuth2 exchange, CSRF protection, and Google ID-token verification, which is the security-sensitive part worth not reinventing.
- **JWT session strategy**, not Auth.js's database-session strategy — avoids a naming collision with the existing anonymous `Session` model and needs no new session table. Signing out simply clears the cookie; there is no server-side session list to revoke, which is acceptable at this scale.
- **Minimal custom `User` model**, not the full Auth.js Prisma adapter (`Account`/`VerificationToken` tables) — Google is the only planned provider, so multi-provider account-linking infrastructure isn't needed yet.
- **Merge, don't discard, existing anonymous progress.** The first time a given browser's `rp_session` cookie is used to sign in, its `CompletedLesson`/`Submission` rows are reassigned to the new `User`, additively. Signing in from a second browser that separately built up guest progress merges that batch in too — this is the intended "progress follows you across devices" behavior, not a bug to guard against.
- **`sessionId`/`userId` are mutually exclusive per row**, enforced in application code only (the data-access layer is already this project's sole writer for these tables) — no Postgres `CHECK` constraint, keeping the migration simple and consistent with Phase 2's style.

## 1. Data Model

```prisma
model User {
  id        String   @id @default(cuid())
  googleId  String   @unique   // Google's "sub" claim
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

`Session` (the anonymous-cookie model from Phase 2) is unchanged. `sessionId` becomes nullable on both dependent tables; exactly one of `sessionId`/`userId` is populated per row, going forward.

## 2. Identity Resolution

New `src/lib/identity.ts`:

```ts
type Identity = { type: "user"; id: string } | { type: "session"; id: string } | null;
```

`getIdentity()` calls Auth.js's `auth()` first. If a signed-in session exists, returns `{ type: "user", id: session.user.id }`. Otherwise falls back to the `rp_session` cookie exactly as Phase 2 did, returning `{ type: "session", id }` or `null` if neither is present.

`src/lib/data/progress.ts` and `POST /api/evaluate` switch their Prisma `where` clauses on this instead of always assuming `sessionId` — every other consumer (Server Components, `WritingPromptForm`) is unaffected, since they only see the already-resolved progress data, not the identity mechanism.

## 3. Auth Configuration & Merge

New files:
- `src/auth.ts` — Auth.js config: Google provider, `session: { strategy: "jwt" }`, `callbacks: { signIn, jwt, session }`. Exports `auth`, `handlers`, `signIn`, `signOut`.
- `src/app/api/auth/[...nextauth]/route.ts` — `export const { GET, POST } = handlers;`

New env vars (added to `.env.example`; real values in `.env`, never committed): `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`. A Google Cloud Console OAuth Client (Web application type) must be created manually, with an authorized redirect URI of `http://localhost:3000/api/auth/callback/google` for local development.

**Merge logic**, inside the `signIn` callback (runs within the OAuth callback request, so `cookies()` from `next/headers` is available):
1. Upsert `User` by `googleId` (Google's `sub` claim), setting email/name/image from the profile.
2. Read the `rp_session` cookie, if present.
3. In one transaction: reassign that session's `Submission` rows to the new `userId` (always safe — submissions are append-only history, no uniqueness constraint). For `CompletedLesson`, reassign rows that don't conflict with a lesson the user's account already has completed; drop the anonymous duplicate for any that do.
4. The whole merge step is wrapped in its own try/catch — a failure here logs and does not block sign-in; the user ends up signed in with their prior anonymous history left unmerged rather than being locked out.
5. The now-possibly-emptied anonymous `Session` row is left in place rather than deleted — harmless, not worth the extra complexity.

The leftover `rp_session` cookie itself is not cleared after a merge — harmless, since `getIdentity()` always prefers an active Auth.js session over the cookie when both exist.

## 4. UI Changes

A new `AuthHeader` server component, added to `src/app/layout.tsx` (which currently has no header/nav at all):
- **Signed out:** a "Sign in with Google" button — a form posting to a `"use server"` action that calls Auth.js's `signIn("google")`.
- **Signed in:** the user's name/avatar from their Google profile, plus a "Sign out" button (`signOut()`).

No other UI changes. The dashboard, lesson pages, and `WritingPromptForm` require zero modification — they already consume progress through `src/lib/data/progress.ts`, which is where the identity switch happens.

## 5. Testing / Verification Plan

Same established norm as Phase 2 — no automated test framework; verify via typecheck/lint plus a real dev server, real Postgres, and (new for this phase) a real Google account:

1. `npx tsc --noEmit`, `npm run lint`.
2. Guest flow re-verified via curl exactly as in Phase 2 — confirms zero regression for anonymous visitors who never sign in.
3. Real Google sign-in requires a human clicking through the actual OAuth consent screen in a browser — this can't be scripted with curl, and this environment's browser automation is unreliable for multi-step OAuth redirects. The developer performs this step manually; verification of its effects (DB rows, header state) happens server-side.
4. Merge correctness: build up guest progress, sign in, confirm via a database check that the relevant rows now carry `userId` instead of `sessionId`, and that the dashboard reflects the same completed/not-started state post-merge.
5. Sign-out verified: cookie cleared, UI reverts to guest state.

## Out of Scope

- Additional login providers (GitHub, email/password, etc.) — Google only, for now.
- Server-side session revocation (a signed-in-devices list, remote sign-out) — not available under the JWT strategy; would require switching to database sessions later if ever needed.
- Deleting/cleaning up orphaned anonymous `Session` rows after a merge.
- Rate limiting / abuse protection — still deferred to Phase 4, since the app isn't publicly reachable yet.
- Account deletion / data export flows.
