# HireSync

A simple applicant tracking system for managing job candidates and their applications.

## Functionality

- Dashboard with summary metrics pulled from live data.
- Candidates directory with live search and filtering by name, status, and location.
- Add, view, and manage candidate records.
- Applications list with live search and status filtering.
- Application detail view to update an application (job, company, date, source, status, notes) or archive it.

## Tech Stack

- Frontend: React, React Router, TanStack Query, Tailwind CSS, Vite
- Backend: Node.js, Fastify, Zod
- Database: PostgreSQL with Prisma ORM
- Tooling: npm workspaces (monorepo), Docker (for the database)

## Project Structure

```
apps/
  web/    React frontend
  api/    Fastify REST API
packages/
  shared/ Shared types and validation
```

## Prerequisites

- Node.js 18+
- Docker (for the PostgreSQL database)

## Setup

1. Install dependencies from the repo root:

   ```
   npm install
   ```

2. Start the database:

   ```
   docker compose up -d
   ```

3. Create `apps/api/.env` with the database connection string:

   ```
   DATABASE_URL="postgresql://dev:dev@localhost:5433/candidate_tracker"
   ```

4. Apply the schema and seed sample data:

   ```
   npm run db:migrate
   npm run db:seed
   ```

## Running

Start the API and the web app in separate terminals:

```
npm run dev:api    # http://localhost:3001
npm run dev:web    # http://localhost:5173
```

The frontend expects the API at `http://localhost:3001/api`. To override, set `VITE_API_URL` in `apps/web/.env`.

## API Overview

- `GET  /api/dashboard` - summary metrics
- `GET  /api/candidates` - list candidates (search, status, location filters)
- `POST /api/candidates` - create a candidate
- `GET  /api/candidates/:id` - candidate detail
- `GET  /api/applications` - list applications (search, status filters)
- `GET  /api/applications/:id` - application detail
- `PATCH  /api/applications/:id` - update an application
- `DELETE /api/applications/:id` - delete an application
