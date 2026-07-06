import { Router } from 'express';
import { success, error } from '../../utils/response';
import { authenticate } from '../../middleware/auth';
import { query } from '../../config/database';

export const quotesRouter = Router();

quotesRouter.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT q.id, q.quote_request_id as "quoteRequestId", q.amount, q.currency, q.eta_days as "etaDays", q.status, q.created_at as "createdAt", q.details,
              g.name as "garageName", g.rating_avg as "ratingAvg", g.rating_count as "ratingCount", g.pickup_drop_supported as "pickupDropSupported"
       FROM quotes q
       JOIN garages g ON q.garage_id = g.id
       ORDER BY q.created_at DESC`
    );

    const mapped = result.rows.map((row: any) => {
      const details = row.details || {};
      const amountNum = Number(row.amount);
      const savingsNum = Number(details.savings || 0);

      return {
        id: row.id,
        status: details.ui_status || 'open',
        garage: row.garageName,
        image: details.image || '/assets/garage_1_1778071156220.png',
        rating: String(row.ratingAvg || '4.5'),
        reviews: Number(row.ratingCount || 0),
        distance: details.distance || '3.0 km away',
        meta: details.tag || 'Certified technicians',
        metaSecondary: details.warranty || '6 Months warranty',
        price: `$${amountNum.toLocaleString('en-US')}`,
        savings: `$${savingsNum.toLocaleString('en-US')}`,
        time: details.availability || '10 mins ago',
        tag: details.tag || undefined,
        details: {
          parts: details.parts,
          labour: details.labour,
          consumables: details.consumables,
          gst: details.gst,
          availability: details.availability,
          pickupDrop: details.pickup_drop,
          warranty: details.warranty,
          experience: details.experience,
        }
      };
    });

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

quotesRouter.get('/:quoteId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT q.id, q.quote_request_id as "quoteRequestId", q.amount, q.currency, q.eta_days as "etaDays", q.status, q.created_at as "createdAt", q.details,
              g.name as "garageName", g.rating_avg as "ratingAvg", g.rating_count as "ratingCount", g.pickup_drop_supported as "pickupDropSupported"
       FROM quotes q
       JOIN garages g ON q.garage_id = g.id
       WHERE q.id = $1`,
      [req.params.quoteId]
    );

    if (result.rows.length === 0) {
      return error(res, 'Quote not found', 'NOT_FOUND', 404);
    }

    const row = result.rows[0];
    const details = row.details || {};
    const amountNum = Number(row.amount);
    const savingsNum = Number(details.savings || 0);

    const mapped = {
      id: row.id,
      status: details.ui_status || 'open',
      garage: row.garageName,
      image: details.image || '/assets/garage_1_1778071156220.png',
      rating: String(row.ratingAvg || '4.5'),
      reviews: Number(row.ratingCount || 0),
      distance: details.distance || '3.0 km away',
      meta: details.tag || 'Certified technicians',
      metaSecondary: details.warranty || '6 Months warranty',
      price: `$${amountNum.toLocaleString('en-US')}`,
      savings: `$${savingsNum.toLocaleString('en-US')}`,
      time: details.availability || '10 mins ago',
      tag: details.tag || undefined,
      details: {
        parts: details.parts,
        labour: details.labour,
        consumables: details.consumables,
        gst: details.gst,
        availability: details.availability,
        pickupDrop: details.pickup_drop,
        warranty: details.warranty,
        experience: details.experience,
      }
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
