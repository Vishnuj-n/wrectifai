# Solution: Connect AI Diagnosis and Quotes via Database

This document details the solution implemented to replace the client-side `localStorage`/query parameters connection between the AI Diagnosis flow and the Quote Request flow with a direct, relational database connection using PostgreSQL.

## 1. Context & Architecture Goal
Originally:
- When a user ran an AI diagnosis at `/ai-diagnose`, the synthesis result was saved in the database (`diagnosis_requests` and `diagnosis_results`).
- However, when they clicked "Book Quotes" to request quotes, the list of selected issues was passed via `localStorage` and query strings to `/finding-quotes` and `/request-aent`.
- The backend endpoint for creating a quote request (`POST /api/v1/quotes/requests`) was a mock handler that didn't persist any data in the DB.

Solution:
- Connect both flows via the database's existing schema. The `quote_requests` table already contains a `diagnosis_request_id` column, which is an optional foreign key to `diagnosis_requests(id)`.
- Persist the quote request in the database when they submit it.
- Load the quote request and linked diagnosis data dynamically on the success page `/request-aent?requestId=QR_UUID` by querying the API.

---

## 2. Implementation Details

### Backend Persistence Update
* **File modified**: [quotes.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/quotes/quotes.routes.ts)
* Changed the `POST /requests` endpoint to perform a SQL `INSERT INTO quote_requests` query to persist the request in PostgreSQL.
* The query maps and saves the customer ID, vehicle ID, optional `diagnosisRequestId`, `issueSummary` (comma-separated list of issue names), and defaults the status to `'open'`.

### Frontend API Client
* **File created**: [quotes-api.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/lib/quotes-api.ts)
* Defines TypeScript interfaces (`QuoteRequestResponse`, `CreateQuoteRequestPayload`) and client wrapper methods:
  * `createQuoteRequest(payload)` -> calls `POST /quotes/requests`
  * `getQuoteRequest(id)` -> calls `GET /quotes/requests/:id`

### UI Pages Alignment
* **[ai-diagnose-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx)**:
  * Captures the backend-returned `diagnosisRequestId` (`apiResult.id` of the diagnosis request) and appends it to `/finding-quotes` query parameters.
* **[finding-quotes-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/finding-quotes/finding-quotes-page.tsx)**:
  * Calls `createQuoteRequest` immediately on component mount, saving the request into the database during the 4-second finding animation.
  * Navigates to `/request-aent?requestId=UUID` once the request is created and the animation is done.
* **[request-aent-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/request-aent/request-aent-page.tsx)**:
  * Reads the `requestId` query parameter.
  * Queries `getQuoteRequest` and `getDiagnosis` from the DB using the IDs.
  * Dynamically populates the vehicle description and selected issues card content using the database record.

---

## 3. Verification

* **Backend Tests**: Verified that all 41 test cases pass.
* **TypeScript Compilation**: Ran type check (`npx tsc --noEmit`) on the web app to ensure zero type errors.
