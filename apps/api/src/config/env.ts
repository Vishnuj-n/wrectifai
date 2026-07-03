export function getEnv() {
  return {
    host: process.env.HOST ?? '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/wrectifai',
    jwtSecret: process.env.JWT_SECRET ?? 'super-secret-jwt-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'super-secret-refresh-key',
    corsOrigins: process.env.WEB_ORIGINS ? process.env.WEB_ORIGINS.split(',') : ['http://localhost:4200', 'http://localhost:3001'],
  };
}
