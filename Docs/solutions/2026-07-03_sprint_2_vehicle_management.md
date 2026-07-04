# Sprint 2 — Vehicle Management Walkthrough

**Date**: 2026-07-03  
**Status**: Completed  
**Deliverable**: Real DB-backed vehicle profiles, reusable vehicle selection dropdown, and state wiring into AI diagnosis/quotes systems.

---

## 1. Database Migration & Schema

Created a new SQL migration file [003_add_vehicle_soft_delete.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/003_add_vehicle_soft_delete.sql):
- Added `is_active` boolean column to the `vehicles` table.
- Created `idx_vehicles_is_active` index to optimize filtering out soft-deleted entries.
- Applied migrations to both development and test PostgreSQL containers.
- Updated the schema documentation in [schema.md](file:///c:/Users/vishn/PROJECT/wrectifai/Docs/schema.md).

---

## 2. Backend API Implementation

Replaced mock endpoints in [vehicles.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/vehicles/vehicles.routes.ts) with real queries:
- **`GET /vehicles`**: Returns active vehicles for the authenticated user.
- **`POST /vehicles`**: Adds a new vehicle linked to the user's account.
- **`GET /vehicles/:vehicleId`**: Fetches a single vehicle, validating ownership.
- **`PATCH /vehicles/:vehicleId`**: Updates details of owned active vehicles.
- **`DELETE /vehicles/:vehicleId`**: Soft-deletes a vehicle by setting `is_active = false`.

---

## 3. Frontend Pages & Components

- **Vehicles Page** ([vehicles-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/vehicles/vehicles-page.tsx)):
  - Renders user's vehicles with real metadata (VIN, Mileage, etc.).
  - Interactive overlay forms/modals for adding new profiles, editing details, and soft-deleting profiles.
  - Implements loading skeletons and clean empty states.
  - Wired into routing dynamically in [[slug]/page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/app/%5Bslug%5D/page.tsx).
- **Vehicle Selector** ([vehicle-selector.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/components/common/vehicle-selector.tsx)):
  - Reusable dropdown/popover component that queries `/api/v1/vehicles`.
  - Integrates direct navigation to `/vehicles` if no vehicles exist yet.
- **Quotes Flow Wiring** ([quotes-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/quotes/quotes-page.tsx)):
  - Wires `<VehicleSelector />` in place of the hardcoded Honda City details.
- **AI Diagnose Flow Wiring** ([ai-diagnose-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx)):
  - Mounts `<VehicleSelector />` on the chatbot intake screen.
  - Displays selected vehicle details on diagnosis result screen cards.

---

## 4. Verification

### Integration Tests
Implemented route tests in [vehicles.routes.test.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/vehicles/vehicles.routes.test.ts) covering:
- Authentication & JWT validation.
- CRUD operations.
- Permission enforcement (checking for owner match and throwing `403 Forbidden`).
- Soft-delete operations.

Ran test command:
```bash
npm run test:api
```
**Results**: All 19 tests passed successfully.
