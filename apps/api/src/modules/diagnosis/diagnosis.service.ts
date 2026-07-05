import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getDbPool, query } from '../../config/database';
import { getEnv } from '../../config/env';

// Schema matching frontend requirements and future sprints
export const diagnosisResultSchema = z.object({
  issues: z.array(z.object({
    name: z.string(),
    confidence: z.number().min(0).max(100),
    estimatedPriceRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
    requiredParts: z.array(z.string()),
  })),
  confidenceScore: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  diyAllowed: z.boolean(),
  diySteps: z.array(z.string()),
  nextAction: z.enum(['diy', 'bookGarage', 'buyParts']),
});

export type DiagnosisResult = z.infer<typeof diagnosisResultSchema>;

export interface MediaInput {
  mediaType: 'image' | 'video' | 'audio';
  base64: string;
}

export class DiagnosisService {
  /**
   * Run the diagnosis engine synchronously:
   * 1. Query vehicle details & recent service history.
   * 2. Save media files to local disk.
   * 3. Send prompt & media context to LLM.
   * 4. Enforce safety guardrails.
   * 5. Save all results inside a DB transaction.
   */
  static async runDiagnosis(
    customerId: string,
    vehicleId: string,
    symptomText: string,
    mediaInputs: MediaInput[] = []
  ) {
    const env = getEnv();

    // 1. Fetch vehicle & customer ownership check
    const vehicleRes = await query(
      'SELECT make, model, year, mileage FROM vehicles WHERE id = $1 AND customer_id = $2',
      [vehicleId, customerId]
    );

    if (vehicleRes.rows.length === 0) {
      throw new Error('Vehicle not found or does not belong to the user');
    }
    const vehicle = vehicleRes.rows[0];

    // Fetch last 5 service history records
    const historyRes = await query(
      'SELECT service_date, description, cost FROM vehicle_service_history WHERE vehicle_id = $1 ORDER BY service_date DESC LIMIT 5',
      [vehicleId]
    );
    const serviceHistory = historyRes.rows;

    // 2. Save media files to local disk
    const savedMediaPaths: { mediaType: 'image' | 'video' | 'audio'; url: string }[] = [];
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const input of mediaInputs) {
      // Decode base64
      const matches = input.base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = 'bin';

      if (matches && matches.length === 3) {
        extension = matches[1].split('/')[1] || 'bin';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(input.base64, 'base64');
        if (input.mediaType === 'image') extension = 'jpg';
        if (input.mediaType === 'audio') extension = 'wav';
        if (input.mediaType === 'video') extension = 'mp4';
      }

      // ponytail: generate unique filename using stdlib
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(filePath, buffer);

      savedMediaPaths.push({
        mediaType: input.mediaType,
        url: `/uploads/${filename}`,
      });
    }

    // 3. Call LLM (Vercel AI SDK OpenAI or Groq)
    let aiProvider;
    if (env.llmProvider === 'groq') {
      if (!env.groqApiKey) {
        throw new Error('GROQ_API_KEY is not defined in the environment');
      }
      aiProvider = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: env.groqApiKey,
      });
    } else {
      if (!env.openaiApiKey) {
        throw new Error('OPENAI_API_KEY is not defined in the environment');
      }
      aiProvider = createOpenAI({
        apiKey: env.openaiApiKey,
      });
    }

    const modelInstance = aiProvider(env.llmModel);

    // Format service history for the prompt
    const serviceHistoryText = serviceHistory.length > 0
      ? serviceHistory.map(h => `- [${new Date(h.service_date).toLocaleDateString()}] ${h.description} ($${h.cost || 0})`).join('\n')
      : 'No prior service history recorded.';

    const systemPrompt = `You are WrectifAI, an advanced automotive diagnostic expert system.
Analyze the vehicle details, recent service history, user symptoms, and any provided media descriptions.
Provide a highly structured diagnosis conforming exactly to the required JSON schema.
Be realistic about whether a repair is DIY-safe. Safety-critical components (brakes, steering, suspension, airbags, high-voltage EV battery systems) should NEVER have diyAllowed = true. Always output prices in US dollars.`;

    const userPrompt = `Vehicle Context:
- Make: ${vehicle.make}
- Model: ${vehicle.model}
- Year: ${vehicle.year}
- Mileage: ${vehicle.mileage} miles

Prior Service History:
${serviceHistoryText}

Reported Symptoms:
${symptomText}

Please diagnose the issue.`;

    // Process media content (Vercel AI SDK handles base64 image content natively)
    const contentPayload: any[] = [{ type: 'text', text: userPrompt }];
    
    // Add media descriptions/links to prompt
    mediaInputs.forEach((input, index) => {
      if (input.mediaType === 'image') {
        // Strip data url prefix if present for AI SDK image block
        const base64Data = input.base64.includes(';base64,')
          ? input.base64.split(';base64,')[1]
          : input.base64;
        contentPayload.push({
          type: 'image',
          image: base64Data,
        });
      } else {
        contentPayload.push({
          type: 'text',
          text: `[User attached ${input.mediaType} file #${index + 1} for analysis]`,
        });
      }
    });

    const llmResponse = await generateObject({
      model: modelInstance,
      schema: diagnosisResultSchema,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: contentPayload,
        },
      ],
    });

    const result = DiagnosisService.applySafetyGuardrail(llmResponse.object, symptomText);

    // 5. Database Transaction Persistence
    const pool = getDbPool();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert Request
      const requestInsertRes = await client.query(
        `INSERT INTO diagnosis_requests (customer_id, vehicle_id, symptom_text, status)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [customerId, vehicleId, symptomText, 'completed']
      );
      const dbRequest = requestInsertRes.rows[0];

      // Insert Media records
      const dbMediaList = [];
      for (const mediaPath of savedMediaPaths) {
        const mediaInsertRes = await client.query(
          `INSERT INTO diagnosis_media (diagnosis_request_id, media_type, url)
           VALUES ($1, $2, $3) RETURNING *`,
          [dbRequest.id, mediaPath.mediaType, mediaPath.url]
        );
        dbMediaList.push(mediaInsertRes.rows[0]);
      }

      // Insert Result
      const resultInsertRes = await client.query(
        `INSERT INTO diagnosis_results (diagnosis_request_id, issues, confidence_score, risk_level, diy_allowed, diy_steps, next_action)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          dbRequest.id,
          JSON.stringify(result.issues),
          result.confidenceScore,
          result.riskLevel,
          result.diyAllowed,
          result.diySteps,
          result.nextAction,
        ]
      );
      const dbResult = resultInsertRes.rows[0];

      await client.query('COMMIT');

      return {
        id: dbRequest.id,
        customerId: dbRequest.customer_id,
        vehicleId: dbRequest.vehicle_id,
        symptomText: dbRequest.symptom_text,
        status: dbRequest.status,
        createdAt: dbRequest.created_at,
        media: dbMediaList,
        result: {
          id: dbResult.id,
          issues: dbResult.issues,
          confidenceScore: dbResult.confidence_score,
          riskLevel: dbResult.risk_level,
          diyAllowed: dbResult.diy_allowed,
          diySteps: dbResult.diy_steps,
          nextAction: dbResult.next_action,
        },
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Get single diagnosis request and result details
   */
  static async getDiagnosisById(diagnosisId: string, customerId: string, isAdmin = false) {
    // Ownership verification built directly into the query
    const queryStr = isAdmin
      ? `SELECT dr.*, dr.customer_id as customerId, dr.vehicle_id as vehicleId, dr.symptom_text as symptomText,
                dr.created_at as createdAt,
                dr.status,
                dr.id as id
         FROM diagnosis_requests dr
         WHERE dr.id = $1`
      : `SELECT dr.*, dr.customer_id as customerId, dr.vehicle_id as vehicleId, dr.symptom_text as symptomText,
                dr.created_at as createdAt,
                dr.status,
                dr.id as id
         FROM diagnosis_requests dr
         WHERE dr.id = $1 AND dr.customer_id = $2`;
    
    const params = isAdmin ? [diagnosisId] : [diagnosisId, customerId];
    const reqRes = await query(queryStr, params);

    if (reqRes.rows.length === 0) {
      return null;
    }
    const dbRequest = reqRes.rows[0];

    // Fetch media
    const mediaRes = await query(
      'SELECT id, media_type as mediaType, url FROM diagnosis_media WHERE diagnosis_request_id = $1',
      [diagnosisId]
    );

    // Fetch results
    const resultRes = await query(
      `SELECT id, issues, confidence_score as confidenceScore, risk_level as riskLevel,
              diy_allowed as diyAllowed, diy_steps as diySteps, next_action as nextAction
       FROM diagnosis_results
       WHERE diagnosis_request_id = $1`,
      [diagnosisId]
    );

    return {
      id: dbRequest.id,
      customerId: dbRequest.customerid,
      vehicleId: dbRequest.vehicleid,
      symptomText: dbRequest.symptomtext,
      status: dbRequest.status,
      createdAt: dbRequest.createdat,
      media: mediaRes.rows,
      result: resultRes.rows[0] ? {
        id: resultRes.rows[0].id,
        issues: resultRes.rows[0].issues,
        confidenceScore: resultRes.rows[0].confidencescore,
        riskLevel: resultRes.rows[0].risklevel,
        diyAllowed: resultRes.rows[0].diyallowed,
        diySteps: resultRes.rows[0].diysteps,
        nextAction: resultRes.rows[0].nextaction,
      } : null,
    };
  }

  /**
   * Apply hardcoded safety guardrails to LLM result
   */
  static applySafetyGuardrail(result: DiagnosisResult, symptomText: string): DiagnosisResult {
    const safetyKeywords = ['brake', 'steering', 'airbag', 'suspension', 'high-voltage', 'hybrid battery', 'stabilizer', 'abs'];
    const hasSafetyCriticalIssue = result.issues.some(issue => 
      safetyKeywords.some(keyword => issue.name.toLowerCase().includes(keyword))
    ) || safetyKeywords.some(keyword => symptomText.toLowerCase().includes(keyword));

    const finalResult = { ...result };
    if (finalResult.riskLevel === 'high' || finalResult.riskLevel === 'critical' || hasSafetyCriticalIssue) {
      finalResult.diyAllowed = true; // start with true, but override below
      finalResult.diyAllowed = false;
      finalResult.nextAction = 'bookGarage';
    }
    return finalResult;
  }
}
