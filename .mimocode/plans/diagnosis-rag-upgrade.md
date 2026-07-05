# Plan: Add Diagnostic Knowledge Base to AI Diagnosis Engine

## Context

The current diagnosis engine sends raw symptom text + vehicle info to an LLM and trusts it to generate all diagnostic knowledge (issues, parts, prices, confidence, DIY steps). The frontend already has a rich structured knowledge base in `issue-intake-config.ts` (6 categories, keyword matching, structured questions, possible issues with prices) but it's hardcoded and never reaches the backend.

**Goal**: Ground the LLM's diagnosis in a real knowledge base so outputs are based on known automotive data, not hallucinations.

---

## Approach: Structured Knowledge Base (SQL retrieval, no vector embeddings)

RAG with vector embeddings is overkill for an automotive diagnosis system. The knowledge is structured (symptoms, vehicle rules, part names, prices) and maps cleanly to SQL queries. A `known_issues` table with keyword/vehicle matching provides 90% of the value at 10% of the complexity.

### What changes

1. **New DB migration**: `known_issues` table
2. **New DB migration**: `parts_catalog` table (optional, Phase 2)
3. **New service**: `knowledge.service.ts` — retrieves matching known issues from DB
4. **Updated service**: `diagnosis.service.ts` — injects retrieved knowledge into LLM prompt
5. **Seed data**: Populate `known_issues` from the existing frontend `issue-intake-config.ts` data
6. **Frontend update**: Send structured intake answers (not just raw text) to backend

### What doesn't change

- LLM provider setup (Groq/OpenAI) stays the same
- Safety guardrail logic stays the same
- Frontend UI components stay the same
- Database transaction pattern stays the same

---

## Phase 1: Backend Knowledge Base (shippable alone)

### Step 1: DB Migration — `known_issues` table

```sql
CREATE TABLE known_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- What symptom category this matches
    category VARCHAR(100) NOT NULL,           -- 'engine_noise', 'ac_not_cooling', etc.
    symptom_keywords TEXT[] NOT NULL,          -- ['ticking sound', 'knocking sound', ...]
    
    -- Vehicle applicability
    makes TEXT[],                              -- ['Honda', 'Toyota'] or NULL = all
    year_from INTEGER,                         -- minimum model year
    year_to INTEGER,                           -- maximum model year
    
    -- The issue itself
    issue_name VARCHAR(255) NOT NULL,          -- 'Low Engine Oil or Poor Lubrication'
    description TEXT NOT NULL,
    
    -- Severity and routing
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    diy_allowed BOOLEAN NOT NULL DEFAULT true,
    safety_critical BOOLEAN NOT NULL DEFAULT false,  -- overrides diy_allowed if true
    
    -- Parts and pricing (grounded in reality)
    required_parts JSONB,                      -- [{"name": "Engine oil", "category": "fluid"}]
    estimated_cost_min NUMERIC(10, 2),
    estimated_cost_max NUMERIC(10, 2),
    cost_currency VARCHAR(3) DEFAULT 'USD',
    
    -- Repair info
    diy_steps TEXT[],                          -- step-by-step if DIY allowed
    garage_steps TEXT[],                       -- what a mechanic would do
    labor_hours_estimate NUMERIC(4, 1),       -- estimated labor hours
    
    -- Confidence calibration
    base_confidence NUMERIC(5, 2) NOT NULL,    -- base match confidence before vehicle adjustment
    
    -- Metadata
    source VARCHAR(100),                       -- 'manual', 'manufacturer_tsb', 'service_data'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_known_issues_category ON known_issues(category);
CREATE INDEX idx_known_issues_symptom_keywords ON known_issues USING GIN(symptom_keywords);
CREATE INDEX idx_known_issues_makes ON known_issues USING GIN(makes);
CREATE INDEX idx_known_issues_risk_level ON known_issues(risk_level);
CREATE INDEX idx_known_issues_safety_critical ON known_issues(safety_critical);
```

### Step 2: Knowledge Service — `knowledge.service.ts`

```typescript
// apps/api/src/modules/diagnosis/knowledge.service.ts

interface RetrievedIssue {
  issue_name: string;
  description: string;
  risk_level: string;
  diy_allowed: boolean;
  safety_critical: boolean;
  required_parts: { name: string; category: string }[];
  estimated_cost_min: number;
  estimated_cost_max: number;
  diy_steps: string[];
  base_confidence: number;
}

export class KnowledgeService {
  /**
   * Retrieve matching known issues for a given symptom text and vehicle.
   * Returns top N matches ordered by relevance score.
   */
  static async findMatchingIssues(
    symptomText: string,
    vehicleMake: string,
    vehicleYear: number,
    maxResults: number = 5
  ): Promise<RetrievedIssue[]> {
    // 1. Normalize symptom text
    // 2. Query known_issues WHERE:
    //    - symptom_keywords @> ANY (array overlap)
    //    - makes @> vehicleMake OR makes IS NULL (all vehicles)
    //    - year_from <= vehicleYear AND year_to >= vehicleYear OR both NULL
    // 3. Score matches by keyword overlap count + vehicle specificity bonus
    // 4. Return top N
  }

  /**
   * Get the category of an issue given symptom text.
   * Useful for frontend-to-backend handoff.
   */
  static async classifySymptomCategory(symptomText: string): Promise<string | null> {
    // Simple keyword match against known_issues categories
  }
}
```

### Step 3: Update `diagnosis.service.ts`

Modify `runDiagnosis()` to:

1. Call `KnowledgeService.findMatchingIssues()` BEFORE the LLM call
2. Inject retrieved knowledge into the prompt:

```
Known Issues for this vehicle (from diagnostic database):
---
Issue: Low Engine Oil or Poor Lubrication
- Risk: medium
- DIY: Yes
- Parts: Engine oil ($20-50)
- Steps: 1. Check dipstick... 2. Drain old oil...
- Base confidence: 88%
---
Issue: Drive Belt or Tensioner Issue
- Risk: medium
- DIY: Yes
- Parts: Drive belt ($30-80), Belt tensioner ($50-120)
- Steps: 1. Inspect belt for cracks...
- Base confidence: 71%
---

Use these known issues as PRIMARY reference. Adjust confidence based on how well
the user's symptoms match. Only suggest issues NOT in this list if no known issue
fits well.
```

3. Adjust the safety guardrail to also check `safety_critical` from retrieved issues

### Step 4: Seed Data

Migrate the existing `issue-intake-config.ts` data into the `known_issues` table:

- 6 categories × 3 issues each = 18 seed rows
- Convert frontend's hardcoded prices (Rs. → USD with conversion)
- Add `diy_steps` and `garage_steps` arrays
- Set `makes: NULL` (all vehicles) initially

### Step 5: Unit Tests

- `knowledge.service.test.ts`: Test keyword matching, vehicle filtering, scoring
- Update `diagnosis.service.test.ts`: Test that retrieved knowledge is injected into prompt
- Test that safety_critical overrides work with retrieved data

---

## Phase 2: Frontend Integration (shippable after Phase 1)

### Step 6: Send Structured Intake to Backend

Currently the frontend sends raw `symptomText` after the intake flow. Change to also send:

```typescript
// diagnosis-api.ts
submitDiagnosis({
  vehicleId,
  symptomText: "My car makes a ticking sound when accelerating",
  intakeAnswers: {
    category: "engine_noise",
    answers: {
      noise_timing: "During acceleration",
      noise_character: "Ticking",
      warning_light_engine: "No warning light",
      noise_change_with_ac: "No change",
    }
  }
})
```

### Step 7: Backend Uses Intake Answers

Update `runDiagnosis()` to accept intake answers and:
1. Use the category to narrow `known_issues` query
2. Use answers to filter/boost specific issues
3. Pass both raw text AND structured answers to LLM for richer context

---

## Phase 3: Parts Catalog (optional, future)

### Step 8: Parts Catalog Table

```sql
CREATE TABLE parts_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    compatible_makes TEXT[],
    compatible_models TEXT[],
    compatible_year_from INTEGER,
    compatible_year_to INTEGER,
    avg_retail_price NUMERIC(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_diy_friendly BOOLEAN DEFAULT true,
    source VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

This would replace the LLM's `estimatedPriceRange` with real pricing data.

---

## Verification

### Automated
```bash
npx nx test api          # All existing tests + new knowledge tests
npx nx test web          # Frontend tests still pass
```

### Manual
1. Submit a diagnosis with symptoms that match a known issue → verify known issue appears in results with correct prices/steps
2. Submit symptoms that DON'T match any known issue → verify LLM fallback works (graceful degradation)
3. Submit symptoms for a brake issue → verify safety_critical override fires from retrieved data
4. Check that `confidenceScore` reflects base_confidence from knowledge base, not LLM self-assessment

---

## Risks

| Risk | Mitigation |
|------|------------|
| Knowledge base becomes stale | Track `source` and `updated_at`; add admin UI for updates later |
| No matching issue in DB | Graceful fallback to current LLM-only behavior |
| Seed data prices are wrong | Use `source: 'manual'` initially; update when real data available |
| Performance on keyword search | GIN indexes on `symptom_keywords` and `makes` handle this |

## Files Touched (Phase 1)

- `db/migrations/002_known_issues.sql` (new)
- `db/migrations/003_parts_catalog.sql` (new, Phase 3)
- `apps/api/src/modules/diagnosis/knowledge.service.ts` (new)
- `apps/api/src/modules/diagnosis/knowledge.service.test.ts` (new)
- `apps/api/src/modules/diagnosis/diagnosis.service.ts` (modified)
- `apps/api/src/modules/diagnosis/diagnosis.service.test.ts` (modified)
- `apps/api/src/modules/diagnosis/diagnosis.routes.ts` (modified — accept intakeAnswers)
- `apps/web/src/lib/diagnosis-api.ts` (modified — send intakeAnswers)
- `apps/web/src/pages/ai-diagnose/ai-diagnose-page.tsx` (modified — pass answers to API)
