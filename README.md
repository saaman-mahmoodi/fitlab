# FitLab

> AI-powered coaching platform for fitness professionals.

## Tech Stack

**Backend**
- NestJS 10.3 + TypeScript
- PostgreSQL via Supabase (TypeORM)
- Redis (Upstash)
- Passport JWT authentication
- Stripe (payments), OpenAI + Ollama (AI services)
- WebSocket messaging (Socket.io)

**Frontend**
- Next.js 15 + React 19
- Tailwind CSS 4 + ShadCN UI
- Zustand (state), TanStack Query (server state)
- Socket.io client (real-time)

**Infrastructure**
- Docker Compose (Postgres 16, Redis 7)
- Supabase (managed Postgres, auth, storage)

## Project Structure

```
fitlab/
├── backend/                   # NestJS API
│   └── src/
│       ├── app.module.ts      # Root module
│       ├── main.ts            # Entry point (port 3001)
│       ├── common/            # Shared guards, interceptors, decorators, filters
│       ├── database/seeds/    # Seed scripts (exercises)
│       └── modules/
│           ├── ai/            # AI workout generation (OpenAI, Ollama)
│           ├── auth/          # JWT + local auth, register/login/refresh
│           ├── automations/   # Trigger/action workflow engine
│           ├── clients/       # Client management (CRUD)
│           ├── coaches/       # Coach profiles & branding
│           ├── exercises/     # Exercise library
│           ├── forms/        # Custom intake forms & assessments
│           ├── groups/       # Training groups & challenges
│           ├── messages/     # Real-time messaging (WebSocket gateway)
│           ├── notifications/# Push & in-app notifications
│           ├── nutrition/     # Food logs & meal plans
│           ├── progress/     # Weight logs, measurements, progress photos
│           ├── subscriptions/# Stripe billing & subscriptions
│           ├── users/        # User accounts (coach/client roles)
│           └── workouts/     # Workout builder with sets/reps/RIR
├── frontend/                  # Next.js app
│   └── src/
│       ├── app/
│       │   ├── page.tsx       # Landing page
│       │   ├── login/         # Login page
│       │   ├── signup/        # Signup page (role selection)
│       │   └── (coach)/       # Coach dashboard routes
│       │       ├── layout.tsx # Dashboard layout with sidebar
│       │       └── dashboard/
│       │           ├── page.tsx          # Overview
│       │           ├── ai/              # AI workout generator
│       │           ├── clients/         # Client management
│       │           ├── exercises/       # Exercise library
│       │           ├── messages/        # Real-time chat
│       │           ├── progress/        # Progress tracking
│       │           ├── settings/         # Coach settings
│       │           └── workouts/        # Workout builder
│       ├── components/
│       │   ├── layout/        # Sidebar component
│       │   ├── notifications/ # Notification bell
│       │   └── ui/           # 16 ShadCN components
│       ├── hooks/             # useSocket (WebSocket)
│       ├── lib/
│       │   ├── api/          # API client (auth, AI, messages, notifications, resources)
│       │   ├── auth-guard.tsx # Route protection
│       │   ├── providers/    # App providers
│       │   └── utils.ts      # Utility functions
│       ├── stores/            # Zustand (auth, notifications)
│       └── types/             # TypeScript type definitions
├── docker-compose.yml         # Postgres 16 + Redis 7
├── .gitignore
├── SETUP.md                   # Detailed setup instructions
├── SUPABASE_SETUP.md          # Supabase configuration guide
└── PROGRESS.md                # Development progress tracker
```

## API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login (local strategy) |
| POST | `/auth/refresh` | Refresh JWT token |

### Users (`/api/v1/users`) — Authenticated
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update profile |
| PUT | `/users/me/password` | Change password |

### Coaches (`/api/v1/coaches`) — Coach role required
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/coaches/me` | Get coach profile |
| PUT | `/coaches/me` | Update coach profile |

### Clients (`/api/v1/clients`) — Coach role required
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | List clients (paginated) |
| GET | `/clients/:id` | Get client by ID |
| POST | `/clients` | Create client |
| PUT | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Deactivate client |

### Workouts (`/api/v1/workouts`) — Authenticated
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workouts` | List workouts (by coach, filterable by clientId) |
| GET | `/workouts/:id` | Get workout |
| POST | `/workouts` | Create workout (coach) |
| PUT | `/workouts/:id` | Update workout (coach) |
| DELETE | `/workouts/:id` | Delete workout (coach) |
| POST | `/workouts/:id/sets` | Add set to workout (coach) |
| PUT | `/workouts/sets/:setId` | Update set (coach/client) |
| DELETE | `/workouts/sets/:setId` | Remove set (coach) |

### Exercises (`/api/v1/exercises`) — Authenticated
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exercises` | List exercises (filterable by category, equipment) |
| GET | `/exercises/:id` | Get exercise |
| POST | `/exercises` | Create exercise (coach) |
| PUT | `/exercises/:id` | Update exercise (coach) |
| DELETE | `/exercises/:id` | Delete exercise (coach) |

### AI (`/api/v1/ai`) — Authenticated
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/generate-workout` | Generate AI workout (coach) |
| POST | `/ai/adjust-workout` | Adjust workout via AI (coach) |
| POST | `/ai/progress-summary` | Generate progress summary (coach) |
| POST | `/ai/chat` | AI chat assistant |

Additional modules (messages, notifications, progress, nutrition, automations, subscriptions, forms, groups) follow similar REST patterns with appropriate role guards.

## Getting Started

```bash
# 1. Start infrastructure
docker compose up -d

# 2. Install backend dependencies
cd backend && npm install

# 3. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your DATABASE_URL, JWT_SECRET, etc.

# 4. Start backend
npm run start:dev

# 5. Install frontend dependencies and start
cd ../frontend && npm install
npm run dev
```

See [SETUP.md](./SETUP.md) for detailed instructions and [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for Supabase configuration.

## Brand

- **Primary**: Deep Blue (#0A3AFF) — performance, trust
- **Secondary**: Neon Lime (#A6FF3F) — energy
- **Neutral**: Charcoal (#111111), Gray (#F5F5F5)
- **Typography**: Inter

## License

MIT