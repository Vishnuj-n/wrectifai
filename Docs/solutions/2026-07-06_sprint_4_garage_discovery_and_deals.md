# Sprint 4 — Garage Discovery & Deals Walkthrough

**Date**: 2026-07-06  
**Status**: Completed  
**Deliverable**: Dynamic, database-driven Garage Discovery and Deals/Promos integration including database migrations, Express API routes, Next.js client integrations, and page updates.

---

## 1. Database Migration & Seed Data

Created a new database migration file to set up schemas and seed data:
- **Migration SQL** ([006_promos.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/006_promos.sql)):
  - Declares the `promos` table storing all promotional details (display prices, badges, categories, discount labels, image references, and custom card styles).
  - Seeds 7 approved garages (such as *QuickPit Service Center*, *SpeedFix Auto Care*, etc.) under a seeded garage owner user.
  - Seeds 8 promotions/combos (such as *Summer Care Combo*, *Monsoon Care Combo*, *Mega Car Wash*, etc.).

To apply the migration, the database container was rebuilt:
```bash
npm run db:reset
```

---

## 2. Backend API Route Integration

- **Garages Router** ([garages.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/garages/garages.routes.ts)):
  - Updated `GET /garages/search` to fetch all approved garages from the database and map properties (distance, response time, rating aggregates) to align with front-end expectations.
  - Updated `GET /garages/:id` to dynamically lookup details of a specific garage.
- **Router Index** ([index.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/routes/index.ts)):
  - Mounted the `/api/v1/promos` route handler directly to retrieve active promotions sorted by relevance.

---

## 3. Frontend Client & UI Integration

- **Garages Client API** ([garages-api.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/lib/garages-api.ts)):
  - Declares helper functions `fetchGarages()`, `fetchGarage(id)`, and `fetchPromos()` to abstract calling the backend API.
- **Home Dashboard Panel** ([right-panel.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/components/home/right-panel.tsx)):
  - Fetches the active promotions from `/promos` on mount using React hooks and updates the *Offers & Promos* panel dynamically.
- **Garages List Page** ([garages-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/garages/garages-page.tsx)):
  - Loads matching garages from the database using the API client.
- **Deals & Offers Page** ([deals-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/deals/deals-page.tsx)):
  - Loads all combo/promotional deals dynamically from the `/promos` API.

---

## 4. Verification

### Automated Tests
Verify that all backend unit and integration tests are passing:
```bash
npm run test:api
```
**Results**: All 35 tests passed successfully.

### Manual Verification
1. Boot the API and frontend servers:
   ```bash
   pnpm run api
   pnpm run web
   ```
2. Navigate to `http://localhost:3001/` to verify:
   - The *Featured Garages* section on the home page lists the seeded garages from the database.
   - The *Offers & Promos* panel displays the seeded non-combo deals.
3. Navigate to `/garages` and `/deals` to check that the listings and combos are retrieved from the database.
