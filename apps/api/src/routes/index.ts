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
import { success } from '../utils/response';

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
