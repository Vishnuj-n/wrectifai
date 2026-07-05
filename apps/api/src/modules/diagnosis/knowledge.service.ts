import { query } from '../../config/database';

export interface RetrievedIssue {
  id: string;
  category: string;
  issue_name: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  diy_allowed: boolean;
  safety_critical: boolean;
  required_parts: { name: string; category: string }[];
  estimated_cost_min: number;
  estimated_cost_max: number;
  diy_steps: string[];
  garage_steps: string[];
  base_confidence: number;
}

export class KnowledgeService {
  /**
   * Retrieve matching known issues for a given symptom text and optional vehicle.
   * Returns matches ordered by relevance score.
   */
  static async findMatchingIssues(
    symptomText: string,
    vehicleMake?: string,
    vehicleYear?: number,
    category?: string,
    maxResults = 5
  ): Promise<RetrievedIssue[]> {
    // Split symptomText into words, sanitize, and filter out common stop words
    const stopWords = new Set(['and', 'the', 'for', 'with', 'from', 'you', 'your', 'makes', 'making', 'when', 'that', 'this', 'is', 'are', 'was', 'were']);
    const tokens = symptomText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1 && !stopWords.has(w));

    const tokenArray = tokens.length > 0 ? tokens : [symptomText.toLowerCase()];

    const queryText = `
      WITH scored_issues AS (
        SELECT *,
               (
                 SELECT COUNT(*) 
                 FROM unnest(symptom_keywords) kw 
                 WHERE exists (
                   SELECT 1 
                   FROM unnest($1::text[]) token 
                   WHERE position(token in lower(kw)) > 0
                 )
               ) as match_count
        FROM known_issues
        WHERE 
          -- Category filtering (if provided)
          ($4::varchar IS NULL OR category = $4)
          -- Make applicability
          AND ($2::varchar IS NULL OR makes IS NULL OR exists (select 1 from unnest(makes) m where lower(m) = lower($2)))
          -- Year applicability
          AND ($3::integer IS NULL OR (
            (year_from IS NULL OR year_from <= $3) AND 
            (year_to IS NULL OR year_to >= $3)
          ))
      )
      SELECT * FROM scored_issues
      WHERE match_count > 0
      ORDER BY match_count DESC, base_confidence DESC
      LIMIT $5
    `;

    const makeParam = vehicleMake || null;
    const yearParam = vehicleYear || null;
    const categoryParam = category || null;

    const res = await query(queryText, [tokenArray, makeParam, yearParam, categoryParam, maxResults]);

    return res.rows.map(row => ({
      id: row.id,
      category: row.category,
      issue_name: row.issue_name,
      description: row.description,
      risk_level: row.risk_level,
      diy_allowed: row.diy_allowed,
      safety_critical: row.safety_critical,
      required_parts: Array.isArray(row.required_parts) ? row.required_parts : [],
      estimated_cost_min: parseFloat(row.estimated_cost_min),
      estimated_cost_max: parseFloat(row.estimated_cost_max),
      diy_steps: Array.isArray(row.diy_steps) ? row.diy_steps : [],
      garage_steps: Array.isArray(row.garage_steps) ? row.garage_steps : [],
      base_confidence: parseFloat(row.base_confidence)
    }));
  }
}
