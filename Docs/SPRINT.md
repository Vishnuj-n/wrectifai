# SPRINT.md — Backend Integration Plan for WRECTIFAI

**Created**: 2026-07-03
**Goal**: Replace all hardcoded frontend data with live API calls, building out the backend to match `DATA_API.md` and `001_initial_schema.sql`.

---

## Current State Assessment

### What Exists
| Layer | Status |
|-------|--------|
| PostgreSQL Schema | 20 tables migrated (`db/migrations/001_initial_schema.sql`) |
| API (Express) | Skeleton only — health check + stub auth route |
| Web (Next.js) | 15+ pages built, **all data hardcoded** in components |
| Mobile (Expo/RN) | Minimal — home screen + navigation shell |
| Docker Compose | PostgreSQL configured with auto-migration |

### What's Hardcoded (Frontend)
| Page | File | Hardcoded Data |
|------|------|----------------|
| Home Dashboard | `data.tsx` | navItems, categoryItems, maintenanceItems, garages[], seasonalDeals[], careTips[], overviewItems[], emergencyItems[], promoItems[] |
| Garage Listing | `garages-page.tsx` | 12 garage objects with ratings, distances, chips |
| Quotes | `quotes-page.tsx` | quotesList[], aiEstimatedQuoteRange, quoteContextDefaultIssueIds (imported from `quotes-shared.ts`) |
| Deals & Offers | `deals-page.tsx` | 18 deal items duplicated x3 for pagination |
| AI Diagnosis | `ai-diagnose-page.tsx` | legacyResultIssues[], legacyResultSummaryItems[], resultNextSteps[], analyzing steps |
| Diagnosis Config | `issue-intake-config.ts` | 6 issue categories, 24 questions, 18 possible issue results — all static |
| Diagnosis Flow | `diagnose-flow-shared.tsx` | resultIssues[] shared across pages |

---

## Sprint Plan

### Sprint 0 — Foundation (API skeleton + DB connection)
**Duration**: 2-3 days

- [ ] Set up PostgreSQL connection pool (Drizzle ORM or raw pg)
- [ ] Create `src/config/database.ts` with connection string from env
- [ ] Create `src/modules/` folder structure per domain (auth, vehicles, diagnosis, garages, quotes, bookings, marketplace, payments, reviews, admin)
- [ ] Set up middleware stack: CORS, body-parser, error-handler, request-logger
- [ ] Set up JWT infrastructure: token generation, verification, refresh tokens
- [ ] Create shared response helpers (`success()`, `error()` envelope per DATA_API.md)
- [ ] Verify `docker-compose.yml` runs PostgreSQL + migrations successfully

**Deliverable**: API boots, connects to DB, returns `{ data }` envelope.

---

### Sprint 1 — Auth + RBAC
**Duration**: 3-4 days
**API Endpoints**: §1 of DATA_API.md

- [ ] `POST /auth/register` — create user + assign role
- [ ] `POST /auth/login` — email/password → JWT access + refresh tokens
- [ ] `POST /auth/refresh` — rotate access token
- [ ] `POST /auth/logout` — invalidate refresh token
- [ ] Auth middleware: extract user + roles from JWT, attach to `req.user`
- [ ] Role-check middleware: verify `user_roles` mapping (not profile inference)
- [ ] Seed default roles on first run (already in migration)

**Frontend Changes**:
- [ ] Create `src/lib/api-client.ts` (fetch wrapper with auth headers, base URL)
- [ ] Build login/register pages (or reuse existing auth UI if present)
- [ ] Store tokens in httpOnly cookies or secure localStorage
- [ ] Wire TopNavbar user state to `/auth/status` or JWT payload

**Deliverable**: Users can register, login, and hit protected routes.

---

### Sprint 2 — Vehicle Management
**Duration**: 2-3 days
**API Endpoints**: §2 of DATA_API.md

- [ ] `GET /vehicles` — list customer's vehicles
- [ ] `POST /vehicles` — add vehicle
- [ ] `GET /vehicles/:vehicleId` — get single vehicle
- [ ] `PATCH /vehicles/:vehicleId` — update vehicle
- [ ] `DELETE /vehicles/:vehicleId` — soft/hard delete
- [ ] Permission: only owner can modify their vehicle

**Frontend Changes**:
- [ ] Create `/vehicles` page with add/edit/delete UI
- [ ] Replace hardcoded "Honda City (TS07 AB 1234)" in `quotes-page.tsx:535` and `ai-diagnose-page.tsx:979` with user's vehicle data
- [ ] Vehicle selector component for diagnosis and quote flows

**Deliverable**: Users can manage their vehicles; diagnosis/quotes reference real vehicles.

---

### Sprint 3 — AI Diagnosis Engine
**Duration**: 4-5 days
**API Endpoints**: §3 of DATA_API.md

- [ ] `POST /diagnosis` — submit symptoms + media → create diagnosis request
- [ ] `GET /diagnosis/:diagnosisId` — fetch results
- [ ] `GET /diagnosis/:diagnosisId/recommendations` — get DIY/garage recommendations
- [ ] Media upload handling (image/video/audio → storage + `diagnosis_media` table)
- [ ] LLM integration: send symptoms + vehicle history → structured diagnosis output
- [ ] Confidence scoring, risk level classification, DIY safety gate
- [ ] Persist results to `diagnosis_results` table

**Frontend Changes**:
- [ ] Replace `issue-intake-config.ts` hardcoded categories with API-driven flow (or keep as prompt templates sent to backend)
- [ ] Replace `legacyResultIssues[]` in `ai-diagnose-page.tsx` with API response
- [ ] Replace hardcoded "Honda City" in results screen with actual vehicle
- [ ] Wire media upload tabs (Photo/Video/Audio) to actual upload endpoint
- [ ] Replace hardcoded confidence gauge (92%) with real `confidence_score`
- [ ] Wire "Request Quotes" button to create a `quote_request`

**Deliverable**: Users can submit diagnosis, get AI-powered results, and initiate quote flow.

---

### Sprint 4 — Garage Discovery + Onboarding
**Duration**: 4-5 days
**API Endpoints**: §4 + §5 of DATA_API.md

- [ ] `GET /garages/search` — geo-filtered search (lat/lng/distance/price/rating/specialization)
- [ ] `GET /garages/:garageId` — public profile
- [ ] `GET /garages/:garageId/slots` — available time slots
- [ ] `POST /garage/onboarding` — garage self-registration
- [ ] `PATCH /garage/profile` — update profile
- [ ] `POST /garage/documents` — upload license/cert files
- [ ] `POST /garage/services` — add services
- [ ] `PATCH /garage/services/:serviceId` — update service
- [ ] GeoPostGIS or haversine distance calculation

**Frontend Changes**:
- [ ] Replace hardcoded `garages[]` in `garages-page.tsx:120` with API search results
- [ ] Replace hardcoded `garages[]` in `data.tsx:83` with API data
- [ ] Wire filter/sort UI to query params (rating, distance, serviceType, responseTime)
- [ ] Build garage profile detail page from API data
- [ ] Build garage onboarding flow (multi-step form)

**Deliverable**: Garages appear from DB; customers can search/filter; garage owners can onboard.

---

### Sprint 5 — Quote System
**Duration**: 3-4 days
**API Endpoints**: §6 of DATA_API.md

- [ ] `POST /quotes/requests` — customer creates quote request
- [ ] `GET /quotes/requests/:requestId` — view request (owner/garages/admin)
- [ ] `POST /quotes/requests/:requestId/quotes` — garage submits quote
- [ ] `GET /quotes/requests/:requestId/quotes` — list quotes for request
- [ ] `POST /quotes/:quoteId/select` — customer selects a quote
- [ ] Status transitions: open → quoted → selected/expired/cancelled

**Frontend Changes**:
- [ ] Replace hardcoded `quotesList[]` in `quotes-page.tsx` with API data
- [ ] Replace hardcoded `aiEstimatedQuoteRange` with AI-generated estimate from diagnosis
- [ ] Wire "Compare Quotes" flow to real quote data
- [ ] Wire "Select Garage" to `POST /quotes/:quoteId/select`
- [ ] Replace hardcoded request summary sidebar with real data

**Deliverable**: Full quote lifecycle works end-to-end.

---

### Sprint 6 — Bookings + Payments
**Duration**: 4-5 days
**API Endpoints**: §7 + §8 of DATA_API.md

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

**Frontend Changes**:
- [ ] Build booking flow UI (slot selection → confirm → payment)
- [ ] Build bookings list page
- [ ] Integrate Stripe checkout (or chosen payment gateway)
- [ ] Replace hardcoded overview stats ("Upcoming Bookings: 2", "Part Orders: 3", etc.) in `data.tsx:303`

**Deliverable**: Customers can book garages and pay through the platform.

---

### Sprint 7 — Marketplace (Products + Cart + Orders)
**Duration**: 4-5 days
**API Endpoints**: §9 of DATA_API.md

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

**Frontend Changes**:
- [ ] Replace hardcoded `deals-page.tsx` deals[] with product catalog API
- [ ] Build product listing/search page
- [ ] Build cart UI
- [ ] Build order confirmation and tracking UI
- [ ] Build seller dashboard for product management

**Deliverable**: Full e-commerce flow for parts and DIY kits.

---

### Sprint 8 — Reviews, Badges, Admin
**Duration**: 3-4 days
**API Endpoints**: §9.1 + §10 + §11 of DATA_API.md

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

**Frontend Changes**:
- [ ] Build review submission UI (post-booking)
- [ ] Build admin dashboard pages
- [ ] Build garage approval workflow UI

**Deliverable**: Trust system and admin controls operational.

---

### Sprint 9 — Notifications + Polish
**Duration**: 2-3 days

- [ ] Notification service: SMS (Twilio), email (SendGrid/SES), push (FCM), in-app
- [ ] Notification queue processing (background worker or cron)
- [ ] Wire notifications to key events: booking confirmed, quote received, payment succeeded
- [ ] Replace hardcoded notification badge count ("3") in `data.tsx:389`
- [ ] Replace hardcoded emergency phone numbers in `data.tsx:343`
- [ ] Replace hardcoded "More quotes may be on the way" in `quotes-page.tsx:496`

**Deliverable**: Users receive real notifications across channels.

---

## Architecture Decisions

### Tech Stack (API)
- **Runtime**: Node.js + Express (already in place)
- **ORM**: Drizzle ORM (lightweight, type-safe, good PostGIS support)
- **Auth**: JWT (access + refresh tokens), bcrypt for passwords
- **Storage**: S3-compatible (AWS S3 or MinIO) for media uploads
- **Payments**: Stripe (per PRD: "US-supported like Stripe")
- **Validation**: Zod schemas shared between API and frontend

### API Conventions (from DATA_API.md)
- Base path: `/api/v1`
- Auth: `Authorization: Bearer <token>`
- Success: `{ data, meta? }`
- Error: `{ error: { code, message, details? } }`

### Frontend API Client
- Create `src/lib/api-client.ts` with:
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
│   ├── role-check.ts
│   ├── error-handler.ts
│   └── validate.ts
├── modules/
│   ├── auth/         (register, login, refresh, logout)
│   ├── vehicles/     (CRUD)
│   ├── diagnosis/    (submit, results, recommendations)
│   ├── garages/      (search, profile, onboarding, documents)
│   ├── quotes/       (requests, quotes, select)
│   ├── bookings/     (instant, from-quote, status)
│   ├── marketplace/  (products, cart, orders)
│   ├── payments/     (intent, confirm, webhook)
│   ├── reviews/      (create, list, moderate)
│   ├── admin/        (approvals, transactions, badges)
│   └── notifications/
├── services/         (shared business logic)
├── routes/
│   └── index.ts
├── app.ts
└── main.ts
```

---

## Dependency Order

```
Sprint 0 (Foundation)
    ↓
Sprint 1 (Auth + RBAC) ← everything depends on this
    ↓
Sprint 2 (Vehicles) ← needed by Diagnosis, Quotes, Bookings
    ↓
Sprint 3 (Diagnosis) ← needed by Quotes
    ↓
Sprint 4 (Garages) ← needed by Quotes, Bookings
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

| Sprint | Days |
|--------|------|
| Sprint 0 — Foundation | 2-3 |
| Sprint 1 — Auth + RBAC | 3-4 |
| Sprint 2 — Vehicles | 2-3 |
| Sprint 3 — Diagnosis | 4-5 |
| Sprint 4 — Garages | 4-5 |
| Sprint 5 — Quotes | 3-4 |
| Sprint 6 — Bookings + Payments | 4-5 |
| Sprint 7 — Marketplace | 4-5 |
| Sprint 8 — Reviews + Admin | 3-4 |
| Sprint 9 — Notifications + Polish | 2-3 |
| **Total** | **31-41 days** |

With parallel work (frontend + backend dev), realistic calendar time: **6-8 weeks** with 1-2 developers.
