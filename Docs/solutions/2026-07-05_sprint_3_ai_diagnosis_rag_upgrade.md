# Sprint 3 RAG Upgrade — AI Diagnosis Grounding Walkthrough

**Date**: 2026-07-05  
**Status**: Completed  
**Deliverable**: Grounded AI Diagnosis Engine using a database of known issues, with token-based query matching and support for structured user intake answers. Upgraded with PostgreSQL Full Text Search (FTS), zero-match LLM bypass, and strict safety guardrails.

---

## 1. Database Table & Seed
*   **Migration**: Added [004_known_issues.sql](file:///c:/Users/vishn/PROJECT/wrectifai/db/migrations/004_known_issues.sql) which creates the `known_issues` table.
*   **Seed Data**: Populated the database with 18 issues mapped from the frontend configuration across 6 categories (Engine Noise, AC, Brakes, Pickup, Starting, Steering/Suspension) with USD price ranges, parts lists, and steps.
*   **Performance**: Created GIN indexes on `symptom_keywords` and `makes`.

---

## 2. Backend Matching Service (Upgraded to FTS)
*   **Knowledge Service** ([knowledge.service.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/knowledge.service.ts)):
    *   Accepts the raw symptom text, vehicle make/year, and selected category.
    *   **PostgreSQL Full Text Search (FTS)**: Refactored database search to use native Postgres FTS (`to_tsvector`, `to_tsquery` using OR conditions and prefix matching `:*`, and `ts_rank_cd` scoring). This provides native stemming (e.g. "clicking" matches "click") and stop-word filtering entirely in the database layer.
*   **Zero-Match LLM Bypass**:
    *   If database lookup yields zero results, the system bypasses the LLM call entirely. It immediately returns a mock "Clarification Required" result asking for more description. This eliminates hallucinations and saves API costs for vague/unmatched queries.
*   **Safety Overrides**:
    *   Uses a compiled regex with word boundaries `/\b(brake|steering|airbag|suspension|high-voltage|hybrid_battery|hybrid battery|stabilizer|abs)\b/i` in [diagnosis.service.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/diagnosis.service.ts) to prevent false positives (like "absent" matching "abs").
    *   Forces `diyAllowed = false` and `nextAction = 'bookGarage'` if any safety-critical keywords or DB-flagged issues are detected.

---

## 3. Frontend & Router Integration (Pre-Fetch Agentic Architecture)
*   **Route Payload**: `POST /diagnosis` in [diagnosis.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/diagnosis.routes.ts) supports `stage` ('questions' | 'final').
    *   `stage: 'questions'` triggers backend pre-fetch and LLM dynamic question generation.
    *   `stage: 'final'` runs final synthesis and transaction database persistence.
*   **Frontend Client**: [diagnosis-api.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/lib/diagnosis-api.ts) payload supports custom questions and answers.
*   **UI Page Wiring**: [ai-diagnose-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx) handles the dynamic conversation loop, walking the user through LLM-generated questions dynamically and initiating final synthesis on completion.

---

## 4. Verification
*   **Automated tests** passed successfully:
    ```bash
    npx nx test api
    ```
    Includes `KnowledgeService` keyword matching and custom safety overrides.
