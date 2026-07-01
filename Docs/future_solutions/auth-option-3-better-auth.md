# Auth System Option 3: Better Auth / Lucia

**Date:** July 1, 2026
**Status:** Under consideration

---

## What Is Better Auth?

Open-source auth library that handles OAuth, phone/OTP, session management, and CSRF protection while you keep full ownership of your database and user model. No per-user pricing, no vendor lock-in.

---

## Current State

The existing auth implementation lives in:

- `apps/api/src/modules/auth/auth.service.ts` (518 lines) — manual OTP, session creation, token hashing, social login, refresh rotation
- `apps/api/src/modules/auth/auth.routes.ts` (256 lines) — 8 endpoints (`/register/send-otp`, `/register/verify`, `/login/send-otp`, `/login/verify`, `/social/:provider`, `/sessions/refresh`, `/logout`, `/me`)
- `apps/api/src/modules/auth/auth.middleware.ts` (96 lines) — `requireAuth` and `requireRole` functions with garage approval gating
- `apps/web/src/middleware.ts` (123 lines) — reads `wrect_at`, `wrect_rt`, `wrect_role` cookies, calls `/auth/me`, enforces role-based redirects
- `apps/web/src/components/auth/` — login-form, register-form, verify-form, session-guard, logout-button, auth-shell

Feature routes that consume auth middleware:

| File | Guarded endpoints |
|------|-------------------|
| `garage.routes.ts` | 17 endpoints with `requireAuth, requireRole('garage')` |
| `users.routes.ts` | 12 endpoints with `requireAuth` / `requireRole('user')` |
| `vehicles.routes.ts` | Module-level `requireAuth, requireRole('user')` |
| `payments.routes.ts` | Module-level `requireAuth, requireRole('user')` |
| `marketplace.routes.ts` | Module-level `requireAuth, requireRole('user')` |
| `diagnosis.routes.ts` | Module-level `requireAuth, requireRole('user')` |
| `admin.routes.ts` | Module-level `requireAuth, requireRole('admin')` |

Frontend files using `SessionGuard`:

- `service-intake-flow.tsx`
- `garage-dashboard-shell.tsx`
- `user-dashboard-shell.tsx`
- `admin-dashboard-shell.tsx`
- `vendor/dashboard/page.tsx`
- 10+ user dashboard client components

Database tables currently involved in auth:

- `auth_sessions` — access/refresh token pairs, expiry, IP, user-agent
- `otp_challenges` — OTP codes, purpose, expiry, consumption tracking
- `user_social_accounts` — provider + social subject links
- `sms_events` — audit log for OTP sends
- `users` — phone, full_name
- `user_roles` — user-to-role mapping
- `roles` — user/garage/vendor/admin definitions
- `garages` — has `owner_user_id`, `is_approved`, `verification_status`

---

## What Gets Deleted

These files serve no purpose once Better Auth owns the auth lifecycle:

- `apps/api/src/modules/auth/auth.service.ts` — 518 lines replaced by Better Auth's internal session/OTP/OAuth management
- `apps/api/src/modules/auth/auth.routes.ts` — 256 lines replaced by Better Auth's auto-generated route tree
- `apps/api/src/modules/auth/auth.middleware.ts` — 96 lines replaced by a thin adapter wrapping Better Auth's session check
- `apps/web/src/components/auth/session-guard.tsx` — 98 lines replaced by `useSession()` hook or `authClient.getSession()`
- `apps/web/src/components/auth/logout-button.tsx` — 44 lines replaced by `signOut()` from the client SDK

---

## What Gets Rewritten

### Frontend Auth Forms

All under `apps/web/src/components/auth/`:

| File | Current behavior | Better Auth version |
|------|-----------------|---------------------|
| `login-form.tsx` | POSTs to `/auth/login/send-otp` | Calls `signIn.phone({ phone })` |
| `register-form.tsx` | POSTs to `/auth/register/send-otp` with fullName + roleCode | Calls `signUp.phone({ phone, name, roleCode })` with custom fields |
| `verify-form.tsx` | POSTs to `/auth/register/verify` or `/auth/login/verify` with 6-digit OTP | Better Auth's OTP verification callback — no manual endpoint |

### Next.js Middleware

Currently reads `wrect_at`, `wrect_rt`, `wrect_role` cookies, then calls `GET /auth/me`. With Better Auth:
- Use `authClient.getSession()` in server components, or
- Read Better Auth's session cookie (`better-auth.session_token` by default)

The role-based redirect logic (checking `requiredRole !== role`, garage approval gate) stays. Only the session resolution mechanism changes.

### Express Type Augmentation

`apps/api/src/types/express.d.ts` currently declares `authUser?: AuthUser` on `Request`. With Better Auth, populate this from `auth.api.getSession({ headers: req.headers })` in a thin middleware, keeping the same `AuthUser` shape so feature routes remain untouched.

---

## Database Schema Changes

### Tables to Drop

| Table | Reason |
|-------|--------|
| `auth_sessions` | Better Auth's `session` table replaces it |
| `otp_challenges` | Better Auth's `verification` table replaces it |
| `user_social_accounts` | Better Auth's `account` table replaces it |
| `sms_events` | Optional to keep for audit; Better Auth doesn't need it |

### Tables That Stay Unchanged

| Table | Why |
|-------|-----|
| `users` | Business data (phone, full_name). Collision with Better Auth's `user` table needs resolution — see below |
| `user_roles` | RBAC mapping. Better Auth doesn't handle multi-role assignment |
| `roles` | Role definitions |
| `garages` | Business entity with approval status |

### The `users` Table Collision

Better Auth expects its own `user` table with `id`, `name`, `email`, `image`. The existing `users` table has `id`, `phone`, `full_name`. Two paths:

- **Path A**: Let Better Auth own `user`, add `phone` as a custom field, drop the existing `users` table
- **Path B** (recommended): Keep the existing `users` table, configure Better Auth to use a custom user model, disable Better Auth's default `user` table creation. Preserves foreign keys in `user_roles`, `garages`, etc.

---

## New Files to Create

```
apps/api/src/lib/auth.ts                      # Server-side Better Auth instance
apps/api/src/auth-handler.ts                  # Express route mounting (replaces authRouter)
apps/api/src/middleware/auth-session.ts       # Populates req.authUser from Better Auth session
apps/web/src/lib/auth-client.ts               # Browser-side Better Auth client
apps/web/src/app/api/auth/[...all]/route.ts   # Next.js catch-all proxy to Better Auth
```

Server config would look roughly like:

```ts
import { betterAuth } from "better-auth";
import { phone, social } from "better-auth/plugins";
import { pool } from "./db";

export const auth = betterAuth({
  database: { type: "postgres", pool },
  user: {
    additionalFields: {
      phone: { type: "string", required: true },
      full_name: { type: "string", required: false },
    },
  },
  plugins: [
    phone({
      sendOTP: async (phone, code) => {
        // Twilio/Vonage integration
      },
    }),
    social([
      { provider: "google", clientId: "...", clientSecret: "..." },
      { provider: "apple", clientId: "...", clientSecret: "..." },
    ]),
  ],
  session: {
    expiresIn: 60 * 15,          // 15 min (matches current ACCESS_TTL_MS)
    updateAge: 60 * 60 * 24 * 7, // 7 days (matches current REFRESH_TTL_MS)
  },
});
```

---

## Feature Routes — Minimal Touch

These 7 files import `requireAuth` and `requireRole`. They don't contain auth logic — they just guard endpoints. The only change is updating the import path. If the new middleware exports the same function signatures and the same `AuthUser` shape on `req.authUser`, zero logic changes.

---

## Garage Approval Flow

The current middleware blocks unapproved garages from everything except `/profile` (lines 84-95 of `auth.middleware.ts`). Better Auth doesn't know about garage approval. Implement this as either:

- A custom middleware running after Better Auth's session check, querying the `garages` table
- A callback in Better Auth's session hook that injects `garageApproved` into the session object

Either way, approximately 20 lines of custom code.

---

## `req.authUser` Shape

Every feature route accesses `req.authUser.userId`, `.roleCode`, `.fullName`, `.phone`. Better Auth's session object gives `session.userId` and `session.role` but not `fullName` or `phone` directly. The new middleware would:

1. Call `auth.api.getSession({ headers: req.headers })`
2. Fetch `full_name` and `phone` from the users table (or from an enriched session)
3. Populate `req.authUser` with the same shape

Feature routes stay untouched as a result.

---

## Frontend API Client Changes

`apps/web/src/lib/api.ts` has a `fetchWithRefresh` function that catches 401s and calls `/auth/sessions/refresh`. With Better Auth, the client SDK handles token refresh automatically. Replace `fetchWithRefresh` with Better Auth's `authClient` or a simpler wrapper.

---

## Effort Estimate

| Category | Effort | Risk |
|----------|--------|------|
| Delete old auth files | Low | None |
| Better Auth server config | Medium | Medium — custom user model mapping |
| DB migration (drop old tables, map users) | Medium | High if production data exists |
| Rewrite frontend auth forms | Medium | Low |
| New middleware wrapper | Low | Low |
| Garage approval custom logic | Low | Low |
| Feature route import updates | Low | None |
| `fetchWithRefresh` replacement | Low | Low |
| **Total** | **2-3 days** | **Moderate** |

---

## Gains vs. Losses

### Gains
- Google/Apple OAuth works out of the box with proper token exchange
- CSRF protection, rate limiting, bot detection built in
- Session management (rotation, expiry, revocation) handled internally
- Community-maintained security patches
- No per-user pricing — open source

### Losses
- ~500 lines of existing auth code becomes dead code
- Full control over token shape, session lifecycle, cookie config
- Familiar codebase — need to learn Better Auth's plugin model and config API

### Neutral
- Feature route files barely change (import path swap)
- Business tables (`garages`, `roles`, `user_roles`) stay untouched
- Auth page URLs (`/auth/login`, `/auth/register`, `/auth/verify`) stay the same
- RBAC enforcement stays identical in behavior
