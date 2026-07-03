import { Router } from 'express';
import { success } from '../../utils/response';
import { authenticate } from '../../middleware/auth';

export const vehiclesRouter = Router();

vehiclesRouter.get('/', authenticate, (req, res) => {
  return success(res, [
    {
      id: 'v1',
      customerId: req.user?.userId,
      make: 'Toyota',
      model: 'RAV4',
      year: 2021,
      vin: '1T1TESTVIN1234567',
      mileage: 24500,
      createdAt: new Date().toISOString(),
    },
  ]);
});

vehiclesRouter.post('/', authenticate, (req, res) => {
  const { make, model, year, vin, mileage } = req.body;
  return success(
    res,
    {
      id: 'v2',
      customerId: req.user?.userId,
      make,
      model,
      year,
      vin,
      mileage,
      createdAt: new Date().toISOString(),
    },
    201
  );
});
