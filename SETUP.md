# FitLab Development Setup Guide

Complete setup instructions for the FitLab coaching platform.

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **Docker** (for local Postgres and Redis)
- **Git**

## Quick Start

### 1. Start Infrastructure

```bash
docker compose up -d
```

This starts:
- PostgreSQL 16 on port 5432
- Redis 7 on port 6379

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
NODE_ENV=development
PORT=3001
API_PREFIX=api/v1

DATABASE_URL=postgresql://fitlab:fitlab_dev_password@localhost:5432/fitlab_db
REDIS_URL=redis://localhost:6379

JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

FRONTEND_URL=http://localhost:3000
```

For Supabase, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

### 3. Start Backend

```bash
npm run start:dev
```

Backend runs on: `http://localhost:3001/api/v1`

On first run, TypeORM will automatically create all database tables in development mode.

### 4. Setup Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 5. Start Frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Verify Installation

1. **Backend**: Visit `http://localhost:3001/api/v1` — should see the API running
2. **Frontend**: Visit `http://localhost:3000` — should see the landing page
3. **Database**: Check tables were created in your database

## Development Commands

### Backend

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development mode with hot reload |
| `npm run build` | Production build |
| `npm run start:prod` | Run production build |
| `npm run test` | Run unit tests |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with exercise data |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
fitlab/
├── backend/                  # NestJS API server
│   ├── src/
│   │   ├── modules/         # 13 feature modules
│   │   ├── common/          # Guards, interceptors, decorators
│   │   ├── database/seeds/  # Seed scripts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env.example
├── frontend/                 # Next.js web app
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # UI + layout components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # API client, utils, providers
│   │   ├── stores/          # Zustand state stores
│   │   └── types/           # TypeScript types
│   └── public/
├── docker-compose.yml        # Postgres + Redis
└── docs/                    # Setup guides
```

## Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Failed

1. Verify `DATABASE_URL` in `backend/.env` is correct
2. Ensure Docker containers are running: `docker compose ps`
3. Check Postgres is accepting connections: `docker compose logs postgres`

### Module Not Found Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Tables Not Creating

- Verify `NODE_ENV` is not `production` (TypeORM sync is disabled in production)
- Check entity imports in module files
- Look for TypeScript compilation errors in startup logs

## Using Supabase

For production (or managed Postgres), see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for Supabase setup instructions. Replace the `DATABASE_URL` in your `.env` with the Supabase connection string.

## Next Steps

1. Seed the exercise database: `cd backend && npm run seed`
2. Test auth: `POST /api/v1/auth/register` with name, email, password, role
3. Start building dashboard features connected to the API