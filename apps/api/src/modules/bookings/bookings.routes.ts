import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';

export const bookingsRouter = Router();

bookingsRouter.post('/instant', authenticate, (req, res) => {
  const { garageId, vehicleId, scheduledAt, totalAmount } = req.body;
  if (!garageId || !vehicleId || !scheduledAt || !totalAmount) {
    return error(res, 'Missing required booking fields', 'BAD_REQUEST', 400);
  }

  return success(
    res,
    {
      id: 'b_inst_1',
      customerId: req.user?.userId,
      garageId,
      vehicleId,
      bookingType: 'instant',
      scheduledAt,
      status: 'pendingPayment',
      totalAmount,
      currency: 'USD',
      createdAt: new Date().toISOString(),
    },
    201
  );
});

bookingsRouter.get('/', authenticate, (req, res) => {
  return success(res, [
    {
      id: 'b1',
      customerId: req.user?.userId,
      garageId: 'g1',
      vehicleId: 'v1',
      bookingType: 'instant',
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      status: 'confirmed',
      totalAmount: 150.0,
      currency: 'USD',
    },
  ]);
});
