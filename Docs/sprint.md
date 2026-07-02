# Sprint Plan — WRECTIFAI MVP Completion

> **Generated from gap analysis on 2026-07-01.**
> Organizes all remaining work into time-boxed sprints following the priority order in `PHASE_SCOPE.md`.

---

## Current State Summary

- **Working:** Auth (OTP+social), RBAC middleware, vehicle CRUD, garage dashboard, marketplace intake→quotes→bookings, diagnosis sessions (keyword + Gemini), admin panels, payments (mocked), UI content serving, Vercel deployment
- **Mocked/hardcoded:** Payments (no Stripe), SMS OTP (`123456`), garage availability, distance_miles
- **Missing:** Reviews, notifications, feature flags, RBAC endpoints, maps, email, file storage

---

## Sprint 1 — Payments & OTP Real Integration (Week 1–2)

**Goal:** Replace the two biggest mocks with real integrations so the core booking→payment flow is functional end-to-end.

### 1.1 Real Payment Gateway (Stripe)

| # | Task | Details |
|---|------|---------|
| 1 | Install `stripe` SDK | `npm install stripe @types/stripe` in `apps/api` |
| 2 | Add env vars | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` to `.env.example` |
| 3 | Replace mock in `payments.service.ts` | Create real PaymentIntents with amount/currency from booking |
| 4 | Webhook handler | New `POST /payments/webhook` route for `payment_intent.succeeded` and `payment_intent.payment_failed` events; update `payments` table status |
| 5 | Refund support | Add `POST /payments/refund` for admin/cancelled bookings |
| 6 | Apple Pay / Google Pay | Enable via Stripe PaymentMethods API; no separate SDK needed |
| 7 | Receipt generation | PDF receipt stored via file service (Sprint 4), URL saved to `payments` table |

### 1.2 Real SMS OTP Delivery

| # | Task | Details |
|---|------|---------|
| 1 | Install Twilio SDK | `npm install twilio` + env vars `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |
| 2 | Generate real OTP | Replace `123456` with 6-digit random code, stored with 5-min TTL in `otp_codes` table |
| 3 | Send via Twilio Verify or Messaging API | `POST /auth/otp/send` calls Twilio; verify endpoint checks DB |
| 4 | Rate limiting | Max 3 OTP requests per phone per 10 minutes |
| 5 | Fallback | If Twilio fails, log warning and allow `123456` only in `NODE_ENV=development` |

### Sprint 1 Acceptance Criteria

- [ ] User can pay for a booking with a real card (test mode) and see `payment_intent.succeeded` in DB
- [ ] OTP is received as an SMS on a real phone number
- [ ] Webhook processes payment confirmation without manual intervention
- [ ] All payment and OTP flows have error handling and retry logic

---

## Sprint 2 — Reviews, Notifications & RBAC Endpoints (Week 2–3)

**Goal:** Complete the spec'd but unbuilt review system, notifications, and RBAC management APIs.

### 2.1 Reviews Table & API

| # | Task | Details |
|---|------|---------|
| 1 | Add `reviews` table to `bootstrap.ts` | Columns: `id`, `booking_id (FK)`, `user_id (FK)`, `garage_id (FK)`, `rating (1–5)`, `comment`, `created_at` |
| 2 | `POST /bookings/:id/review` | Auth-required; user can only review their own completed bookings |
| 3 | `GET /garages/:id/reviews` | Public endpoint; return with pagination and average rating |
| 4 | `GET /users/me/reviews` | User's own review history |
| 5 | Update garage dashboard | Replace the `TODO: Implement reviews table` comment with real review data |

### 2.2 Notifications System

| # | Task | Details |
|---|------|---------|
| 1 | Add `notifications` table to `bootstrap.ts` | Columns: `id`, `user_id (FK)`, `type (ENUM)`, `title`, `message`, `is_read`, `data (JSONB)`, `created_at` |
| 2 | `GET /notifications` | Paginated, filterable by `is_read` and `type` |
| 3 | `PATCH /notifications/:id/read` | Mark single notification as read |
| 4 | `PATCH /notifications/read-all` | Mark all as read |
| 5 | Notification trigger service | Create `NotificationService` that inserts rows on key events: booking created, quote received, payment confirmed, review posted |
| 6 | Frontend `NotificationTab` | Header bell icon with unread count badge, dropdown list, mark-as-read on click |

### 2.3 RBAC Management Endpoints

| # | Task | Details |
|---|------|---------|
| 1 | `GET /roles` | List all roles; admin-only |
| 2 | `POST /user-roles` | Assign role to user; admin-only |
| 3 | `DELETE /user-roles` | Revoke role; admin-only |
| 4 | `GET /users/:userId/roles` | Get user's roles; admin or self |

### Sprint 2 Acceptance Criteria

- [ ] A completed booking can be reviewed with a 1–5 rating and comment
- [ ] Garage dashboard shows average rating and review list
- [ ] User receives in-app notification when quote is received, booking confirmed, payment succeeds
- [ ] Admin can list roles and manage user-role assignments via API
- [ ] Notifications bell shows unread count in web app header

---

## Sprint 3 — Maps, Garage Availability & Runtime Feature Flags (Week 3–4)

**Goal:** Replace hardcoded availability and distance with real data; enable feature flags for progressive rollout.

### 3.1 Maps & Geolocation

| # | Task | Details |
|---|------|---------|
| 1 | Install `@googlemaps/google-maps-services-js` | + env var `GOOGLE_MAPS_API_KEY` |
| 2 | Geocode garage addresses | On garage creation/update, call Geocoding API and store lat/lng in `garages` table |
| 3 | Replace hardcoded `distance_miles` | In `marketplace.routes.ts:350`, calculate real Haversine distance from user location |
| 4 | `GET /garages/nearby` | New endpoint accepting lat/lng/radius; returns garages sorted by distance |
| 5 | Frontend map component | Show nearby garages on a map in marketplace/search results |

### 3.2 Garage Availability Persistence

| # | Task | Details |
|---|------|---------|
| 1 | Add `garage_availability` table | Columns: `id`, `garage_id (FK)`, `day_of_week (0–6)`, `start_time`, `end_time`, `is_active` |
| 2 | Add `garage_blocked_slots` table | For holidays, maintenance: `id`, `garage_id`, `date`, `reason` |
| 3 | `GET /garages/:id/availability` | Return available slots for a given date |
| 4 | `PUT /garages/:id/availability` | Garage owner sets their weekly schedule |
| 5 | `POST /garages/:id/blocked-slots` | Block specific dates |
| 6 | Replace hardcoded data in `garage.routes.ts:641` | Fetch from DB instead of returning fixed hours |
| 7 | Slot booking validation | When creating a booking, verify the slot is available and not blocked |

### 3.3 Runtime Feature Flags

| # | Task | Details |
|---|------|---------|
| 1 | Add `runtime_feature_flags` table | Columns: `id`, `flag_name (UNIQUE)`, `description`, `is_enabled`, `rollout_percentage`, `allowed_roles (JSONB)`, `created_at`, `updated_at` |
| 2 | `GET /runtime/feature-flags` | Returns flags relevant to the requesting user's role |
| 3 | `PUT /runtime/feature-flags/:name` | Admin toggle/update |
| 4 | Middleware helper | `isFeatureEnabled(flagName, user)` — check at route level |
| 5 | Seed initial flags | `vendor_marketplace`, `push_notifications`, `maps_integration`, `reviews` (toggle new features) |

### 3.4 Urgency Field Migration

| # | Task | Details |
|---|------|---------|
| 1 | Add `urgency` column to `issue_requests` | `ENUM: low, medium, high, critical` with default `medium` |
| 2 | Update `garage.routes.ts:234` | Replace hardcoded `'High'` with actual field value |
| 3 | Frontend input | Add urgency selector to issue request form |

### Sprint 3 Acceptance Criteria

- [ ] Garage search results show real distances calculated from user's location
- [ ] Garage availability is stored in DB and used for slot booking validation
- [ ] Admin can enable/disable features via feature flags without code deployment
- [ ] Issue requests carry an urgency level through the full pipeline

---

## Sprint 4 — File Storage, Email & Admin Analytics (Week 4–5)

**Goal:** Add S3 file storage for uploads, email notifications, and admin analytics.

### 4.1 File Storage (S3)

| # | Task | Details |
|---|------|---------|
| 1 | Install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` | + env vars `AWS_S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |
| 2 | Presigned URL service | `POST /uploads/presign` returns a signed upload URL; `GET /uploads/:key` returns a signed read URL |
| 3 | Migrate avatar uploads | Replace mock S3 in user onboarding |
| 4 | Garage documents | Certifications, business license uploads for garage onboarding |
| 5 | Vehicle images | Photo uploads for vehicle profiles |
| 6 | Diagnosis media | Image/audio attachments for AI diagnosis sessions |

### 4.2 Email Notifications

| # | Task | Details |
|---|------|---------|
| 1 | Install email provider SDK | SendGrid (`@sendgrid/mail`) or AWS SES + env vars |
| 2 | Email templates | Booking confirmation, payment receipt, password reset, review notification |
| 3 | `EmailService` | Async email dispatch with retry and failure logging |
| 4 | Integration points | Trigger emails on: booking created, payment succeeded, review posted, password reset |

### 4.3 Admin Analytics Endpoint

| # | Task | Details |
|---|------|---------|
| 1 | `GET /admin/analytics/overview` | Return: total users, garages, bookings (this week/month), revenue, conversion rate |
| 2 | `GET /admin/analytics/bookings` | Booking stats by status, date range, garage |
| 3 | `GET /admin/analytics/revenue` | Revenue by period, payment method, garage |
| 4 | Frontend dashboard charts | Simple charts using a chart library (Recharts or similar) |

### Sprint 4 Acceptance Criteria

- [ ] All file uploads (avatar, docs, vehicle images, diagnosis media) are stored in S3
- [ ] Users receive booking confirmation and receipt emails
- [ ] Admin dashboard shows real analytics data with charts

---

## Sprint 5 — Auth Modernization & Hardening (Week 5–6)

**Goal:** Replace custom auth with Better Auth library as documented, and harden security.

### 5.1 Better Auth Migration

| # | Task | Details |
|---|------|---------|
| 1 | Read `Docs/future_solutions/auth-option-3-better-auth.md` | Understand the documented migration plan |
| 2 | Install Better Auth | `npm install better-auth` + configure provider |
| 3 | Replace OTP flow | Better Auth handles phone OTP natively via Twilio |
| 4 | Replace social login | Real Google/Apple OAuth via Better Auth adapters |
| 5 | Session management | Replace custom JWT/cookie with Better Auth sessions |
| 6 | RBAC integration | Wire existing role system to Better Auth's authorization layer |
| 7 | Remove legacy auth code | Delete ~870 lines of custom auth (`auth.routes.ts`, `auth.service.ts`, manual session logic) |
| 8 | Migration testing | Ensure all existing users/sessions are migrated or gracefully handled |

### 5.2 Real OAuth for Google/Apple

| # | Task | Details |
|---|------|---------|
| 1 | Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` env vars; verify ID tokens server-side |
| 2 | Apple Sign In | `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`; verify JWT |
| 3 | Profile sync | On first social login, populate `users` and `profiles` tables from OAuth claims |
| 4 | Account linking | If user signs up with phone then later uses Google, link accounts |

### Sprint 5 Acceptance Criteria

- [ ] All auth flows work through Better Auth (OTP, Google, Apple, session refresh)
- [ ] Custom auth code is removed from the codebase
- [ ] Existing users can log in after migration
- [ ] Social login uses real OAuth token verification (not synthetic subjects)

---

## Sprint 6 — Push Notifications & Polish (Week 6–7)

**Goal:** Enable push notifications on mobile and web; polish UI and error handling.

### 6.1 Push Notifications

| # | Task | Details |
|---|------|---------|
| 1 | Firebase Cloud Messaging setup | Create Firebase project, add `google-services.json` (mobile) + `firebase-messaging-sw.js` (web) |
| 2 | Expo Push Tokens | Install `expo-device`, `expo-notifications`; register token on app start |
| 3 | `push_tokens` table | `id`, `user_id`, `platform (ios/android/web)`, `token`, `created_at` |
| 4 | `POST /devices/register` | Store push token on device registration |
| 5 | `DELETE /devices/:token` | Remove token on logout |
| 6 | Push dispatch service | Use Firebase Admin SDK to send push on: new quote, booking reminder, payment confirmation |
| 7 | Notification preferences | `GET/PUT /users/notification-preferences` — toggle per type (email, push, SMS) |
| 8 | Browser push | Service worker for web push notifications |

### 6.2 UI Polish & Error Handling

| # | Task | Details |
|---|------|---------|
| 1 | Loading states | Skeleton loaders for all data-fetching pages |
| 2 | Error boundaries | React error boundaries for each route segment |
| 3 | Offline handling | Network status indicator; graceful degradation for map/diagnosis features |
| 4 | Form validation | Client-side validation on all forms (phone format, required fields, email format) |
| 5 | Toast notifications | Consistent success/error toasts across all CRUD operations |
| 6 | Mobile responsiveness | Audit and fix any mobile web layout issues |

### Sprint 6 Acceptance Criteria

- [ ] Mobile app receives push notifications for quotes, bookings, and payments
- [ ] Web app shows browser push notification prompts and delivers notifications
- [ ] All pages have loading states and error boundaries
- [ ] Forms have client-side validation with clear error messages

---

## Sprint 7 — Testing, Performance & Launch Prep (Week 7–8)

**Goal:** Ensure reliability, performance, and readiness for production launch.

### 7.1 Testing

| # | Task | Details |
|---|------|---------|
| 1 | API integration tests | Cover: auth flows, booking lifecycle, payment webhook, quote creation |
| 2 | Frontend E2E tests | Critical paths: login → vehicle add → diagnose → quote → book → pay → review |
| 3 | Load testing | k6 or Artillery scripts for: concurrent bookings, payment webhooks, OTP sends |
| 4 | Security audit | OWASP checklist review, penetration testing basics |

### 7.2 Performance

| # | Task | Details |
|---|------|---------|
| 1 | Database indexes | Add indexes on: `bookings(user_id, status)`, `quotes(booking_id)`, `reviews(garage_id)`, `payments(booking_id)` |
| 2 | Query optimization | Review N+1 queries in marketplace and garage dashboard routes |
| 3 | API response caching | Cache `GET /runtime/feature-flags`, `GET /ui-content`, `GET /app-config/app-identity` |
| 4 | Image optimization | Lazy loading, thumbnail generation for vehicle/diagnosis images |
| 5 | Bundle analysis | Analyze Next.js bundle; code-split routes below the fold |

### 7.3 Launch Prep

| # | Task | Details |
|---|------|---------|
| 1 | Environment hardening | Review all env vars; ensure no secrets in code or git history |
| 2 | Monitoring | Add structured logging (Pino or similar), error tracking (Sentry), uptime monitoring |
| 3 | Rate limiting | Global rate limiter middleware; stricter limits on auth and payment routes |
| 4 | CORS review | Verify `WEB_ORIGINS` covers all production domains |
| 5 | Database backups | Configure automated daily PostgreSQL backups |
| 6 | Deployment checklist | Document all env vars, external service configs, and post-deploy verification steps |

### Sprint 7 Acceptance Criteria

- [ ] All critical-path tests pass
- [ ] API response times p95 < 500ms for read operations, < 2s for write operations
- [ ] No P0 security vulnerabilities in OWASP audit
- [ ] Monitoring and alerting are operational
- [ ] Deployment checklist is complete and reviewed

---

## Sprint Summary

| Sprint | Focus | Duration | Key Deliverables |
|--------|-------|----------|------------------|
| **1** | Payments & OTP | Week 1–2 | Real Stripe payments, real SMS OTP |
| **2** | Reviews, Notifications, RBAC APIs | Week 2–3 | Reviews table, notifications, role management |
| **3** | Maps, Availability, Feature Flags | Week 3–4 | Google Maps, DB-backed availability, feature flags |
| **4** | File Storage, Email, Analytics | Week 4–5 | S3 uploads, email notifications, admin analytics |
| **5** | Auth Modernization | Week 5–6 | Better Auth migration, real OAuth |
| **6** | Push Notifications & Polish | Week 6–7 | FCM/Expo push, UI error handling, loading states |
| **7** | Testing & Launch Prep | Week 7–8 | Tests, performance, security, monitoring |

---

## Dependencies Between Sprints

```
Sprint 1 (Payments + OTP)
  │
  ├── Sprint 2 (Reviews + Notifications) — reviews reference bookings from Sprint 1
  │     │
  │     └── Sprint 6 (Push Notifications) — needs notification infrastructure from Sprint 2
  │
  ├── Sprint 3 (Maps + Availability) — availability validation for bookings from Sprint 1
  │
  ├── Sprint 4 (S3 + Email) — receipts from Sprint 1, notifications from Sprint 2
  │
  └── Sprint 5 (Auth Modernization) — can run in parallel with Sprints 2–4
                                       but must complete before Sprint 7

Sprint 7 (Testing + Launch) — depends on all above
```

---

## Notes

- **Sprints are approximate.** Adjust based on actual velocity and unforeseen complexity.
- **Sprint 5 (Better Auth) is documented but optional.** If timeline is tight, defer to post-MVP and keep the custom auth code — it works.
- **Vendor marketplace (Tier 5) is deferred** per `PHASE_SCOPE.md` line 28.
- **Tier 3 external integrations** (maps, email, push, S3) are spread across Sprints 1, 4, and 6 to balance backend and frontend work.
- All new tables must be added to `apps/api/src/db/bootstrap.ts` following existing patterns.
- All new routes must be registered in `apps/api/src/routes/index.ts`.
