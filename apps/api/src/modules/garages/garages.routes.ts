import { Router } from 'express';
import { success } from '../../utils/response';
import { authenticate } from '../../middleware/auth';

export const garagesRouter = Router();

garagesRouter.get('/search', (req, res) => {
  return success(res, [
    {
      id: 'g1',
      name: 'Central Auto Garage',
      address: '123 Main St, Tech City',
      specializations: ['engine', 'brakes'],
      ratingAvg: 4.8,
      ratingCount: 12,
    },
    {
      id: 'g2',
      name: 'EV Specialist Hub',
      address: '456 Electric Rd, Green Valley',
      specializations: ['EV', 'battery'],
      ratingAvg: 4.9,
      ratingCount: 8,
    },
  ]);
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
