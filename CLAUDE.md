# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

**Full Stack (from root):**
```bash
npm run install:all    # Install both backend and frontend dependencies
npm run dev            # Run backend and frontend concurrently
npm run build          # Build frontend then backend
```

**Backend (from /backend):**
```bash
npm run dev            # Hot reload dev server (tsx watch)
npm run build          # TypeScript compile + copy migrations/seeds
npm run migrate        # Run Knex migrations
npm run migrate:rollback  # Rollback last migration
npm run seed           # Seed database (admin user + Excel data import)
```

**Frontend (from /frontend):**
```bash
npm run dev            # Vite dev server (localhost:5173)
npm run build          # TypeScript check + Vite production build
npm run preview        # Preview production build
```

**Database:**
```bash
docker-compose up -d   # Start PostgreSQL on port 5432
```

## Architecture

This is a **full-stack monorepo** with two deployment modes:

1. **Full-stack mode**: Backend (Express + PostgreSQL) serves API and static frontend in production
2. **Static mode**: Frontend-only deployment to GitHub Pages using localStorage (no backend)

### Static Mode (GitHub Pages)

The frontend can run standalone using `frontend/src/lib/storage.ts` which:
- Embeds all 23 projects as initial data
- Persists to localStorage under key `sourcing_dashboard_data`
- Provides CRUD operations and analytics without backend

Deployed at: `https://danamove.github.io/sourcing-dashboard/`

### Full-stack Mode

**Backend modules** follow controller-service-routes-schema pattern:
- `/backend/src/modules/auth/` - JWT + refresh tokens, bcrypt password hashing
- `/backend/src/modules/projects/` - CRUD with Zod validation
- `/backend/src/modules/analytics/` - Dashboard stats and charts data
- `/backend/src/modules/users/` - Admin user management

**Key middleware:**
- `authenticate` - JWT token verification
- `authorize` - Role-based access (admin/manager/user)
- `validate` - Zod schema validation

**Database (PostgreSQL via Knex):**
- `users` - Dashboard accounts with roles
- `projects` - All project data
- `audit_logs` - JSONB logging of all project changes

### Frontend

Uses **HashRouter** for GitHub Pages compatibility.

**Routes:**
- `/` - Overview (stats cards, recent projects)
- `/analytics` - Charts (by model, group, sourcer)
- `/israel` and `/global` - Group-filtered views
- `/clients` - Company list with project counts
- `/lack-of-hours` - Hourly projects below threshold
- `/archive` - Archived projects

**State:** Zustand store for auth with localStorage persistence.

## Data Types

```typescript
type GroupType = 'Israel' | 'Global';
type ModelType = 'Hourly' | 'Success' | 'Success Executive';
type ProjectStatus = 'active' | 'completed' | 'archived';
type UserRole = 'admin' | 'manager' | 'user';
```

## Default Credentials

- Email: `admin@example.com`
- Password: `admin123`

## Deployment

**GitHub Pages (static):** Push to master triggers `.github/workflows/deploy.yml`

**Railway (full-stack):** Configured via `railway.json` and `nixpacks.toml`
