# Sprint 3 — AI Diagnosis Engine Walkthrough

**Date**: 2026-07-04  
**Status**: Completed  
**Deliverable**: Dynamic, provider-agnostic structured AI Diagnosis Engine (supporting Groq and OpenAI), local base64 file processing, database transaction storage, and dynamic frontend page integration.

---

## 1. Environment & API Configuration

Added dynamic config variables to the environment:
- [.env](file:///c:/Users/vishn/PROJECT/wrectifai/.env) adds LLM provider/model configurations:
  ```env
  LLM_PROVIDER=groq
  LLM_MODEL=llama-3.1-70b-versatile
  GROQ_API_KEY=
  OPENAI_API_KEY=
  ```
- Exposed the configurations in [env.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/config/env.ts).

---

## 2. Backend Service & Safety Guardrails

- **Diagnosis Service** ([diagnosis.service.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/diagnosis.service.ts)):
  - Retrieves customer vehicle details (make, model, year, mileage) and the last 5 service history records to supply rich diagnostic context to the LLM.
  - Decodes base64 attachments (images, audio, video) and saves them natively to `uploads/` without multipart-parsing dependencies (no `multer`).
  - Calls Vercel AI SDK (`generateObject`) using a strict Zod schema enforcing output fields: issues (name, confidence, cost range, required parts), confidence score, risk level, DIY safety, steps, and next action.
  - Implements the safety guardrail override: High/critical risk levels or safety-critical issues (brakes, steering, high-voltage battery) set `diyAllowed = false` and force `nextAction = 'bookGarage'`.
  - Atomically saves requests, media references, and results inside a single SQL transaction block.
- **Service Unit Tests** ([diagnosis.service.test.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/diagnosis.service.test.ts)):
  - Validates safety guardrail logic (correctly overrides `diyAllowed` and `nextAction` for brakes, steering, and high risk cases, while leaving safe wiper blade issues alone).

---

## 3. API Router & Frontend Integration

- **Backend API Endpoint** ([diagnosis.routes.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/api/src/modules/diagnosis/diagnosis.routes.ts)):
  - Exposes `POST /` to submit symptoms and return live diagnosis results.
  - Exposes `GET /:id` to fetch detailed results for the authorized owner or admins.
- **Frontend API client** ([diagnosis-api.ts](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/lib/diagnosis-api.ts)):
  - Implements `submitDiagnosis()` and `getDiagnosis()` API wrappers.
- **UI Page Wiring** ([ai-diagnose-page.tsx](file:///c:/Users/vishn/PROJECT/wrectifai/apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx)):
  - Maps real backend results into the results view.
  - Dynamically renders confidence score gauge, custom next steps, parts list, price estimates, and safety warnings returned by the API.

---

## 4. Verification

### Automated Tests
Ran API test suite:
```bash
npx nx test api
```
**Results**: All 25 tests (including the new safety override tests) passed successfully.
