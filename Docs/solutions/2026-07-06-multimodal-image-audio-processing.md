# Multimodal Processing — Image (llama-4-scout) + Audio (Whisper)

**Date**: 2026-07-06  
**Files changed**: `apps/api/src/modules/diagnosis/diagnosis.service.ts`, `apps/api/src/config/env.ts`, `.env`  
**Endpoint**: `POST /api/v1/ai-diagnose`

---

## Problem

Before this change, `POST /api/v1/ai-diagnose` accepted `mediaInputs[]` but:

| Media type | Previous behaviour | Why it was broken |
|---|---|---|
| **Image** | Sent as `{ type: 'image'; image: base64 }` directly to `llama-3.1-70b-versatile` | That model is text-only — it silently ignores or errors on image blocks |
| **Audio** | Added a placeholder text `[User attached audio file #N for analysis]` | Never transcribed; audio content was completely lost |

---

## Solution

Pre-process each media type with a **dedicated model** before the main diagnosis LLM call, then feed extracted text into the existing text-only pipeline. No schema changes. No new npm packages.

```
User submits: symptomText + images[] + audio[]
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
   DB Lookup   analyzeImage()  transcribeAudio()
   (existing)  llama-4-scout   whisper-large-v3-turbo
               Groq Vision     Groq STT (raw fetch)
        │           │            │
        │      text description  transcribed text
        │           │            │
        └───────────┴────────────┘
                    │
             finalSymptomText (persisted to DB)
                    │
            Diagnosis LLM (text-only, any model)
                    │
            Safety Guardrail
                    │
            DiagnosisResult (JSON)
```

All three paths run **concurrently** via `Promise.all`.

---

## New Static Methods

### `DiagnosisService.analyzeImage(base64Image: string): Promise<string>`

- **Model**: `meta-llama/llama-4-scout-17b-16e-instruct` (Groq Vision)
- **Transport**: Vercel AI SDK `generateText()` via `@ai-sdk/openai` pointed at `https://api.groq.com/openai/v1`
- **Input**: base64 image string (with or without `data:image/...;base64,` prefix)
- **Output**: Plain-text description of visible damage, wear, or mechanical issues
- **Failure**: Returns `''` on error — never throws; diagnosis continues without image context

### `DiagnosisService.transcribeAudio(base64Audio: string, mimeType: string): Promise<string>`

- **Model**: `whisper-large-v3-turbo` (Groq STT)
- **Transport**: Native Node 22 `fetch` + `FormData` + `Blob` — **no new dependencies**
- **Why raw fetch**: The Vercel AI SDK has no transcription support. Both Groq and OpenAI use an identical OpenAI-compatible multipart endpoint (`/audio/transcriptions`), so one fetch call covers both providers
- **Output**: Plain-text transcript
- **Failure**: Returns `''` on error — never throws

---

## Changes to `runDiagnosis()`

### Before

```typescript
// Broken: sent { type: 'image'; image: base64 } to a text-only model
contentPayload.push({ type: 'image', image: base64Data });

// Audio: placeholder only, never transcribed
contentPayload.push({ type: 'text', text: `[User attached audio file #${index + 1}]` });
```

### After

```typescript
// Both run in parallel before the LLM call
const [imageDescriptions, audioTranscripts] = await Promise.all([
  Promise.all(mediaInputs.filter(m => m.mediaType === 'image').map(m => DiagnosisService.analyzeImage(m.base64))),
  Promise.all(mediaInputs.filter(m => m.mediaType === 'audio').map(m => DiagnosisService.transcribeAudio(m.base64, 'audio/wav'))),
]);

// Audio transcript is appended to symptomText and persisted to DB
finalSymptomText = transcriptText
  ? `${symptomText}\n\n[Transcribed Audio]: ${transcriptText}`
  : symptomText;

// Image descriptions are injected as a labelled section after the user prompt
const imageContext = `\n\nImage Analysis:\n${imageDescriptions.map((d, i) => `- Image #${i+1}: ${d}`).join('\n')}`;

// Main LLM receives everything as plain text — stays text-only compatible
const contentPayload = [{ type: 'text', text: userPrompt + imageContext }];
```

### DB persistence

`finalSymptomText` (which includes the `[Transcribed Audio]: ...` suffix if audio was provided) is now persisted to `diagnosis_requests.symptom_text` instead of the raw original input.

---

## Environment Variables

All new vars default to Groq and reuse `GROQ_API_KEY` — no new secrets needed.

| Variable | Default | Purpose |
|---|---|---|
| `IMAGE_LLM_PROVIDER` | `groq` | `groq` or `openai` |
| `IMAGE_LLM_MODEL` | `meta-llama/llama-4-scout-17b-16e-instruct` | Vision model |
| `AUDIO_PROVIDER` | `groq` | `groq` or `openai` |
| `AUDIO_MODEL` | `whisper-large-v3-turbo` | STT model |

To switch to OpenAI for images: set `IMAGE_LLM_PROVIDER=openai`, `IMAGE_LLM_MODEL=gpt-4o`, and ensure `OPENAI_API_KEY` is set.

---

## Type Safety Note — `OpenAIImageUrlPart`

The Groq Vision API accepts the **OpenAI wire format**:

```json
{ "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,..." } }
```

The Vercel AI SDK does not expose this type. Its native shape is `ImagePart` (`{ type: 'image'; image: DataContent }`). Rather than using `as any`, we define a local interface and double-cast through `unknown`:

```typescript
interface OpenAIImageUrlPart {
  type: 'image_url';
  image_url: { url: string };
}

// In the content array:
({ type: 'image_url', image_url: { url: imageUrl } } as OpenAIImageUrlPart) as unknown as ImagePart
```

This is the TypeScript-idiomatic way to bridge intentionally incompatible types — explicit, documented, and lint-clean. See `2026-07-06-image-url-as-any-cast.md` for full rationale.

---

## Verification

| Scenario | Expected behaviour |
|---|---|
| No media | Existing flow unchanged |
| Image only | `diySteps` / `issues` contain image-derived insights |
| Audio only | `symptom_text` in DB row shows `[Transcribed Audio]: ...` suffix |
| Both | Both appear in prompt context and DB |
| Provider override (`IMAGE_LLM_PROVIDER=openai`) | Routes to OpenAI Vision |

Run existing unit tests:
```bash
nx test api
```

All 5 `applySafetyGuardrail` tests must pass — that method is untouched.
