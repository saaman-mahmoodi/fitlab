# FitLab Backend API

NestJS-based API for the FitLab AI-powered coaching platform.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 10.3 |
| Database | PostgreSQL (Supabase or local Docker) |
| ORM | TypeORM |
| Cache | Redis (Upstash or local Docker) |
| Auth | Passport + JWT + bcrypt |
| Validation | class-validator, class-transformer |
| Real-time | Socket.io (WebSockets) |
| AI | OpenAI SDK, Ollama provider |
| Payments | Stripe SDK |
| Scheduling | @nestjs/schedule |
| Rate Limiting | @nestjs/throttler |

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 16 (local Docker or Supabase)
- Redis 7 (local Docker or Upstash)

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, etc.

# Start development server
npm run start:dev
```

API available at: `http://localhost:3001/api/v1`

Tables auto-create via TypeORM synchronization in development mode.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev mode with hot reload |
| `npm run build` | Production build |
| `npm run start:prod` | Run production build |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with exercises |

## API Endpoints

All endpoints prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | None | Register new user |
| POST | `/auth/login` | None | Login (local strategy) |
| POST | `/auth/refresh` | None | Refresh JWT token |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | JWT | Get current user profile |
| PUT | `/users/me` | JWT | Update profile |
| PUT | `/users/me/password` | JWT | Change password |

### Coaches

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/coaches/me` | Coach | Get coach profile |
| PUT | `/coaches/me` | Coach | Update coach profile |

### Clients

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/clients` | Coach | List clients (paginated, searchable) |
| GET | `/clients/:id` | Coach | Get client by ID |
| POST | `/clients` | Coach | Create client |
| PUT | `/clients/:id` | Coach | Update client |
| DELETE | `/clients/:id` | Coach | Deactivate client |

### Workouts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/workouts` | JWT | List workouts (filterable by clientId) |
| GET | `/workouts/:id` | JWT | Get workout |
| POST | `/workouts` | Coach | Create workout |
| PUT | `/workouts/:id` | Coach | Update workout |
| DELETE | `/workouts/:id` | Coach | Delete workout |
| POST | `/workouts/:id/sets` | Coach | Add set to workout |
| PUT | `/workouts/sets/:setId` | JWT | Update set |
| DELETE | `/workouts/sets/:setId` | Coach | Remove set |

### Exercises

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/exercises` | JWT | List exercises (filterable) |
| GET | `/exercises/:id` | JWT | Get exercise |
| POST | `/exercises` | Coach | Create exercise |
| PUT | `/exercises/:id` | Coach | Update exercise |
| DELETE | `/exercises/:id` | Coach | Delete exercise |

### AI

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai/generate-workout` | Coach | Generate AI workout |
| POST | `/ai/adjust-workout` | Coach | Adjust workout via AI |
| POST | `/ai/progress-summary` | Coach | Generate progress summary |
| POST | `/ai/chat` | JWT | AI chat assistant |

Additional modules (progress, nutrition, messages, notifications, automations, subscriptions, forms, groups) follow similar REST patterns with JWT and role-based guards.

## Project Structure

```
src/
├── app.module.ts              # Root module (registers all modules)
├── main.ts                    # Entry point (CORS, validation, logging)
├── common/
│   ├── decorators/            # @CurrentUser, @Public, @Roles
│   ├── dto/                   # PaginationDto
│   ├── filters/               # AllExceptionsFilter
│   ├── guards/                # JwtAuthGuard, RolesGuard
│   ├── interceptors/          # LoggingInterceptor, TransformInterceptor
│   ├── interfaces/            # UserPayload
│   └── pipes/                 # ParseDatePipe
├── database/
│   └── seeds/                 # Exercise seed data
└── modules/
    ├── ai/                    # OpenAI + Ollama workout generation
    ├── auth/                   # JWT/local strategies, register/login/refresh
    ├── automations/            # Trigger/action workflows
    ├── clients/                # Client CRUD
    ├── coaches/               # Coach profiles
    ├── exercises/              # Exercise library
    ├── forms/                 # Custom intake forms
    ├── groups/                # Training groups
    ├── messages/               # Real-time chat (WebSocket gateway)
    ├── notifications/          # Push & in-app notifications
    ├── nutrition/              # Food logs & meal plans
    ├── progress/               # Weight, measurements, photos
    ├── subscriptions/          # Stripe billing
    ├── users/                  # User accounts & roles
    └── workouts/               # Workout builder with sets
```

## Environment Variables

See `.env.example` for all required variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | No | Redis connection (rate limiting, caching) |
| `JWT_SECRET` | Yes | Secret for JWT token signing |
| `JWT_EXPIRATION` | No | Access token expiry (default: 15m) |
| `JWT_REFRESH_EXPIRATION` | No | Refresh token expiry (default: 7d) |
| `PORT` | No | Server port (default: 3001) |
| `API_PREFIX` | No | API route prefix (default: api/v1) |
| `NODE_ENV` | No | Environment (development/production) |
| `FRONTEND_URL` | No | CORS origin (default: http://localhost:3000) |
| `STRIPE_SECRET_KEY` | No | Stripe API key for billing |
| `OPENAI_API_KEY` | No | OpenAI API key for AI features |

## Database Schema

Tables are auto-created by TypeORM in development. Key entities:

- **users** — User accounts (coach/client roles)
- **coaches** — Coach profiles and business branding
- **clients** — Client metrics, goals, tags, status
- **workouts** / **workout_sets** — Workout plans with nested sets
- **exercises** — Exercise library with categories and equipment
- **progress_photos**, **weight_logs**, **measurements** — Progress tracking
- **messages**, **conversations** — Real-time messaging
- **notifications** — Push and in-app alerts
- **automations** — Workflow triggers and actions
- **subscriptions** — Stripe billing plans
- **forms**, **form_responses** — Custom intake forms
- **training_groups** — Group challenges
- **food_logs**, **meal_plans** — Nutrition tracking

## License

MIT