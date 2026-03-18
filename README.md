# OfferPilot

OfferPilot is a full-stack job application intelligence platform designed to demonstrate production-ready engineering fundamentals in a resume project.

It helps candidates track roles, pipeline stages, and interview activity while surfacing actionable dashboard metrics.

## Why This Project Stands Out

- Full-stack architecture with clear separation of concerns and typed contracts.
- Strict TypeScript in backend and frontend for safer refactors.
- Authentication, authorization, validation, and error-handling patterns used in real products.
- Integration tests, type checks, and build verification included.
- Professional documentation for onboarding and interview walkthroughs.

## Core Features

- User registration and login with JWT-based authentication.
- Create, view, update, and delete job applications.
- Track pipeline stage progression for each application.
- Log interview events and follow-up activities.
- Dashboard analytics: totals, pipeline health, offers, rejections, and stage distribution.

## Tech Stack

- Frontend: React, TypeScript, Vite, custom responsive CSS.
- Backend: Node.js, Express, TypeScript, Zod, JWT, bcrypt.
- Data layer: file-backed JSON store with transactional write helper.
- Testing: Vitest + Supertest integration tests.
- Monorepo: npm workspaces (`apps/*`, `packages/*`).

## Repository Structure

```text
apps/
  api/            Express API service
  web/            React frontend
packages/
  shared/         Shared types and API contracts
docs/
  ARCHITECTURE.md
  API_REFERENCE.md
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

If PowerShell blocks `npm.ps1`, run the same commands with `npm.cmd`.

2. Configure API environment:

```bash
cp apps/api/.env.example apps/api/.env
```

PowerShell alternative:

```powershell
Copy-Item apps\api\.env.example apps\api\.env
```

3. Run backend and frontend:

```bash
npm run dev
```

4. Open the app:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/v1/health`

## Scripts

- `npm run dev` - run API and web app together.
- `npm run dev:api` - run API only.
- `npm run dev:web` - run web app only.
- `npm run typecheck` - strict type checks for all workspaces.
- `npm run test` - API integration tests.
- `npm run build` - production build for all workspaces.

## Quality Gates

The project was validated with:

- `npm run typecheck` (passed)
- `npm run test` (passed)
- `npm run build` (passed)

## Resume Talking Points

- Built a production-style full-stack platform with typed end-to-end contracts.
- Implemented secure auth with JWT and hashed passwords.
- Designed a modular backend using controller/service/repository layers.
- Created a responsive dashboard UI with analytics and workflow support.
- Added integration tests and CI-friendly quality scripts.

## Documentation

- Architecture details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- API reference: [docs/API_REFERENCE.md](./docs/API_REFERENCE.md)

## Future Enhancements

- Role-based collaboration for mentors or recruiters.
- Notification engine for follow-up reminders.
- Exportable reports for weekly job-search review.
- PostgreSQL + migration tooling for multi-user deployment.
