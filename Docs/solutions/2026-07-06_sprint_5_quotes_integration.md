# Sprint 5 — Quotes & Compare Quotes Integration Walkthrough

**Date**: 2026-07-06  
**Status**: Completed  
**Deliverable**: Dynamic, database-driven Quote Management and Comparison integration featuring database migrations, Express API routes with en-US dollar formatting, Next.js client integrations, and page updates.

---

## 1. Database Migration & Seed Data
- **Migration SQL** ([007_quotes.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/007_quotes.sql)):
  - Declares the `details` JSONB column inside the `quotes` table to store breakdowns (parts, labour, consumables, GST, availability, warranty, experience).
  - Seeds a new garage "Prime Service Point" under the existing seeded garage owner user.
  - Seeds a default `quote_request` associated with the default test user and vehicle.
  - Seeds 8 quotes (representing all garages from `quotes-shared.ts`) linked to that quote request, including pricing breakdowns, USD currency, warranty, availability, and tags.

To apply the migration, the database container was rebuilt:
```bash
npm run db:reset
```

---

## 2. Backend API Route Integration
- **Quotes Router** ([quotes.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/quotes/quotes.routes.ts)):
  - Updated `GET /quotes` to fetch all quotes from the database, joining with `garages` to pull ratings, reviews count, and garage name, and returns the response mapped matching `QuoteItem` type formatting with `en-US` locale and `$`.
  - Updated `GET /quotes/:quoteId` to fetch detailed data (including the `details` JSONB block) for comparison.
- **API Tests** ([quotes.routes.test.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/quotes/quotes.routes.test.ts)):
  - Added test coverage for `GET /quotes` and `GET /quotes/:quoteId` to ensure the responses match format expectations in USD.

---

## 3. Frontend Client & UI Integration
- **Quotes Client API** ([quotes-api.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/lib/quotes-api.ts)):
  - Declares helper functions `fetchQuotes()` and `fetchQuote(quoteId)` to abstract calling the backend API.
- **My Quotes Page** ([quotes-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/quotes/quotes-page.tsx)):
  - Loads quotes dynamically using the new client API on mount.
  - Features loading and empty state checks.
- **Compare Quotes Page** ([compare-quotes-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/compare-quotes/compare-quotes-page.tsx)):
  - Loads comparison data dynamically.
  - If no quote IDs are passed in the URL query parameters, it automatically pre-selects the first 3 quotes from the database.
  - Dynamically builds compare lists (`priceRows` and `detailRows`) in real-time from the database responses.
- **Mock Data Decoupling** ([quotes-shared.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/components/quotes/quotes-shared.ts)):
  - Cleared the static `quotesList` array to be empty (`[]`), proving that the pages pull data strictly from the database.
  - Updated the default currency indicators to US Dollars (`$`).

---

## 4. Verification
- Ran backend unit and integration tests:
  ```bash
  npm run test:api
  ```
  **Results**: All 37 tests passed successfully.
