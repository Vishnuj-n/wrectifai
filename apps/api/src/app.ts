import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';
import { getEnv } from './config/env';

export function createApp() {
  const app = express();
  const env = getEnv();

  // CORS configuration
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  );

  // Body parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger middleware
  app.use(requestLogger);

  // Mount API routers under versioned endpoint /api/v1 and fallback /api
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
