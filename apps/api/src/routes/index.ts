import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { usersRouter } from '../modules/users/users.routes';
import { vehiclesRouter } from '../modules/vehicles/vehicles.routes';
import { diagnosisRouter } from '../modules/diagnosis/diagnosis.routes';
import { garagesRouter } from '../modules/garages/garages.routes';
import { quotesRouter } from '../modules/quotes/quotes.routes';
import { bookingsRouter } from '../modules/bookings/bookings.routes';
import { marketplaceRouter } from '../modules/marketplace/marketplace.routes';
import { paymentsRouter } from '../modules/payments/payments.routes';
import { reviewsRouter } from '../modules/reviews/reviews.routes';
import { adminRouter } from '../modules/admin/admin.routes';
import { getHealthStatus } from '../services/health.service';
import { success, error } from '../utils/response';
import { query } from '../config/database';


export const apiRouter = Router();

apiRouter.get('/health', async (_req, res) => {
  const status = await getHealthStatus();
  return success(res, status);
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/vehicles', vehiclesRouter);
apiRouter.use('/diagnosis', diagnosisRouter);
apiRouter.use('/garages', garagesRouter);
apiRouter.use('/quotes', quotesRouter);
apiRouter.use('/bookings', bookingsRouter);
apiRouter.use('/marketplace', marketplaceRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/admin', adminRouter);

apiRouter.get('/promos', async (req, res) => {
  try {
    const result = await query('SELECT * FROM promos ORDER BY relevance DESC');
    const mapped = result.rows.map((p: any) => ({
      id: p.id,
      badge: p.badge,
      badgeColor: p.badge_color,
      icon: p.icon,
      title: p.title,
      bullets: p.bullets || [],
      displayPrice: p.display_price,
      numericPrice: Number(p.numeric_price),
      strikePrice: p.strike_price,
      strikePriceLineThrough: p.strike_price_line_through,
      discountLabel: p.discount_label,
      discountPercent: p.discount_percent,
      validTill: p.valid_till,
      usedCount: p.used_count,
      usedCountValue: p.used_count_value,
      image: p.image,
      imageClassName: p.image_class_name,
      cardTint: p.card_tint,
      bgColor: p.bg_color,
      imageGlow: p.image_glow,
      accent: p.accent,
      categories: p.categories || [],
      isCombo: p.is_combo,
      relevance: p.relevance,
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

