# Supabase Setup Guide for FitLab

This guide covers setting up Supabase as the managed PostgreSQL database for FitLab.

## Why Supabase?

- **PostgreSQL Database**: Fully managed, scalable, with real-time support
- **Connection Pooling**: Built-in PgBouncer for serverless connections
- **Storage**: File storage for workout images and progress photos
- **Free Tier**: 500MB database, 1GB storage — enough for development
- **Dashboard**: Visual table editor, SQL editor, logs

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up (GitHub login recommended)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `FitLab` or `fitlab-dev`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Plan**: Free (generous for development)
4. Wait ~2 minutes for provisioning

## Step 2: Get Your Credentials

### API Keys

1. Go to **Settings > API**
2. Copy:
   - `Project URL` (e.g., `https://xxxxx.supabase.co`)
   - `anon public` key
   - `service_role secret` key

### Database Connection String

1. Go to **Settings > Database**
2. Scroll to **Connection String**
3. Select **URI** tab
4. Copy and replace `[YOUR-PASSWORD]` with your database password:

```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

> Use the **pooler** connection string (port 6543) for the backend, as it supports connection pooling.

## Step 3: Configure Backend

Edit `backend/.env`:

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Database (use pooler connection string)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# JWT (generate your own)
JWT_SECRET=<generate-with-openssl-rand-base64-32>

# Redis (local Docker or Upstash)
REDIS_URL=redis://localhost:6379
```

## Step 4: Verify Connection

Start the backend:

```bash
cd backend
npm run start:dev
```

You should see:
```
[Nest] LOG [TypeOrmModule] Database connection established
[Nest] LOG [Bootstrap] FitLab API running on: http://localhost:3001/api/v1
```

## Step 5: Verify Tables

1. In Supabase dashboard, go to **Table Editor**
2. You should see tables auto-created by TypeORM:
   - `users`, `coaches`, `clients`
   - `workouts`, `workout_sets`, `exercises`
   - `messages`, `conversations`
   - `progress_photos`, `weight_logs`, `measurements`
   - `food_logs`, `meal_plans`
   - `notifications`, `automations`, `subscriptions`
   - `forms`, `form_responses`
   - `training_groups`

> TypeORM `synchronize: true` is enabled in development. This auto-creates and updates tables. For production, use migrations instead.

## Step 6: Set Up Storage (Optional)

For workout images and progress photos:

1. Go to **Storage** in the Supabase dashboard
2. Create buckets:
   - `workout-images` (public)
   - `progress-photos` (private)
   - `exercise-videos` (public)
3. Configure storage policies as needed

## Redis Setup (Optional for MVP)

For caching and real-time features, use Upstash:

1. Go to [https://upstash.com](https://upstash.com)
2. Create a Redis database (choose the same region as your Supabase project)
3. Copy the connection URL
4. Add to `backend/.env`:

```env
REDIS_URL=redis://default:xxxxx@xxxxx.upstash.io:6379
```

Redis is optional during development. The app will work without it, but some features (rate limiting, caching) will use in-memory fallbacks.

## Production Checklist

Before deploying to production:

- [ ] Switch from free to Pro plan (8GB database minimum)
- [ ] Enable connection pooling (PgBouncer)
- [ ] Set up database backups
- [ ] Enable Row Level Security (RLS)
- [ ] Set `NODE_ENV=production` (disables TypeORM sync)
- [ ] Create TypeORM migrations: `npm run typeorm migration:generate -- -n InitSchema`
- [ ] Run migrations: `npm run typeorm migration:run`
- [ ] Set strong `JWT_SECRET`
- [ ] Configure CORS origins
- [ ] Set up monitoring and alerts

## Troubleshooting

### Connection Refused

- Verify `DATABASE_URL` has the correct password (special characters must be URL-encoded)
- Ensure the Supabase project status is "Active" (not paused)
- Try the direct connection string (port 5432) for debugging

### Tables Not Creating

- Confirm `NODE_ENV` is `development` (or not set)
- Check TypeORM entity imports in `app.module.ts`
- Look for TypeScript errors in startup logs

### SSL Errors

The backend configures SSL automatically:
```typescript
ssl: configService.get('NODE_ENV') === 'production'
  ? { rejectUnauthorized: false }
  : false
```

For Supabase, SSL is handled by the connection string.

### Slow Queries

- Use Supabase **Query Performance** monitor
- Add indexes via SQL Editor for frequently queried columns
- Use Supabase **Explain** feature to analyze query plans

## Cost Estimates

| Plan | Database | Storage | Monthly Active Users | Price |
|------|----------|---------|----------------------|-------|
| Free | 500MB | 1GB | 50,000 | $0 |
| Pro | 8GB | 100GB | 100,000 | $25/mo |

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [TypeORM with Supabase](https://supabase.com/docs/guides/integrations/typeorm)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Upstash Redis](https://docs.upstash.com/redis)