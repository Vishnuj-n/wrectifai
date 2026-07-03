import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';

export const diagnosisRouter = Router();

diagnosisRouter.post('/', authenticate, (req, res) => {
  const { vehicleId, symptomText } = req.body;
  if (!vehicleId) {
    return error(res, 'Vehicle ID is required', 'BAD_REQUEST', 400);
  }

  return success(
    res,
    {
      id: 'diag_req_1',
      customerId: req.user?.userId,
      vehicleId,
      symptomText,
      status: 'completed',
      result: {
        issues: [
          { issue: 'Spark plug wear', confidence: 85 },
          { issue: 'Ignition coil issue', confidence: 60 },
        ],
        confidenceScore: 85,
        riskLevel: 'medium',
        diyAllowed: true,
        diySteps: ['Turn off engine', 'Replace spark plug with proper socket wrench'],
        nextAction: 'diy',
      },
      createdAt: new Date().toISOString(),
    },
    201
  );
});

diagnosisRouter.get('/:id', authenticate, (req, res) => {
  return success(res, {
    id: req.params.id,
    customerId: req.user?.userId,
    vehicleId: 'v1',
    status: 'completed',
    createdAt: new Date().toISOString(),
  });
});
