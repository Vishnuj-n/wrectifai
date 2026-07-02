import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { createApp } from './app';

// Load .env from workspace root — try multiple locations
const rootEnv = path.resolve(process.cwd(), '.env');
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else {
  // Fallback: relative to compiled dist/apps/api/main.js
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
}
// Also try apps/api/.env as fallback
dotenv.config({ path: path.resolve(process.cwd(), 'apps', 'api', '.env') });

const port = Number(process.env.PORT) || 3000;
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'loaded' : 'MISSING'}`);
});
