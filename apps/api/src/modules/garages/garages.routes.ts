import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';
import { query } from '../../config/database';

export const garagesRouter = Router();

garagesRouter.get('/search', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, address, specializations, rating_avg as "ratingAvg", rating_count as "ratingCount"
       FROM garages
       WHERE approval_status = 'approved'`
    );
    return success(res, result.rows);
  } catch (err) {
    return error(
      res,
      err instanceof Error ? err.message : 'Database query failed',
      'DATABASE_ERROR',
      500
    );
  }
});

garagesRouter.get('/:id', (req, res) => {
  return success(res, {
    id: req.params.id,
    name: 'Central Auto Garage',
    address: '123 Main St, Tech City',
    specializations: ['engine', 'brakes'],
    ratingAvg: 4.8,
    ratingCount: 12,
    approvalStatus: 'approved',
  });
});

garagesRouter.post('/onboarding', authenticate, (req, res) => {
  return success(
    res,
    {
      id: 'g3',
      ownerUserId: req.user?.userId,
      name: req.body.name,
      address: req.body.address,
      approvalStatus: 'pending',
      createdAt: new Date().toISOString(),
    },
    201
  );
});
