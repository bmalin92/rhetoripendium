# Phase 4: Public Deployment

## Context

Phases 1-3 built a working single-developer app: lesson content, Claude-graded writing practice, server-side progress persistence, and optional Google sign-in with cross-device progress merge. Everything so far has only ever run against `localhost:3000`. Phase 4 makes the app reachable by other people, without yet buying a custom domain — a free platform-provided URL is good enough for now.

This app is a full Next.js application (API routes, server components/actions, a Postgres database via Prisma, server-side Anthropic API calls, and Auth.js OAuth callbacks) — not a static site. It cannot be hosted on GitHub Pages, which only serves static files. Vercel was chosen instead: it's built by the Next.js team, has first-class support for this exact stack, and its free tier provides a `<project>.vercel.app` URL with no domain purchase required.

Going from single-developer-local to publicly-reachable introduces one new risk that didn't exist before: `/api/evaluate` calls the paid Anthropic API on every submission, and a public URL invites abuse or accidental cost spikes. Phase 4 adds minimal rate limiting alongside the deployment itself, rather than shipping a public URL with no cost guardrail.

## Decisions

- **Vercel over GitHub Pages / Netlify / Render.** GitHub Pages is a non-starter (static-only). Vercel over Netlify/Render: native Next.js support (App Router, server actions, middleware) with zero adapter configuration, built by the framework's own maintainers.
- **Free tier, `*.vercel.app` subdomain.** No custom domain purchase in this phase — consistent with the user's stated constraint.
- **Auto-deploy from GitHub.** Push to `main` deploys to production; every PR gets its own preview deployment. No manual `vercel deploy` steps needed day-to-day.
- **Rate limiting is in scope for this phase**, not deferred further — the cost exposure from a public, unauthenticated-by-default endpoint calling a paid LLM API is a real risk from the moment the URL is public, not a "later" problem.
- **Database-backed rate limiting, reusing the existing `Submission` table** — no new table, no new service (e.g. Upstash Redis). Vercel's serverless functions are stateless and multi-instance, ruling out in-memory counters; the existing Postgres database (already the single source of truth for everything else in this app) is sufficient. Threshold: **5 submissions per 10 minutes per identity** (signed-in `userId` or anonymous `sessionId`, via the existing `getIdentity()`), generous enough for genuine practice, tight enough to cap abuse cost.
- **Production `DATABASE_URL` uses Neon's pooled (PgBouncer) connection string**, not the direct one used in local dev — required because each Vercel serverless invocation opens its own `@prisma/adapter-pg` connection pool, and concurrent invocations against Neon's direct endpoint can exhaust its connection limit. This is a connection-string swap in Vercel's env var settings, not a code or schema change.
- **Google OAuth consent screen moves to "In production."** Real public users need to be able to sign in without being pre-allowlisted. Users will see Google's standard "unverified app" click-through warning until/unless the app is later submitted for Google's verification process — acceptable for a small project at this stage, and out of scope to resolve now.
- **A separate, freshly generated `AUTH_SECRET` for production** — not shared with the local dev secret, since it signs/encrypts real users' session JWTs in production.
- **`prisma migrate deploy` runs automatically as part of the Vercel build**, so production schema stays in sync with every deploy without a manual migration step.
- **No code change expected for Auth.js host-trust.** Auth.js v5 auto-trusts the incoming host when the `VERCEL` environment variable is present (Vercel sets it automatically) — this is verified during Task testing rather than assumed, since it's the one piece of prod-only Auth.js behavior that can't be checked locally.

## 1. Rate Limiting

New helper, `src/lib/rate-limit.ts`:

```ts
export async function checkRateLimit(identity: Identity): Promise<boolean>
```

Returns `true` if the identity is within its limit (request may proceed), `false` if it has hit the limit (caller should reject). Implementation queries `prisma.submission.count()` with a `where` clause matching the identity's `sessionId` or `userId` and `submittedAt: { gte: <now - 10 minutes> } }`, comparing against the threshold constant (`5`).

`POST /api/evaluate` calls `checkRateLimit(identity)` immediately after resolving identity and before calling Claude. If it returns `false`, the route responds `429` with `{ "error": "rate_limited", "message": "You've submitted a lot in the last few minutes — try again shortly." }` and does not call the Anthropic API. If the identity is `null` (no session cookie and not signed in — shouldn't normally happen, since middleware mints a session cookie on first request, but handled defensively), the request is allowed through unchanged (existing behavior, unaffected by this phase).

## 2. Database Connection (Production)

No schema or code change. Operational change only: when setting `DATABASE_URL` in Vercel's project environment variables, use the pooled connection string from the Neon dashboard (same project, hostname suffixed `-pooler`) instead of the direct connection string used in `.env` for local dev.

## 3. Build Configuration

`package.json`'s `build` script changes from:
```json
"build": "next build"
```
to:
```json
"build": "prisma migrate deploy && next build"
```
This ensures every Vercel deploy applies any pending migrations to the production database before building, the same non-interactive command already used manually in this project's migration workflow (Phases 1-3).

## 4. Vercel Project Setup (manual, human-only)

1. Create a Vercel account (or sign in) and import the `bmalin92/rhetoripendium` GitHub repository as a new project.
2. Set project environment variables (Production scope): `DATABASE_URL` (Neon pooled connection string), `ANTHROPIC_API_KEY`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET` (freshly generated for production — `npx auth secret` locally, or any equivalent cryptographically random 32+ byte value, copied into Vercel's dashboard, never committed).
3. Deploy. Vercel assigns a `<project-name>.vercel.app` URL.
4. In Google Cloud Console, add `https://<project-name>.vercel.app/api/auth/callback/google` as an authorized redirect URI on the existing OAuth client (alongside the existing `localhost:3000` one — both remain valid simultaneously, so local dev keeps working).
5. In Google Cloud Console, switch the OAuth consent screen's publishing status from "Testing" to "In production."

## 5. Testing / Verification Plan

No automated test framework in this project (established norm) — verification against the real deployed URL and real production database:

1. `npx tsc --noEmit`, `npm run lint` — before deploying.
2. Guest flow on the live `.vercel.app` URL: browse dashboard, open a lesson, submit a prompt, confirm evaluation renders and completion persists on reload — mirrors every prior phase's guest regression check, now against production infrastructure.
3. Real Google sign-in on the live URL: confirm the "unverified app" warning appears and can be clicked through, sign-in succeeds, a `User` row is created in the production database.
4. Rate limiting: submit 6 prompts in quick succession as the same identity; confirm the 6th returns 429 with the friendly message rather than calling Claude, and that a 6th submission is not persisted.
5. Confirm `prisma migrate status` against the production `DATABASE_URL` shows no pending/drifted migrations after the first deploy.
6. Confirm the local dev flow (`localhost:3000`) still works unaffected — both Google OAuth redirect URIs and both `AUTH_SECRET` values coexist without interfering with each other.

## Out of Scope

- Custom domain purchase — explicitly deferred by the user for this phase.
- Google OAuth app verification (removing the "unverified app" warning) — a longer process not required to make the app reachable; revisit if the warning becomes a real adoption blocker.
- Server-side session revocation, account deletion/export — already deferred from Phase 3, still not needed.
- Monitoring/error tracking/observability tooling (e.g. Sentry) — not requested; Vercel's own deployment logs are sufficient for a single-developer-monitored app at this scale.
- Multi-region or scaling configuration — Vercel's defaults are sufficient at this traffic scale.
- Legal pages (privacy policy, terms of service) — not requested; worth revisiting before wider promotion, but out of scope for getting the app reachable.
