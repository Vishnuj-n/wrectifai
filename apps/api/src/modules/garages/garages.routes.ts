import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';
import { query } from '../../config/database';

export const garagesRouter = Router();

garagesRouter.get('/search', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, address, specializations, approval_status, rating_avg as "ratingAvg", rating_count as "ratingCount"
       FROM garages
       WHERE approval_status = 'approved'`
    );
    const mapped = result.rows.map((g: any) => ({
      id: g.id,
      name: g.name,
      location: g.address,
      rating: Number(g.ratingAvg || 4.5),
      reviews: Number(g.ratingCount || 0),
      distanceKm: 2.5, // ponytail: default mock distance
      responseMins: 30, // ponytail: default mock response time
      chips: g.specializations || [],
      verified: g.approval_status === 'approved',
      badge: Number(g.ratingAvg || 0) >= 4.5 ? 'Top Rated' : '',
      badgeTone: Number(g.ratingAvg || 0) >= 4.5 ? 'bg-[#1aa14a]' : '',
      tone: 'from-[#0d1118] via-[#43301c] to-[#0b0f16]',
      image: '/assets/garage_1_1778071156220.png',
    }));
    return success(res, mapped);
  } catch (err) {
    return error(
      res,
      err instanceof Error ? err.message : 'Database query failed',
      'DATABASE_ERROR',
      500
    );
  }
});

garagesRouter.get('/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, address, specializations, approval_status, rating_avg as "ratingAvg", rating_count as "ratingCount"
       FROM garages
       WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return error(res, 'Garage not found', 'NOT_FOUND', 404);
    }
    const g = result.rows[0];
    const mapped = {
      id: g.id,
      name: g.name,
      location: g.address,
      rating: Number(g.ratingAvg || 4.5),
      reviews: Number(g.ratingCount || 0),
      distanceKm: 2.5,
      responseMins: 30,
      chips: g.specializations || [],
      verified: g.approval_status === 'approved',
      badge: Number(g.ratingAvg || 0) >= 4.5 ? 'Top Rated' : '',
      badgeTone: Number(g.ratingAvg || 0) >= 4.5 ? 'bg-[#1aa14a]' : '',
      tone: 'from-[#0d1118] via-[#43301c] to-[#0b0f16]',
      image: '/assets/garage_1_1778071156220.png',
    };
    return success(res, mapped);
  } catch (err) {
    return error(
      res,
      err instanceof Error ? err.message : 'Database query failed',
      'DATABASE_ERROR',
      500
    );
  }
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
