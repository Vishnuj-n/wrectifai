import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';

export const quotesRouter = Router();

quotesRouter.post('/requests', authenticate, (req, res) => {
  const { vehicleId, issueSummary } = req.body;
  if (!vehicleId || !issueSummary) {
    return error(res, 'Vehicle ID and Issue Summary are required', 'BAD_REQUEST', 400);
  }

  return success(
    res,
    {
      id: 'qr_1',
      customerId: req.user?.userId,
      vehicleId,
      issueSummary,
      status: 'open',
      createdAt: new Date().toISOString(),
    },
    201
  );
});

quotesRouter.get('/requests/:requestId', authenticate, (req, res) => {
  return success(res, {
    id: req.params.requestId,
    customerId: req.user?.userId,
    vehicleId: 'v1',
    issueSummary: 'Clunking noise from suspension',
    status: 'open',
    createdAt: new Date().toISOString(),
  });
});

quotesRouter.post('/requests/:requestId/quotes', authenticate, (req, res) => {
  const { amount, etaDays } = req.body;
  return success(
    res,
    {
      id: 'q_1',
      quoteRequestId: req.params.requestId,
      garageId: 'g1',
      amount: amount || 250.0,
      currency: 'USD',
      etaDays: etaDays || 2,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    201
  );
});
