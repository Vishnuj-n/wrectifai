import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';
import { query } from '../../config/database';

export const garagesRouter = Router();

function mapGarageDbRow(g: any) {
  return {
    id: g.id,
    name: g.name,
    location: g.address || '',
    rating: g.ratingAvg !== null && g.ratingAvg !== undefined ? Number(g.ratingAvg) : 0,
    reviews: Number(g.ratingCount || 0),
    distance: g.distanceKm || null,
    price: g.startingPrice || null,
    badge: g.badge || null,
    image: g.image || null,
    chips: g.specializations || [],
    verified: g.approval_status === 'approved',
    responseMins: g.responseMins !== null && g.responseMins !== undefined ? Number(g.responseMins) : 30,
  };
}

garagesRouter.get('/search', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, address, specializations, approval_status, 
              rating_avg as "ratingAvg", rating_count as "ratingCount",
              starting_price as "startingPrice", distance_km as "distanceKm",
              badge, image, response_mins as "responseMins"
       FROM garages
       WHERE approval_status = 'approved'`
    );

    const mapped = result.rows.map(mapGarageDbRow);
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
      `SELECT id, name, address, specializations, approval_status, 
              rating_avg as "ratingAvg", rating_count as "ratingCount",
              starting_price as "startingPrice", distance_km as "distanceKm",
              badge, image, response_mins as "responseMins"
       FROM garages
       WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return error(res, 'Garage not found', 'NOT_FOUND', 404);
    }
    const mapped = mapGarageDbRow(result.rows[0]);
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
