import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';
import { DiagnosisService } from './diagnosis.service';

export const diagnosisRouter = Router();

// Submit symptoms and run LLM diagnosis
diagnosisRouter.post('/', authenticate, async (req, res) => {
  try {
    const { vehicleId, symptomText, media } = req.body;
    
    if (!vehicleId) {
      return error(res, 'Vehicle ID is required', 'BAD_REQUEST', 400);
    }
    if (!symptomText) {
      return error(res, 'Symptom text is required', 'BAD_REQUEST', 400);
    }

    const customerId = req.user?.userId;
    if (!customerId) {
      return error(res, 'Authentication failed: no customer ID found', 'UNAUTHORIZED', 401);
    }

    const diagnosis = await DiagnosisService.runDiagnosis(
      customerId,
      vehicleId,
      symptomText,
      media || []
    );

    return success(res, diagnosis, 201);
  } catch (err: any) {
    console.error('Diagnosis creation error:', err);
    if (err.message.includes('Vehicle not found') || err.message.includes('does not belong to the user')) {
      return error(res, err.message, 'BAD_REQUEST', 400);
    }
    return error(res, err.message || 'An error occurred during diagnosis processing', 'INTERNAL_SERVER_ERROR', 500);
  }
});

// Fetch detailed diagnosis result
diagnosisRouter.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.userId;
    const isAdmin = req.user?.role === 'admin';

    if (!customerId) {
      return error(res, 'Authentication failed: no customer ID found', 'UNAUTHORIZED', 401);
    }

    const diagnosis = await DiagnosisService.getDiagnosisById(id, customerId, isAdmin);
    
    if (!diagnosis) {
      return error(res, 'Diagnosis request not found', 'NOT_FOUND', 404);
    }

    return success(res, diagnosis, 200);
  } catch (err: any) {
    console.error('Diagnosis fetch error:', err);
    return error(res, err.message || 'An error occurred while fetching the diagnosis', 'INTERNAL_SERVER_ERROR', 500);
  }
});
