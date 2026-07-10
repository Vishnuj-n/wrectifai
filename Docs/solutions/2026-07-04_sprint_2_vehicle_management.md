# Sprint 2 — Vehicle Management Walkthrough

**Date**: 2026-07-04  
**Status**: Completed  
**Deliverable**: Real DB-backed vehicle profiles, reusable vehicle selection dropdown, and state wiring into AI diagnosis/quotes systems using localStorage.

---

## 1. Database Migration & Schema

Applied migrations to both development and test PostgreSQL containers:
- [001_initial_schema.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/001_initial_schema.sql) establishes the base `garages` table with core columns (`name`, `address`, `location`, `specializations`, `certifications`, `pickup_drop_supported`, `approval_status`, `rating_avg`, `rating_count`).
- [009_update_garages_rich_meta.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/009_update_garages_rich_meta.sql) adds five rich-display columns to `garages`: `starting_price`, `distance_km`, `tone`, `artwork`, and `image`. Seeds initial badge assignments for QuickPit (mostTrusted), SpeedFix (topRated), AutoWorks (budgetFriendly), and Metro Auto Bay (topRated).
- [012_add_missing_garages.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/012_add_missing_garages.sql) introduces the `response_mins` column, upserts all 12 hardcoded garages with complete metadata (including distance, response time, and per-garage images), and re-seeds badge assignments — final state: QuickPit (budgetFriendly), SpeedFix (mostTrusted), AutoWorks (topRated), Metro Auto Bay (topRated), Prime Service Point (mostTrusted).
- [003_add_vehicle_soft_delete.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/003_add_vehicle_soft_delete.sql) adds the `is_active` boolean column to vehicles.
- Updated schema documentation in [schema.md](file:///c:/Users/vishn/PROJECT/wrectifai/Docs/schema.md).

---

## 2. Backend API & Tests

- Covered all backend REST paths in [vehicles.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/vehicles/vehicles.routes.ts).
- Added comprehensive integration tests to [vehicles.routes.test.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/vehicles/vehicles.routes.test.ts) covering:
  - `GET /vehicles` (list user's active vehicles)
  - `POST /vehicles` (create new vehicle)
  - `GET /vehicles/:id` (read details for owner / verify ownership boundary)
  - `PATCH /vehicles/:id` (partial details update by owner / returns 403 Forbidden for non-owners)
  - `DELETE /vehicles/:id` (soft-delete vehicle)

---

## 3. Frontend Pages & Components

- **Vehicles Page** ([vehicles-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/vehicles/vehicles-page.tsx)):
  - CRUD operations with overlay modals/forms.
- **Vehicle Selector** ([vehicle-selector.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/components/common/vehicle-selector.tsx)):
  - Stores selected vehicle details in `localStorage` under `wrectifai_selected_vehicle`.
  - Automatically loads and selects the previously active vehicle from `localStorage` on mount.
- **Dynamic Vehicle Flow Integration**:
  - Secondary workflow pages read the active vehicle context synchronously from `localStorage` and render dynamic vehicle data:
    - AI Diagnose chatbot intake and results screen ([ai-diagnose-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx) / [ai-diagnose-results-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/ai-diagnose-results/ai-diagnose-results-page.tsx))
    - Finding Quotes loader screen ([finding-quotes-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/finding-quotes/finding-quotes-page.tsx))
    - Quote Request form ([request-aent-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/request-aent/request-aent-page.tsx))
    - Compare Quotes screen ([compare-quotes-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/compare-quotes/compare-quotes-page.tsx))
    - Booking Confirmation screen ([booking-confirmed.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/components/garages/booking-confirmed.tsx))

---

## 4. Verification

### Automated Tests
Ran API test suite:
```bash
npm run test:api
```
**Results**: All 21 tests (including the new `PATCH` integration and authorization tests) passed successfully.
