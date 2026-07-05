import { apiClient } from './api-client';

export interface DiagnosticIssue {
  name: string;
  confidence: number;
  estimatedPriceRange: {
    min: number;
    max: number;
  };
  requiredParts: string[];
}

export interface DiagnosticResult {
  id: string;
  issues: DiagnosticIssue[];
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  diyAllowed: boolean;
  diySteps: string[];
  nextAction: 'diy' | 'bookGarage' | 'buyParts';
}

export interface DiagnosisMedia {
  id: string;
  mediaType: 'image' | 'video' | 'audio';
  url: string;
}

export interface DiagnosisResponse {
  id: string;
  customerId: string;
  vehicleId: string;
  symptomText: string;
  status: 'received' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  media: DiagnosisMedia[];
  result: DiagnosticResult;
}

export interface SubmitDiagnosisPayload {
  vehicleId: string;
  symptomText: string;
  media?: Array<{ mediaType: 'image' | 'video' | 'audio'; base64: string }>;
  intakeAnswers?: {
    category: string | null;
    answers: Record<string, string>;
  };
}

export async function submitDiagnosis(payload: SubmitDiagnosisPayload): Promise<DiagnosisResponse> {
  return apiClient.post('/diagnosis', payload);
}

export async function getDiagnosis(id: string): Promise<DiagnosisResponse> {
  return apiClient.get(`/diagnosis/${id}`);
}
