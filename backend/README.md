# FitLab Backend API

AI-powered fitness coaching platform backend built with NestJS.

## Tech Stack

- **Framework**: NestJS 10.3
- **Database**: PostgreSQL (Supabase)
- **ORM**: TypeORM
- **Cache**: Redis (Upstash or Redis Cloud)
- **Authentication**: Passport + JWT
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **AI**: OpenAI GPT-4
- **Real-time**: WebSockets (Socket.io)
- **Payments**: Stripe

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16
- Redis 7
- Docker and Docker Compose (recommended)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Add your Supabase DATABASE_URL and credentials
```

### 4. Run development server

```bash
npm run start:dev
```

### 5. Access the API

API will be available at: `http://localhost:3001/api/v1`

The database tables will be automatically created via TypeORM synchronization in development mode.

## Development Scripts

```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run linter
npm run lint
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users

- `GET /api/v1/users/me` - Get current user profile

## Database Schema

See entity files in `src/modules/*/entities/` for complete schema.

### Main Entities

- **Users**: User accounts (coaches and clients)
- **Coaches**: Coach profiles and settings
- **Clients**: Client profiles and metrics
- **Workouts**: Workout plans and schedules
- **Exercises**: Exercise library
- **Messages**: Real-time messaging
- **Automations**: Workflow automations
- **Subscriptions**: Coach subscription plans

## Environment Variables

See `.env.example` for all required environment variables.

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT secret key
- `STRIPE_SECRET_KEY`: Stripe API key
- `OPENAI_API_KEY`: OpenAI API key

## Project Structure

```
backend/
├── src/
│   ├── modules/          # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── users/        # User management
│   │   ├── coaches/      # Coach features
│   │   ├── clients/      # Client management
│   │   ├── workouts/     # Workout builder
│   │   ├── exercises/    # Exercise library
│   │   ├── messages/     # Messaging
│   │   ├── automations/  # Workflow automation
│   │   ├── subscriptions/# Billing
│   │   └── ai/          # AI services
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry
├── test/                 # Test files
├── docker-compose.yml    # Docker services
└── package.json
```

## License

MIT
