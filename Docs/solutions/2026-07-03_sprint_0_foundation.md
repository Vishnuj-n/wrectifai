# Sprint 0 — Foundation (API Skeleton + DB Connection)

**Date**: 2026-07-03

## Problem

The backend API needed a standard, robust foundation including a database connection pool, a JWT authentication and RBAC authorization system, standard success/error response envelopes conforming to [DATA_API.md](file:///c:/Users/vishn/PROJECT/wrectifai/Docs/DATA_API.md), structured middlewares (CORS, parser, error boundaries, request logger), and the base routing skeleton for all functional domains.

## Solution

We implemented a zero-bloat, direct-driver PostgreSQL integration and JWT authentication framework in Express.

### Files Created

1. **`apps/api/src/config/database.ts`** — Sets up the connection pool using the native `pg` package (`pg.Pool`) using configuration variables loaded from the environment. Exports a timed `query` wrapper for profiling queries.
2. **`apps/api/src/utils/response.ts`** — Provides `success()` and `error()` handlers to guarantee that all API endpoints reply with a consistent envelope:
   - Success: `{ data, meta? }`
   - Error: `{ error: { code, message, details? } }`
3. **`apps/api/src/services/jwt.service.ts`** — Implements token signing and verification using `jsonwebtoken` for:
   - Access tokens (15m expiration, holds userId and role arrays)
   - Refresh tokens (7d expiration, holds userId)
4. **`apps/api/src/middleware/request-logger.ts`** — A custom, lightweight logging middleware tracking request methods, paths, status codes, and latency.
5. **`apps/api/src/middleware/auth.ts`** — Implements `authenticate` (validates Bearer tokens and loads payload into `req.user`) and `requireRole(allowedRoles)` (guarantees Role-Based Access Control).
6. **Domain Router Skeletons**:
   - `apps/api/src/modules/vehicles/vehicles.routes.ts`
   - `apps/api/src/modules/diagnosis/diagnosis.routes.ts`
   - `apps/api/src/modules/garages/garages.routes.ts`
   - `apps/api/src/modules/quotes/quotes.routes.ts`
   - `apps/api/src/modules/bookings/bookings.routes.ts`
   - `apps/api/src/modules/marketplace/marketplace.routes.ts`
   - `apps/api/src/modules/payments/payments.routes.ts`
   - `apps/api/src/modules/reviews/reviews.routes.ts`
   - `apps/api/src/modules/admin/admin.routes.ts` (Guarded to `admin` role)

### Files Modified

1. **`package.json`** — Added dependencies `pg`, `cors`, and `jsonwebtoken`, alongside devDependencies `@types/pg`, `@types/cors`, and `@types/jsonwebtoken`.
2. **`apps/api/src/config/env.ts`** — Added parser support for database url, jwt secrets, and cors origin list.
3. **`apps/api/src/middleware/error-handler.ts`** — Updated global error handling to map error objects into the standard `{ error: { code, message } }` envelope.
4. **`apps/api/src/services/health.service.ts`** — Updated health check to query the database (`SELECT 1`) to report database status.
5. **`apps/api/src/routes/index.ts`** — Mounted all new modules under `/api/v1` routes index and mapped health check.
6. **`apps/api/src/app.ts`** — Configured CORS, Express body parsing, request-logger, mounted versioned router, and registered error handler.

---

## Verification & Testing

1. **Type Safety & Build**: Checked and built successfully via Nx:
   ```bash
   npx nx build api
   ```
2. **Database Integration**: Checked health endpoint returns:
   ```json
   {
     "service": "wrectifai-api",
     "status": "ok",
     "database": "connected",
     "timestamp": "2026-07-03..."
   }
   ```
