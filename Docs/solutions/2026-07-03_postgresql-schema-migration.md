# PostgreSQL Schema Migration from MongoDB

**Date**: 2026-07-03

## Problem

The project had a MongoDB schema defined in `Docs/schema.md` but the `docker-compose.yml` was configured with PostgreSQL. The database tables needed to be created to match the schema.

## Solution

### Files Created

1. **`db/migrations/001_initial_schema.sql`** — Full PostgreSQL migration that translates the MongoDB schema into 20 normalized tables.

### Files Modified

1. **`docker-compose.yml`** — Added volume mount for `./db/migrations:/docker-entrypoint-initdb.d` to auto-run migrations on container start.

2. **`package.json`** — Added convenience scripts:
   - `db:up` — Start postgres container
   - `db:down` — Stop postgres container
   - `db:reset` — Drop volume and recreate (fresh database)
   - `db:psql` — Open psql shell

## Schema Translation (MongoDB → PostgreSQL)

| MongoDB Concept | PostgreSQL Equivalent |
|-----------------|----------------------|
| `ObjectId` | `UUID` |
| `String enum` | `VARCHAR` + `CHECK` constraint |
| `Object` | `JSONB` |
| `Array<String>` | `TEXT[]` |
| `Number` | `INTEGER` or `NUMERIC(12,2)` |
| `Date` | `TIMESTAMPTZ` |
| `Candidate unique` | `UNIQUE` constraint |
| `Composite unique` | `UNIQUE(col1, col2)` |

## Tables Created (20 total)

### RBAC (3)
- `users` — User identity with email/mobile auth
- `roles` — Role definitions (customer, garage, vendor, admin)
- `user_roles` — User-role mapping with composite unique index

### Vehicles (2)
- `vehicles` — Vehicle profiles with optional VIN and warranty
- `vehicle_service_history` — Service records per vehicle

### Diagnosis (3)
- `diagnosis_requests` — AI diagnosis submissions
- `diagnosis_media` — Attached images/videos/audio
- `diagnosis_results` — AI output with confidence, risk level, DIY steps

### Garage & Quotes (6)
- `garages` — Garage profiles with location, specializations, approval status
- `garage_documents` — License/cert files with verification status
- `garage_slots` — Availability time slots
- `quote_requests` — Customer quote requests
- `quotes` — Garage quote responses
- `bookings` — Scheduled service appointments

### Marketplace (5)
- `sellers` — Seller profiles (platform, garage, vendor)
- `products` — Product catalog with DIY kit support
- `inventory` — Stock quantities per product
- `carts` — Shopping carts per customer
- `orders` — Order records with fulfillment

### Payments & Trust (3)
- `payments` — Payment records with provider intent IDs
- `reviews` — Verified post-booking reviews (1 per booking)
- `garage_badges` — Achievement badges (topRated, budgetFriendly, evSpecialist)

### Notifications (1)
- `notifications` — Multi-channel notification queue (sms, email, push, inApp)

## Additional Features

- **Auto-updating `updated_at`** — Trigger function applied to all tables with `updated_at`
- **GIN index** on `garages.specializations` for array search
- **Seed data** — Default roles inserted on migration run

## Usage

```bash
npm run db:up      # Start postgres + run migrations
npm run db:reset   # Drop volume and re-run (fresh start)
npm run db:psql    # Connect to psql shell
```
