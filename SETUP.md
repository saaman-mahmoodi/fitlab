# FitLab Development Setup Guide

Complete setup instructions for the FitLab coaching platform.

## Project Overview

FitLab is a modern AI-powered coaching platform with:
- **Frontend**: Next.js 14 + Tailwind + ShadCN
- **Backend**: NestJS + Supabase + PostgreSQL
- **Mobile**: React Native + Expo (coming soon)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- **Supabase Account** (free tier available at https://supabase.com)

## Initial Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: FitLab
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)
6. Once ready, go to **Project Settings > API**
7. Copy the following (you'll need these):
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key
8. Go to **Project Settings > Database**
9. Copy the **Connection String** (URI format)

### Step 2: Clone the Repository

```bash
git clone https://github.com/your-username/fitlab.git
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 5: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update:
- Database credentials (use the Supabase connection string)
- Generate a secure JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Add your Stripe and OpenAI API keys (optional for initial development)

### Step 6: Configure Frontend Environment

```bash
cd frontend
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run start:dev
```

Backend will run on: http://localhost:3001

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3000

## Verify Installation

1. **Backend Health Check**:
   - Open http://localhost:3001/api/v1
   - You should see the API running

2. **Frontend**:
   - Open http://localhost:3000
   - You should see the Next.js app

3. **Database**:
   - Verify your connection string is correct by running a test query in the Supabase SQL Editor

## Development Workflow

### Backend Development

- Code is in `backend/src/`
- Hot reload enabled with `npm run start:dev`
- API docs: Add Swagger in future

### Frontend Development

- Code is in `frontend/src/`
- Hot reload enabled with `npm run dev`
- Use Tailwind for styling
- Use ShadCN components

## Common Issues

### Port Already in Use

If ports 3000 or 3001 are in use:

```bash
# Windows - Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Failed

1. Ensure your Supabase connection string is correct
2. Check your database credentials in `backend/.env`
3. Verify your IP isn't blocked (Supabase allows all IPs by default)

### Module Not Found Errors

```bash
# Clear caches and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Test Authentication**: Create a user via API
2. **Build Features**: Start with coach dashboard
3. **Add Components**: Use ShadCN UI components
4. **Integrate AI**: Add OpenAI workout generator

## Useful Commands

### Backend

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Tests
npm run test

# Lint
npm run lint
```

### Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Start production build
npm run start

# Lint
npm run lint
```

## Getting Help

- Check README files in backend/ and frontend/
- Review the main README.md for project overview
- Consult the blueprint in README.md

## Database Management

### View Data

- Use the Supabase SQL Editor to run queries and view data

### Reset Database

- Warning: This will delete all data in your Supabase database
- To reset your database, delete all tables and data in the Supabase SQL Editor
- The database will auto-create tables when you restart the backend in development mode
