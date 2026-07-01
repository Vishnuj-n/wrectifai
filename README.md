# Wrectifai

Full-stack monorepo with a Next.js frontend, React Native (Expo) mobile app, and an Express.js + PostgreSQL API.

## Stack

- **apps/web** — Next.js frontend
- **apps/mobile** — React Native (Expo) mobile app
- **apps/api** — Express.js backend with PostgreSQL (via `pg`)

Database tables are auto-created on API startup (~20 tables: users, profiles, garages, vehicles, quotes, bookings, payments, etc.). Sample seed data is also available.

## Local Development Setup

### Prerequisites

- **Node.js 22.x**
- **pnpm** (install: `npm install -g pnpm`)
- **PostgreSQL** (running instance)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

At minimum, set a valid `DATABASE_URL` pointing to your PostgreSQL instance.

### 3. Start the database

The API auto-creates all required tables on startup. Make sure PostgreSQL is running and `DATABASE_URL` is correct.

### 4. Start development servers

```bash
# Start API (port 3000) and Web (port 4200) in parallel
pnpm serve:all

# Or run individually:
pnpm api    # nx serve api
pnpm web    # nx dev web
pnpm mobile # nx start mobile
```

The API will bootstrap the database tables on first launch.

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm serve:all` | Start API and Web in parallel |
| `pnpm api` | Start API server (port 3000) |
| `pnpm web` | Start Web dev server (port 4200) |
| `pnpm mobile` | Start Expo mobile dev server |
| `pnpm build:all` | Build API and Web for production |
| `pnpm serve:prod` | Run both API and Web in production mode |
| `pnpm lint` | Lint all projects |

## Production Deployment

### Build and Serve

```bash
pnpm build:all
pnpm serve:prod
```

- Builds API to `dist/apps/api/main.js`
- Builds Web to `apps/web/.next`
- API runs on port 3000 (or `PORT` env var)
- Web runs on port 3001 internally

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string |
| `WEB_ORIGINS` | Yes | Comma-separated allowed origins for CORS |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | API base URL used by web app |
| `COOKIE_SAME_SITE` | Yes | `lax` for same-site, `none` for cross-site |
| `COOKIE_DOMAIN` | No | Shared cookie domain (e.g., `.yourdomain.com`) |
| `HOST` | No | Server host (defaults to `0.0.0.0`) |
| `PORT` | No | API port (defaults to `3000`) |

**Notes:**
- `COOKIE_SAME_SITE=none` requires HTTPS and secure cookies.
- CORS supports an explicit allowlist via `WEB_ORIGINS`.

### Render Deployment

1. Connect the repository to Render
2. Set the environment variables listed above
3. Build command: `pnpm build:all`
4. Start command: `pnpm serve:prod`
5. API will be accessible on the configured port (default: 3000)
6. Web app runs on port 3001 internally

### Vercel Deployment

- Create one Vercel project for `apps/web` (Root Directory = `apps/web`)
- Create one Vercel project for `apps/api` (Root Directory = `apps/api`)
- API project uses serverless catch-all handler at `apps/api/api/[...path].ts`

Set the same environment variables in Vercel as listed above.

## Tech Stack Details

| Category | Technology |
| --- | --- |
| Monorepo | Nx + pnpm workspaces |
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Mobile | React Native 0.76, Expo 52, NativeWind |
| Backend | Express.js, PostgreSQL (`pg`) |
| UI | Radix UI, Lucide icons, shadcn/ui patterns |
| Build | esbuild, SWC |
| Tooling | TypeScript, ESLint, Prettier |
