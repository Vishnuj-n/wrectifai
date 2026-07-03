# SPRINT.md — Full-Stack Integration Plan for WRECTIFAI

**Created**: 2026-07-03
**Updated**: 2026-07-03
**Goal**: Replace all hardcoded frontend data with live API calls. Each sprint delivers a working vertical slice: backend API + frontend integration + tests.

---

## Current State Assessment

### What Exists
| Layer | Status |
|-------|--------|
| PostgreSQL Schema | 20 tables migrated (`db/migrations/001_initial_schema.sql`) |
| API (Express) | **Sprint 0 done** — DB pool, JWT, auth middleware, response helpers, route skeletons |
| Web (Next.js) | 15+ pages built, **all data hardcoded**, **zero API calls** |
| Mobile (Expo/RN) | Minimal — home screen + navigation shell |
| Docker Compose | PostgreSQL configured with auto-migration |
| Frontend API Client | **Does not exist** |
| State Management | `useState` only — no shared state, no context providers |

### Sprint 0 Completed (2026-07-03)
- `apps/api/src/config/database.ts` — PostgreSQL connection pool via `pg`
- `apps/api/src/utils/response.ts` — `success()` / `error()` envelope
- `apps/api/src/services/jwt.service.ts` — access + refresh token signing/verification
- `apps/api/src/middleware/auth.ts` — `authenticate` + `requireRole`
- `apps/api/src/middleware/request-logger.ts` — request logging
- `apps/api/src/middleware/error-handler.ts` — global error handler
- Domain router skeletons (vehicles, diagnosis, garages, quotes, bookings, marketplace, payments, reviews, admin)
- `apps/api/src/routes/index.ts` — all modules mounted under `/api/v1`

### What's Hardcoded (Frontend)
| Page | File | Hardcoded Data |
|------|------|----------------|
| Home Dashboard | `data.tsx` | navItems, categoryItems, maintenanceItems, garages[], seasonalDeals[], careTips[], overviewItems[], emergencyItems[], promoItems[] |
| Garage Listing | `garages-page.tsx` | 12 garage objects with ratings, distances, chips |
| Quotes | `quotes-page.tsx` | quotesList[], aiEstimatedQuoteRange, quoteContextDefaultIssueIds (from `quotes-shared.ts`) |
| Deals & Offers | `deals-page.tsx` | 18 deal items duplicated x3 for pagination |
| AI Diagnosis | `ai-diagnose-page.tsx` | legacyResultIssues[], legacyResultSummaryItems[], resultNextSteps[], analyzing steps |
| Diagnosis Config | `issue-intake-config.ts` | 6 issue categories, 24 questions, 18 possible issue results |
| Diagnosis Flow | `diagnose-flow-shared.tsx` | resultIssues[] shared across pages |

---

## Testing Strategy

### Principles
1. **Test the foundation first** — JWT and auth are the highest-risk code
2. **One integration test per feature** — prove the full stack works
3. **No test framework yet** — use `vitest` for backend (fast, ESM-native, Jest-compatible API)
4. **No frontend tests until Sprint 3** — UI changes too fast during integration

### What to Test Per Sprint

| Sprint | Must Test | Should Test | Skip |
|--------|-----------|-------------|------|
| 0.5 | API client (unit) | Auth hook (unit) | — |
| 1 | JWT sign/verify, auth middleware, RBAC | Login flow (integration) | Frontend UI |
| 2 | Vehicle CRUD (integration), permission checks | Vehicle selector component | — |
| 3 | Diagnosis submission (integration), LLM prompt/output | Media upload | — |
| 4 | Garage search (integration), geo-distance | Onboarding flow | — |
| 5 | Quote lifecycle (integration), status transitions | — | — |
| 6 | Booking status machine (integration), payment webhook | Stripe integration | — |
| 7 | Cart + inventory (integration), order flow | — | — |
| 8 | Badge recompute, admin moderation | — | — |
| 9 | Notification dispatch | — | End-to-end flow |

### Test File Locations
```
apps/api/src/
├── modules/
│   ├── auth/
│   │   ├── auth.service.test.ts
│   │   └── auth.routes.test.ts
│   ├── vehicles/
│   │   ├── vehicles.service.test.ts
│   │   └── vehicles.routes.test.ts
│   └── ...
└── middleware/
    ├── auth.test.ts
    └── role-check.test.ts

apps/web/src/
├── lib/
│   └── api-client.test.ts      (from Sprint 0.5)
```

---

## Sprint Plan

### Sprint 0 — Foundation (API skeleton + DB connection)
**Status**: COMPLETED (2026-07-03)
**Duration**: 2 days

- [x] PostgreSQL connection pool (`pg.Pool`)
- [x] `database.ts` with connection string from env
- [x] `modules/` folder structure per domain
- [x] Middleware stack: CORS, body-parser, error-handler, request-logger
- [x] JWT infrastructure: token generation, verification, refresh tokens
- [x] Response helpers (`success()`, `error()` envelope per DATA_API.md)
- [x] Docker Compose verified with PostgreSQL + migrations

**Deliverable**: API boots, connects to DB, returns `{ data }` envelope.

---

### Sprint 0.5 — Frontend Foundation (API client + auth hook)
**Duration**: 1 day
**Depends on**: Sprint 0

#### Backend
- [ ] No backend changes (Sprint 0 foundation is sufficient)

#### Frontend Integration
- [ ] Create `apps/web/src/lib/api-client.ts`
  - Base URL from `NEXT_PUBLIC_API_URL` env var
  - Automatic `Authorization: Bearer <token>` header injection
  - Token refresh on 401 response (silent retry)
  - Response envelope unwrapping (extract `data` from `{ data }`)
  - Error normalization (extract `error` from `{ error }`)
  - Request/response interceptors for logging
- [ ] Update `apps/web/.env` — set `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`
- [ ] Create `apps/web/src/lib/auth-context.tsx`
  - `AuthProvider` with `user`, `token`, `isAuthenticated` state
  - `login(token)` / `logout()` methods
  - Persist tokens to `localStorage` (accessible to api-client)
  - Auto-load user from stored token on app mount
- [ ] Wrap app root in `<AuthProvider>`
- [ ] Update `TopNavbar` to consume auth context (show user name/avatar or login button)

#### Tests
- [ ] `apps/web/src/lib/api-client.test.ts` — unit tests for:
  - Base URL construction
  - Auth header injection
  - Response envelope unwrapping
  - Error normalization
  - 401 retry logic

**Deliverable**: Frontend can make authenticated API calls; auth state is global.

---

### Sprint 1 — Auth + RBAC (Google OAuth Only)
**Duration**: 3-4 days
**Depends on**: Sprint 0.5
**API Endpoints**: §1 of DATA_API.md

#### Backend
- [ ] `POST /auth/google` — verify Google ID token → login/register, issue JWT access + refresh tokens
- [ ] `POST /auth/refresh` — rotate access token
- [ ] `POST /auth/logout` — invalidate refresh token
- [ ] Auth middleware: extract user + roles from JWT, attach to `req.user`
- [ ] Role-check middleware: verify `user_roles` mapping (not profile inference)
- [ ] Seed default roles on first run (already in migration)

#### Frontend Integration
- [ ] Integrate Google Login button (`@react-oauth/google`) → `POST /auth/google`
- [ ] Store tokens via auth context (`login()` method)
- [ ] Wire TopNavbar to show logged-in user from JWT payload
- [ ] Protect routes: redirect to login if unauthenticated
- [ ] Handle token expiry: auto-refresh or redirect to login

#### Tests
- [ ] `apps/api/src/middleware/auth.test.ts` — unit tests for:
  - Valid token → `req.user` populated
  - Missing token → 401
  - Expired token → 401
  - Invalid signature → 401
- [ ] `apps/api/src/modules/auth/auth.service.test.ts` — unit tests for:
  - JWT sign/verify roundtrip
  - Token expiry (access 15m, refresh 7d)
  - Refresh token rotation
- [ ] `apps/api/src/modules/auth/auth.routes.test.ts` — integration test:
  - POST /auth/google with mock Google token → user created + tokens returned
  - POST /auth/refresh with valid refresh → new access token
  - POST /auth/logout → refresh token invalidated

**Deliverable**: Users can register, login, and hit protected routes. Auth flow works end-to-end.

---

### Sprint 2 — Vehicle Management
**Duration**: 2-3 days
**Depends on**: Sprint 1
**API Endpoints**: §2 of DATA_API.md

#### Backend
- [ ] `GET /vehicles` — list customer's vehicles
- [ ] `POST /vehicles` — add vehicle
- [ ] `GET /vehicles/:vehicleId` — get single vehicle
- [ ] `PATCH /vehicles/:vehicleId` — update vehicle
- [ ] `DELETE /vehicles/:vehicleId` — soft/hard delete
- [ ] Permission: only owner can modify their vehicle

#### Frontend Integration
- [ ] Create `apps/web/src/pages/vehicles/` — vehicles list page
  - Fetch `GET /vehicles` on mount
  - Loading skeleton, error state, empty state
  - Add vehicle modal/form
  - Edit/delete with confirmation
- [ ] Create `apps/web/src/components/common/vehicle-selector.tsx`
  - Dropdown/popover showing user's vehicles
  - Select vehicle → returns vehicle ID
  - Used by diagnosis and quotes pages
- [ ] Replace hardcoded "Honda City (TS07 AB 1234)" in:
  - `apps/web/src/pages/quotes/quotes-page.tsx:535`
  - `apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx:979`
- [ ] Wire vehicle selector into diagnosis flow and quote request form

#### Tests
- [ ] `apps/api/src/modules/vehicles/vehicles.service.test.ts` — integration test:
  - CRUD operations (create, read, update, delete)
  - Permission: owner can modify, other user cannot
  - Soft delete: vehicle marked inactive, not returned in list
- [ ] `apps/api/src/modules/vehicles/vehicles.routes.test.ts` — integration test:
  - GET /vehicles with auth → returns user's vehicles
  - POST /vehicles with auth → vehicle created
  - PATCH /vehicles/:id by owner → updated
  - PATCH /vehicles/:id by other user → 403
  - DELETE /vehicles/:id → soft deleted

**Deliverable**: Users can manage vehicles; diagnosis/quotes reference real vehicle data.

---

### Sprint 3 — AI Diagnosis Engine
**Duration**: 4-5 days
**Depends on**: Sprint 2
**API Endpoints**: §3 of DATA_API.md

#### Backend
- [ ] `POST /diagnosis` — submit symptoms + media → create diagnosis request
- [ ] `GET /diagnosis/:diagnosisId` — fetch results
- [ ] `GET /diagnosis/:diagnosisId/recommendations` — get DIY/garage recommendations
- [ ] Media upload handling (image/video/audio → storage + `diagnosis_media` table)
- [ ] LLM integration: send symptoms + vehicle history → structured diagnosis output
- [ ] Confidence scoring, risk level classification, DIY safety gate
- [ ] Persist results to `diagnosis_results` table

#### Frontend Integration
- [ ] Create `apps/web/src/lib/diagnosis-api.ts` — diagnosis-specific API calls
- [ ] Replace `issue-intake-config.ts` hardcoded categories with API-driven flow (or keep as prompt templates sent to backend)
- [ ] Replace `legacyResultIssues[]` in `ai-diagnose-page.tsx` with API response
- [ ] Replace hardcoded "Honda City" in results screen with actual vehicle from selector
- [ ] Wire media upload tabs (Photo/Video/Audio) to actual upload endpoint
- [ ] Replace hardcoded confidence gauge (92%) with real `confidence_score`
- [ ] Wire "Request Quotes" button to create a `quote_request`

#### Tests
- [ ] `apps/api/src/modules/diagnosis/diagnosis.service.test.ts` — integration test:
  - Submit diagnosis → results returned with confidence score
  - Media upload → stored and linked to diagnosis
  - Vehicle history context included in LLM prompt
- [ ] `apps/api/src/modules/diagnosis/diagnosis.routes.test.ts` — integration test:
  - POST /diagnosis with auth + vehicle → diagnosis created
  - GET /diagnosis/:id → results with recommendations
  - GET /diagnosis/:id without auth → 401

**Deliverable**: Users submit symptoms, get AI-powered diagnosis with real vehicle, can request quotes.

---

### Sprint 4 — Garage Discovery + Onboarding
**Duration**: 4-5 days
**Depends on**: Sprint 2 (parallel with Sprint 3)
**API Endpoints**: §4 + §5 of DATA_API.md

#### Backend
- [ ] `GET /garages/search` — geo-filtered search (lat/lng/distance/price/rating/specialization)
- [ ] `GET /garages/:garageId` — public profile
- [ ] `GET /garages/:garageId/slots` — available time slots
- [ ] `POST /garage/onboarding` — garage self-registration
- [ ] `PATCH /garage/profile` — update profile
- [ ] `POST /garage/documents` — upload license/cert files
- [ ] `POST /garage/services` — add services
- [ ] `PATCH /garage/services/:serviceId` — update service
- [ ] GeoPostGIS or haversine distance calculation

#### Frontend Integration
- [ ] Create `apps/web/src/lib/garages-api.ts` — garage-specific API calls
- [ ] Replace hardcoded `garages[]` in `garages-page.tsx:120` with API search results
- [ ] Replace hardcoded `garages[]` in `data.tsx:83` with API data
- [ ] Wire filter/sort UI to query params (rating, distance, serviceType, responseTime)
- [ ] Build garage profile detail page from API data
- [ ] Build garage onboarding flow (multi-step form)
- [ ] Loading states, error handling, empty states for search results

#### Tests
- [ ] `apps/api/src/modules/garages/garages.service.test.ts` — integration test:
  - Search with geo-coordinates → results sorted by distance
  - Filter by rating, price, specialization
  - Onboarding: create garage → pending approval
  - Services CRUD
- [ ] `apps/api/src/modules/garages/garages.routes.test.ts` — integration test:
  - GET /garages/search → returns filtered results
  - POST /garage/onboarding → garage created (pending)
  - PATCH /garage/profile by owner → updated

**Deliverable**: Garages from DB; customers search/filter; garage owners onboard.

---

### Sprint 5 — Quote System
**Duration**: 3-4 days
**Depends on**: Sprint 3 + Sprint 4
**API Endpoints**: §6 of DATA_API.md

#### Backend
- [ ] `POST /quotes/requests` — customer creates quote request
- [ ] `GET /quotes/requests/:requestId` — view request (owner/garages/admin)
- [ ] `POST /quotes/requests/:requestId/quotes` — garage submits quote
- [ ] `GET /quotes/requests/:requestId/quotes` — list quotes for request
- [ ] `POST /quotes/:quoteId/select` — customer selects a quote
- [ ] Status transitions: open → quoted → selected/expired/cancelled

#### Frontend Integration
- [ ] Create `apps/web/src/lib/quotes-api.ts` — quote-specific API calls
- [ ] Replace hardcoded `quotesList[]` in `quotes-page.tsx` with API data
- [ ] Replace hardcoded `aiEstimatedQuoteRange` with AI-generated estimate from diagnosis
- [ ] Wire "Compare Quotes" flow to real quote data
- [ ] Wire "Select Garage" to `POST /quotes/:quoteId/select`
- [ ] Replace hardcoded request summary sidebar with real data
- [ ] Real-time updates or polling for new quotes

#### Tests
- [ ] `apps/api/src/modules/quotes/quotes.service.test.ts` — integration test:
  - Create quote request → status is "open"
  - Garage submits quote → request status becomes "quoted"
  - Customer selects quote → status becomes "selected"
  - Expired quotes → status becomes "expired"
- [ ] `apps/api/src/modules/quotes/quotes.routes.test.ts` — integration test:
  - POST /quotes/requests with auth → request created
  - POST /quotes/requests/:id/quotes as garage → quote submitted
  - POST /quotes/:id/select as customer → quote selected

**Deliverable**: Full quote lifecycle works end-to-end.

---

### Sprint 6 — Bookings + Payments
**Duration**: 4-5 days
**Depends on**: Sprint 5
**API Endpoints**: §7 + §8 of DATA_API.md

#### Backend
- [ ] `POST /bookings/instant` — instant booking from garage slot
- [ ] `POST /bookings/from-quote/:quoteId` — booking from selected quote
- [ ] `GET /bookings` — role-scoped list
- [ ] `GET /bookings/:bookingId` — booking detail
- [ ] `PATCH /bookings/:bookingId/status` — status transitions
- [ ] `POST /payments/intent` — create Stripe/payment intent
- [ ] `POST /payments/confirm` — confirm payment
- [ ] `POST /payments/webhook` — handle gateway callbacks
- [ ] `GET /payments/:paymentId` — payment detail
- [ ] Booking status machine: pendingPayment → confirmed → inService → completed → cancelled

#### Frontend Integration
- [ ] Create `apps/web/src/lib/bookings-api.ts` — booking-specific API calls
- [ ] Create `apps/web/src/lib/payments-api.ts` — payment-specific API calls
- [ ] Build booking flow UI (slot selection → confirm → payment)
- [ ] Build bookings list page with status badges
- [ ] Integrate Stripe checkout (or chosen payment gateway)
- [ ] Replace hardcoded overview stats ("Upcoming Bookings: 2", "Part Orders: 3", etc.) in `data.tsx:303`
- [ ] Webhook confirmation → update booking status in UI

#### Tests
- [ ] `apps/api/src/modules/bookings/bookings.service.test.ts` — integration test:
  - Instant booking → status is "pendingPayment"
  - Booking from quote → linked to quote
  - Status transitions: pendingPayment → confirmed → inService → completed
  - Cancel → status becomes "cancelled"
- [ ] `apps/api/src/modules/payments/payments.service.test.ts` — integration test:
  - Create payment intent → returns client secret
  - Confirm payment → booking status updates
  - Webhook → payment recorded

**Deliverable**: Customers book garages and pay through the platform.

---

### Sprint 7 — Marketplace (Products + Cart + Orders)
**Duration**: 4-5 days
**Depends on**: Sprint 6 (can run parallel)
**API Endpoints**: §9 of DATA_API.md

#### Backend
- [ ] `GET /products` — public product catalog
- [ ] `POST /products` — seller creates product (garage/vendor/admin)
- [ ] `PATCH /products/:productId` — update product
- [ ] `GET /products/:productId` — product detail
- [ ] `POST /cart/items` — add to cart
- [ ] `GET /cart` — view cart
- [ ] `POST /orders/checkout` — place order
- [ ] `GET /orders` — role-scoped order list
- [ ] `PATCH /orders/:orderId/fulfillment` — update fulfillment status
- [ ] Inventory management (qty decrement on order)

#### Frontend Integration
- [ ] Create `apps/web/src/lib/marketplace-api.ts` — marketplace API calls
- [ ] Replace hardcoded `deals-page.tsx` deals[] with product catalog API
- [ ] Build product listing/search page with filters
- [ ] Build cart UI (add/remove/update quantity)
- [ ] Build order confirmation and tracking UI
- [ ] Build seller dashboard for product management
- [ ] Real-time inventory updates (out-of-stock handling)

#### Tests
- [ ] `apps/api/src/modules/marketplace/marketplace.service.test.ts` — integration test:
  - Product CRUD
  - Add to cart → cart total updates
  - Checkout → order created, inventory decremented
  - Out of stock → checkout fails
- [ ] `apps/api/src/modules/marketplace/marketplace.routes.test.ts` — integration test:
  - GET /products → returns catalog
  - POST /cart/items → item added
  - POST /orders/checkout → order created

**Deliverable**: Full e-commerce flow for parts and DIY kits.

---

### Sprint 8 — Reviews, Badges, Admin
**Duration**: 3-4 days
**Depends on**: Sprint 6
**API Endpoints**: §9.1 + §10 + §11 of DATA_API.md

#### Backend
- [ ] `POST /bookings/:bookingId/review` — verified customer review
- [ ] `GET /garages/:garageId/reviews` — public reviews
- [ ] `PATCH /reviews/:reviewId/moderate` — admin moderation
- [ ] `GET /garages/:garageId/badges` — public badges
- [ ] `POST /admin/garages/:garageId/badges/recompute` — recompute badges
- [ ] `GET /admin/onboarding/garages` — pending garage list
- [ ] `POST /admin/onboarding/garages/:id/approve` — approve garage
- [ ] `POST /admin/onboarding/garages/:id/reject` — reject garage
- [ ] `GET /admin/onboarding/vendors` — pending vendor list
- [ ] `POST /admin/onboarding/vendors/:id/approve` — approve vendor
- [ ] `GET /admin/transactions` — payment monitoring
- [ ] `GET /admin/monetization/listing-fees` — fee tracking
- [ ] `GET /admin/subscriptions` — subscription management
- [ ] Badge recompute logic (topRated, budgetFriendly, evSpecialist)

#### Frontend Integration
- [ ] Create `apps/web/src/lib/reviews-api.ts` — review-specific API calls
- [ ] Create `apps/web/src/lib/admin-api.ts` — admin-specific API calls
- [ ] Build review submission UI (post-booking, with rating + text)
- [ ] Build admin dashboard pages (garage approvals, transactions, subscriptions)
- [ ] Build garage approval workflow UI (approve/reject with reason)
- [ ] Display badges on garage profiles
- [ ] Display reviews on garage profiles

#### Tests
- [ ] `apps/api/src/modules/reviews/reviews.service.test.ts` — integration test:
  - Submit review → review created (only for completed bookings)
  - Duplicate review → rejected
  - Moderate review → status updated
- [ ] `apps/api/src/modules/admin/admin.service.test.ts` — integration test:
  - Approve garage → status changes to "active"
  - Reject garage → status changes to "rejected"
  - Badge recompute → badges updated

**Deliverable**: Trust system and admin controls operational.

---

### Sprint 9 — Notifications + Polish
**Duration**: 2-3 days
**Depends on**: Sprint 8
**API Endpoints**: §12 of DATA_API.md (notifications)

#### Backend
- [ ] Notification service: email (SendGrid/SES), push (FCM), in-app
- [ ] Notification queue processing (background worker or cron)
- [ ] Wire notifications to key events: booking confirmed, quote received, payment succeeded

#### Frontend Integration
- [ ] Create `apps/web/src/lib/notifications-api.ts` — notification API calls
- [ ] Build notification list page with read/unread states
- [ ] Replace hardcoded notification badge count ("3") in `data.tsx:389`
- [ ] Replace hardcoded emergency phone numbers in `data.tsx:343`
- [ ] Replace hardcoded "More quotes may be on the way" in `quotes-page.tsx:496`
- [ ] Real-time notification polling or WebSocket connection
- [ ] Notification preferences page

#### Tests
- [ ] `apps/api/src/modules/notifications/notifications.service.test.ts` — integration test:
  - Send notification → notification created
  - Mark as read → status updated
  - Preference: opt-out → no notification sent

**Deliverable**: Users receive real notifications across channels.

---

## Architecture Decisions

### Tech Stack (API)
- **Runtime**: Node.js + Express (already in place)
- **Database**: PostgreSQL via `pg` (raw SQL, no ORM)
- **Auth**: Google OAuth (via `google-auth-library`), JWT (access + refresh tokens)
- **Storage**: S3-compatible (AWS S3 or MinIO) for media uploads
- **Payments**: Stripe (per PRD: "US-supported like Stripe")
- **Validation**: Zod schemas shared between API and frontend
- **Testing**: Vitest for backend unit/integration tests

### Tech Stack (Frontend)
- **Framework**: Next.js 16 (App Router)
- **API Client**: Custom fetch wrapper (`api-client.ts`)
- **State**: React Context for auth; `useState` for page-level state
- **UI Components**: shadcn/ui (already partially set up)
- **Auth UI**: `@react-oauth/google` for Google Login button

### API Conventions (from DATA_API.md)
- Base path: `/api/v1`
- Auth: `Authorization: Bearer <token>`
- Success: `{ data, meta? }`
- Error: `{ error: { code, message, details? } }`

### Frontend API Client
- `apps/web/src/lib/api-client.ts` with:
  - Base URL from env (`NEXT_PUBLIC_API_URL`)
  - Automatic auth header injection
  - Token refresh on 401
  - Response envelope unwrapping
  - Error normalization

### File Structure (API)
```
apps/api/src/
├── config/
│   ├── database.ts
│   └── env.ts
├── middleware/
│   ├── auth.ts
│   ├── auth.test.ts
│   ├── role-check.ts
│   ├── error-handler.ts
│   └── request-logger.ts
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.service.test.ts
│   ├── vehicles/
│   │   ├── vehicles.routes.ts
│   │   ├── vehicles.service.ts
│   │   └── vehicles.service.test.ts
│   ├── diagnosis/
│   │   ├── diagnosis.routes.ts
│   │   ├── diagnosis.service.ts
│   │   └── diagnosis.service.test.ts
│   ├── garages/
│   │   ├── garages.routes.ts
│   │   ├── garages.service.ts
│   │   └── garages.service.test.ts
│   ├── quotes/
│   │   ├── quotes.routes.ts
│   │   ├── quotes.service.ts
│   │   └── quotes.service.test.ts
│   ├── bookings/
│   │   ├── bookings.routes.ts
│   │   ├── bookings.service.ts
│   │   └── bookings.service.test.ts
│   ├── marketplace/
│   │   ├── marketplace.routes.ts
│   │   ├── marketplace.service.ts
│   │   └── marketplace.service.test.ts
│   ├── payments/
│   │   ├── payments.routes.ts
│   │   ├── payments.service.ts
│   │   └── payments.service.test.ts
│   ├── reviews/
│   │   ├── reviews.routes.ts
│   │   ├── reviews.service.ts
│   │   └── reviews.service.test.ts
│   ├── admin/
│   │   ├── admin.routes.ts
│   │   ├── admin.service.ts
│   │   └── admin.service.test.ts
│   └── notifications/
│       ├── notifications.routes.ts
│       ├── notifications.service.ts
│       └── notifications.service.test.ts
├── services/         (shared business logic)
├── routes/
│   └── index.ts
├── app.ts
└── main.ts
```

### File Structure (Frontend Integration)
```
apps/web/src/
├── lib/
│   ├── api-client.ts           (Sprint 0.5)
│   ├── api-client.test.ts      (Sprint 0.5)
│   ├── auth-context.tsx        (Sprint 0.5)
│   ├── diagnosis-api.ts        (Sprint 3)
│   ├── garages-api.ts          (Sprint 4)
│   ├── quotes-api.ts           (Sprint 5)
│   ├── bookings-api.ts         (Sprint 6)
│   ├── payments-api.ts         (Sprint 6)
│   ├── marketplace-api.ts      (Sprint 7)
│   ├── reviews-api.ts          (Sprint 8)
│   ├── admin-api.ts            (Sprint 8)
│   └── notifications-api.ts    (Sprint 9)
├── components/
│   └── common/
│       └── vehicle-selector.tsx (Sprint 2)
├── pages/
│   └── vehicles/               (Sprint 2)
```

---

## Dependency Order

```
Sprint 0 ✅ (Foundation)
    ↓
Sprint 0.5 (Frontend Foundation) ← API client, auth context
    ↓
Sprint 1 (Auth + RBAC) ← everything depends on this
    ↓
Sprint 2 (Vehicles) ← needed by Diagnosis, Quotes, Bookings
    ↓
Sprint 3 (Diagnosis) ← needed by Quotes
    ↕
Sprint 4 (Garages) ← can run parallel with Sprint 3
    ↓
Sprint 5 (Quotes) ← needed by Bookings
    ↓
Sprint 6 (Bookings + Payments) ← needed by Reviews
    ↓
Sprint 7 (Marketplace) ← can run parallel with Sprint 6
    ↓
Sprint 8 (Reviews + Admin) ← can start after Sprint 6
    ↓
Sprint 9 (Notifications + Polish) ← final
```

---

## PRD Coverage Checklist

| PRD Feature | Sprint | Status |
|-------------|--------|--------|
| AI Diagnosis (text/image/video/audio) | Sprint 3 | Planned |
| DIY guidance (safe issues only) | Sprint 3 | Planned |
| Vehicle management (CRUD + history) | Sprint 2 | Planned |
| Garage onboarding + admin approval | Sprint 4 + 8 | Planned |
| Quote-based booking (primary USP) | Sprint 5 | Planned |
| Instant booking | Sprint 6 | Planned |
| Payments (mandatory in-app) | Sprint 6 | Planned |
| Spare parts marketplace | Sprint 7 | Planned |
| DIY kits | Sprint 7 | Planned |
| Star ratings + detailed feedback | Sprint 8 | Planned |
| Badges (Top Rated, Budget Friendly, EV Specialist) | Sprint 8 | Planned |
| Discovery + search (location, filters) | Sprint 4 | Planned |
| Commission per booking | Sprint 6 | Planned |
| Listing fees | Sprint 8 | Planned |
| Subscription model | Sprint 8 | Planned |
| Multi-channel notifications | Sprint 9 | Planned |
| Stripe integration | Sprint 6 | Planned |

---

## Estimated Total Duration

| Sprint | Days | Deliverable (Demo-able) |
|--------|------|-------------------------|
| Sprint 0 — Foundation | 2 | API boots, DB connected |
| Sprint 0.5 — Frontend Foundation | 1 | API client + auth context working |
| Sprint 1 — Auth + RBAC | 3-4 | Login flow end-to-end |
| Sprint 2 — Vehicles | 2-3 | Vehicle CRUD + selector in UI |
| Sprint 3 — Diagnosis | 4-5 | AI diagnosis with real vehicle |
| Sprint 4 — Garages | 4-5 | Garage search + onboarding |
| Sprint 5 — Quotes | 3-4 | Full quote lifecycle |
| Sprint 6 — Bookings + Payments | 4-5 | Book and pay for service |
| Sprint 7 — Marketplace | 4-5 | Buy parts and DIY kits |
| Sprint 8 — Reviews + Admin | 3-4 | Trust system + admin controls |
| Sprint 9 — Notifications | 2-3 | Multi-channel notifications |
| **Total** | **34-44 days** | |

With parallel work (frontend + backend dev), realistic calendar time: **7-9 weeks** with 1-2 developers.

### Milestone Demos
| After Sprint | You Can Demo |
|--------------|--------------|
| 0.5 | Frontend hitting backend API |
| 1 | Full login flow with Google OAuth |
| 2 | Vehicle list from DB, vehicle selector working |
| 3 | AI diagnosis with real vehicle data |
| 4 | Garage search with filters, garage onboarding |
| 5 | Quote comparison and selection |
| 6 | End-to-end booking with payment |
| 7 | Product marketplace with cart |
| 8 | Reviews, badges, admin dashboard |
| 9 | Notification system live |
