# Supabase Setup Guide for FitLab

This guide will walk you through setting up Supabase for the FitLab project.

## Why Supabase?

Supabase provides:
- **PostgreSQL Database**: Fully managed, scalable
- **Authentication**: Built-in auth (we're using our custom JWT for now, but can migrate)
- **Storage**: File storage for workout images, progress photos
- **Real-time**: WebSocket support for messaging
- **Free Tier**: Generous free tier for development
- **Dashboard**: Beautiful UI to manage your data

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up with GitHub (recommended) or email
3. Click **"New Project"**
4. Fill in project details:
   - **Organization**: Create new or select existing
   - **Name**: `FitLab` or `fitlab-dev`
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free (perfect for development)

5. Click **"Create new project"**
   - Takes about 2 minutes to provision
   - Get a coffee ☕

## Step 2: Get Your Credentials

Once your project is ready:

### API Keys

1. Go to **Settings** (gear icon in sidebar)
2. Click **API**
3. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...
service_role secret: eyJhbGc...
```

### Database Connection String

1. Go to **Settings > Database**
2. Scroll to **Connection String**
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

It looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## Step 3: Configure Backend

1. Open `backend/.env`
2. Add your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Database URL (replace [YOUR-PASSWORD] with actual password)
DATABASE_URL=postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-generated-secret-here

# Other config...
```

## Step 4: Test Connection

Start your backend:

```bash
cd backend
npm run start:dev
```

You should see:
```
[TypeORM] Database connection established
[NestJS] Nest application successfully started
```

## Step 5: View Your Tables

1. In Supabase dashboard, go to **Table Editor** (table icon in sidebar)
2. You should see your tables automatically created:
   - `users`
   - `coaches`
   - `clients`
   - `workouts`
   - `exercises`
   - `messages`
   - `subscriptions`
   - `automations`

TypeORM auto-syncs your entities in development mode!

## Step 6: Optional - Set Up Storage

For storing workout images and progress photos:

1. Go to **Storage** in Supabase dashboard
2. Click **"New Bucket"**
3. Create buckets:
   - `workout-images` (public)
   - `progress-photos` (private)
   - `exercise-videos` (public)

4. Set up storage policies in Supabase docs

## Redis Setup (Optional for MVP)

For caching and real-time features, use Upstash:

1. Go to [https://upstash.com](https://upstash.com)
2. Create account
3. Create new Redis database
4. Choose **region closest to your Supabase region**
5. Copy the `REDIS_URL`
6. Add to `backend/.env`:

```env
REDIS_URL=redis://default:xxxxx@xxxxx.upstash.io:6379
```

You can skip Redis initially and add it later when implementing:
- Session caching
- Rate limiting
- Real-time messaging queues

## Monitoring & Debugging

### Database Queries

View all SQL queries in **Database > Query Performance**

### Logs

View real-time logs in **Logs** section:
- API logs
- Database logs
- Real-time logs

### SQL Editor

Run custom SQL queries in **SQL Editor**:

```sql
-- View all users
SELECT * FROM users;

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';
```

## Production Checklist

Before going to production:

- [ ] Move from free tier to paid plan
- [ ] Enable connection pooling
- [ ] Set up database backups
- [ ] Configure SSL certificates
- [ ] Enable Row Level Security (RLS)
- [ ] Set up monitoring alerts
- [ ] Create TypeORM migrations (disable synchronize)
- [ ] Set up staging environment

## Troubleshooting

### "Connection refused" error

- Check DATABASE_URL has correct password
- Verify no typos in connection string
- Ensure Supabase project is "Active" (not paused)

### Tables not creating

- Verify `synchronize: true` in TypeORM config
- Check entity imports in modules
- Look for TypeScript errors in entities

### SSL errors

Backend is configured with:
```typescript
ssl: {
  rejectUnauthorized: false,
}
```
This should work with Supabase by default.

### Slow queries

- Use Supabase Query Performance monitor
- Add indexes in SQL Editor
- Optimize TypeORM queries

## Cost Estimates

**Free Tier** (Development):
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth

**Pro Tier** ($25/month) (Production):
- 8GB database
- 100GB file storage
- 100,000 monthly active users
- 50GB bandwidth

## Next Steps

1. ✅ Supabase project created
2. ✅ Backend connected
3. ✅ Tables auto-created
4. 🔄 Test API endpoints
5. 🔄 Connect frontend
6. 🔄 Add Supabase Storage for images

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [TypeORM with Supabase](https://supabase.com/docs/guides/integrations/typeorm)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Upstash Redis](https://docs.upstash.com/redis)

---

**Need Help?**
- Supabase Discord: https://discord.supabase.com
- Supabase GitHub: https://github.com/supabase/supabase
