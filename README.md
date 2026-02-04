# Sourcing Projects Dashboard

A full-stack dashboard for managing sourcing team projects and clients.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Auth**: JWT + Refresh Tokens

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)

## Getting Started

### 1. Start the Database

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432.

### 2. Set Up the Backend

```bash
cd backend
npm install
npm run build

# Run migrations
npm run migrate

# Seed admin user and import Excel data
npm run seed
```

### 3. Start the Backend Server

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:3001`.

### 4. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

## Default Login

- **Email**: admin@example.com
- **Password**: admin123

## Features

### Dashboard Sections

| Section | Description |
|---------|-------------|
| **Overview** | Summary stats, recent projects, quick actions |
| **Analytics** | Charts: by model, by group, by sourcer |
| **Israel Group** | Projects with group_type = Israel |
| **Global Group** | Projects with group_type = Global |
| **All Clients** | Companies list with project counts |
| **Archive** | Archived projects |

### Filter Options

- Sourcer (dropdown)
- Model (Hourly/Success/Executive)
- Client (dropdown)
- Status (Active/Completed/Archived)
- Search (company, sourcer, roles, notes)

### Edit Functionality

- Create/Edit/Delete projects via modal forms
- Inline quick-edit for status changes
- Bulk actions (archive, delete multiple)

## Project Structure

```
sourcing-projects-dashboard/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Login, JWT, refresh tokens
│   │   │   ├── projects/      # CRUD + filtering
│   │   │   ├── analytics/     # Stats and charts data
│   │   │   └── users/         # User management (admin)
│   │   ├── middleware/        # Auth, validation, error handling
│   │   └── db/                # Database migrations and seeds
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Route pages
│   │   ├── components/        # Reusable UI
│   │   ├── stores/            # Zustand state
│   │   ├── api/               # API client
│   │   └── hooks/             # Custom hooks
│   └── package.json
│
└── docker-compose.yml         # PostgreSQL setup
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Current user

### Projects
- `GET /api/projects` - List with filters
- `GET /api/projects/:id` - Get single
- `POST /api/projects` - Create
- `PUT /api/projects/:id` - Update
- `DELETE /api/projects/:id` - Delete
- `POST /api/projects/:id/archive` - Archive
- `POST /api/projects/bulk` - Bulk actions

### Analytics
- `GET /api/analytics/overview` - Summary stats
- `GET /api/analytics/by-model` - Projects by model
- `GET /api/analytics/by-group` - Projects by group
- `GET /api/analytics/by-sourcer` - Projects by sourcer
- `GET /api/analytics/clients` - Client stats
- `GET /api/analytics/export` - Export CSV
