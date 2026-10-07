# HireSync

A simple applicant tracking system for managing job candidates and their applications.

## Functionality

- Dashboard with summary metrics pulled from live data.
- Candidates directory with live search and filtering by name, status, and location.
- Add, view, edit, and delete candidate records.
- Create applications.
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

   With the older standalone Compose binary, use `docker-compose up -d` instead.

   The command returns before Postgres is ready to accept connections (the compose file has no healthcheck), so on a cold start `db:migrate` can fail if run straight away. Wait until this prints `accepting connections`:

   ```
   docker compose exec postgres pg_isready -U dev
   ```

3. Create `apps/api/.env` by copying `apps/api/.env.example` (`.env` is gitignored, so a fresh clone has none). The API will not start without it:

   ```
   DATABASE_URL="postgresql://dev:dev@localhost:5433/candidate_tracker"
   JWT_SECRET="replace-with-a-random-string-of-at-least-32-characters"
   AUTH_EMAIL="you@example.com"
   AUTH_PASSWORD="local-dev-password"
   ```

   - `DATABASE_URL`, `JWT_SECRET` (32+ characters) and `AUTH_EMAIL` are required.
   - Set either `AUTH_PASSWORD_HASH` or `AUTH_PASSWORD`. Use the plaintext `AUTH_PASSWORD` for local development only.
   - Optional: `AUTH_TOKEN_TTL` (seconds, default 28800), `PORT` (default 3001), `HOST` (default 127.0.0.1), `CORS_ORIGINS` (comma-separated).

4. Generate the Prisma client, then apply the schema and seed sample data:

   ```
   npx prisma generate --schema apps/api/prisma/schema.prisma
   npm run db:migrate
   npm run db:seed
   ```

   Skipping `prisma generate` makes the seed fail with `Cannot find module '.prisma/client/default'`.

## Running

Start the API and the web app in separate terminals:

```
npm run dev:api    # http://localhost:3001
npm run dev:web    # http://localhost:5173
```

The frontend expects the API at `http://localhost:3001/api`. To override, set `VITE_API_URL` in `apps/web/.env`.

## API Overview

Every route except `POST /api/auth/login` requires an `Authorization: Bearer <token>` header.

- `POST /api/auth/login` - exchange `email` and `password` for a token (returns `token`, `expires_at`, `user`; repeated failures return 429)
- `GET  /api/auth/me` - return the user for the current token
- `GET  /api/dashboard` - summary metrics
- `GET  /api/candidates` - list candidates (search, status, location filters)
- `POST /api/candidates` - create a candidate
- `GET  /api/candidates/:id` - candidate detail
- `PATCH  /api/candidates/:id` - update a candidate
- `DELETE /api/candidates/:id` - delete a candidate
- `POST /api/applications` - create an application
- `GET  /api/applications` - list applications (search, status filters)
- `GET  /api/applications/:id` - application detail
- `PATCH  /api/applications/:id` - update an application
- `DELETE /api/applications/:id` - delete an application

Deletes are soft deletes: the row stays in the database with `deleted_at` set and is hidden from every endpoint. Deleting an already-deleted record returns 404. Deleting a candidate also hides their applications from the applications list and the dashboard.

## Preview

![HireSync](img/hiresync.jpg)
