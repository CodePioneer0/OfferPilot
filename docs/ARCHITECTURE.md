# Architecture Overview

## High-Level Design

OfferPilot follows a layered monorepo architecture.

- `apps/api`: HTTP API with strict input validation and auth middleware.
- `apps/web`: React client with typed API integration.
- `packages/shared`: shared TypeScript contracts used by both layers.

The backend applies `route -> controller -> service -> repository` flow.

## Backend Layer Responsibilities

- Routes: endpoint definitions and middleware composition.
- Controllers: HTTP-level concerns (status code, params extraction).
- Services: business logic and orchestration.
- Repositories: data persistence and mapping.
- Middleware: auth guard, request validation, not-found and error handling.

## Data Model

The API persists to MongoDB (`MONGO_URI`, `MONGO_DB_NAME`) with three core collections.

- `users`
  - `id`, `name`, `email`, `passwordHash`, `createdAt`
- `applications`
  - `id`, `userId`, `company`, `role`, `stage`, salary range, notes, timestamps
- `interviewEvents`
  - `id`, `userId`, `applicationId`, `type`, `description`, `occurredOn`, `createdAt`

Counters are maintained in a dedicated `counters` collection for deterministic numeric ID generation.

## Request Lifecycle

1. Request enters route.
2. Validation middleware (`zod`) enforces schema.
3. Auth middleware validates JWT for protected routes.
4. Controller extracts request values and calls service.
5. Service applies business rules and uses repository.
6. Repository reads/writes MongoDB collections and returns mapped DTO.
7. Error middleware normalizes failures into JSON responses.

## Security and Reliability Notes

- Passwords are hashed using `bcryptjs`.
- JWTs include user ID and email claim, with expiration policy.
- Protected routes require `Bearer` token.
- Shared DTOs reduce contract drift between frontend and backend.
- Typecheck/test/build scripts are included for CI readiness.

## Frontend Composition

- `App.tsx`: session lifecycle and dashboard orchestration.
- `api/client.ts`: normalized HTTP client and error abstraction.
- Components:
  - `AuthCard`
  - `SummaryGrid`
  - `ApplicationForm`
  - `ApplicationTable`
  - `EventPanel`

The UI is responsive and optimized for both desktop and mobile viewports.
