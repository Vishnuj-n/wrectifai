# Sprint 3 RAG Upgrade — AI Diagnosis Grounding Walkthrough

**Date**: 2026-07-05  
**Status**: Completed  
**Deliverable**: Grounded AI Diagnosis Engine using a database of known issues, with token-based query matching and support for structured user intake answers.

---

## 1. Database Table & Seed
*   **Migration**: Added [004_known_issues.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/004_known_issues.sql) which creates the `known_issues` table.
*   **Seed Data**: Populated the database with 18 issues mapped from the frontend configuration across 6 categories (Engine Noise, AC, Brakes, Pickup, Starting, Steering/Suspension) with USD price ranges, parts lists, and steps.
*   **Performance**: Created GIN indexes on `symptom_keywords` and `makes`.

---

## 2. Backend Matching Service
*   **Knowledge Service** ([knowledge.service.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/knowledge.service.ts)):
    *   Accepts the raw symptom text, vehicle make/year, and selected category.
    *   Performs token-based matching in PostgreSQL: splits user symptoms into search terms, filters common stop words, and scores rows by matching keyword counts.
*   **Safety Overrides**: If any matched issue is flagged as `safety_critical` in the database, the code-level guardrail forces `diyAllowed = false` and `nextAction = 'bookGarage'`.

---

## 3. Frontend & Router Integration
*   **Route Payload**: `POST /diagnosis` in [diagnosis.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/diagnosis.routes.ts) now accepts `intakeAnswers` and forwards them to `runDiagnosis()`.
*   **Frontend Client**: [diagnosis-api.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/lib/diagnosis-api.ts) supports sending `intakeAnswers`.
*   **UI Page Wiring**: [ai-diagnose-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx) forwards the active category and completed answers mapping in its submit payload.

---

## 4. Verification
*   **Automated tests** passed successfully:
    ```bash
    pnpm test:api
    ```
    Includes `KnowledgeService` keyword matching and custom safety overrides.
