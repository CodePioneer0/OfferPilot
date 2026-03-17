# Architecture Interview Guide (How, Why, and Q&A)

This guide explains how OfferPilot architecture works, why each decision was made, and how to answer architecture-focused interview questions confidently.

## 1) Architecture Goals

The architecture was designed for these goals:

- Clarity: every layer has one clear responsibility.
- Maintainability: easy to add features without rewriting core flows.
- Safety: input validation, auth guardrails, and strict typing.
- Interview readability: reviewers can understand design quickly.

## 2) System Layout

- `apps/api` - backend API service.
- `apps/web` - frontend React application.
- `packages/shared` - shared contracts/types.
- `docs` - architecture and API documentation.

Why this layout:

- Frontend and backend evolve together.
- Shared contracts reduce integration errors.
- Documentation lives near code for easier onboarding.

## 3) Backend Layering and Why

Backend follows:

`Route -> Controller -> Service -> Repository -> Data Store`

### Route Layer

- Defines endpoint + middleware chain.
- Keeps endpoint map easy to scan.

Why:

- Routes should declare "what URL does what" and avoid deep logic.

### Controller Layer

- Parses request params/body.
- Returns HTTP status and response shape.

Why:

- Keeps protocol concerns separate from business rules.

### Service Layer

- Implements business logic and orchestration.
- Enforces domain behavior (ownership checks, summary composition).

Why:

- Prevents business logic from being spread across HTTP files.

### Repository Layer

- Reads/writes persistence model.
- Maps stored entities to API contract shape.

Why:

- Storage can change without touching controllers/services.

### Data Store Layer

- File-backed JSON with transaction-like write helper.

Why:

- No external DB dependency for easy setup.
- Still demonstrates persistence abstraction via repository boundary.

## 4) End-to-End Request Flow

Example: `POST /api/v1/applications`

1. Request enters `applicationRoutes.ts`.
2. `requireAuth` validates bearer token.
3. `validateBody(createApplicationSchema)` validates payload.
4. Controller gets `userId` and body.
5. Service applies domain behavior.
6. Repository writes new entity.
7. Created application DTO returned.

Why this flow is strong:

- Security and validation happen before business logic.
- Errors fail early and consistently.
- Changes in storage are isolated to repository.

## 5) Authentication Design and Why

Current design:

- Register/login returns JWT.
- Protected routes require `Authorization: Bearer <token>`.
- Passwords hashed using bcrypt.

Why this design:

- Stateless auth keeps API horizontally simple.
- Hashed passwords reduce breach impact.
- Middleware-based auth is reusable and centralized.

Tradeoff:

- JWT revocation is non-trivial without refresh token strategy.

## 6) Validation and Error Handling Design

Validation:

- Zod schemas validate request payloads in middleware.

Error handling:

- Domain/HTTP errors normalized to `{ message: string }`.
- Global error middleware keeps response format consistent.

Why this design:

- Validation close to boundary protects internals.
- Standardized error shape simplifies frontend handling.

## 7) Frontend Architecture and Why

Key structure:

- `App.tsx` orchestrates session + dashboard state.
- `api/client.ts` centralizes HTTP and error translation.
- UI split into focused components.

Why this design:

- Better separation of data orchestration and view rendering.
- Easier to test and refactor components independently.

## 8) Shared Contract Strategy and Why

`packages/shared` contains DTO and contract types.

Why:

- One source of truth for API payloads.
- Reduces "frontend expects X, backend returns Y" bugs.

Tradeoff:

- Shared package must be version-aligned across apps.

## 9) Data Model Decisions and Why

Core entities:

- `users`
- `applications`
- `interviewEvents`

Why this model:

- Directly maps to product workflow.
- Supports core dashboard metrics with minimal complexity.

Tradeoff:

- File storage is simple but not ideal for high concurrency.

## 10) Testing Strategy and Why

Current strategy:

- Integration tests on auth + protected flows using Vitest + Supertest.

Why:

- Validates real middleware + routing + service integration.
- Higher confidence than isolated unit tests alone.

Next testing layers (recommended):

- Unit tests for service/repository edge cases.
- Frontend component tests.
- Full browser E2E tests.

## 11) Important Tradeoffs You Should Say in Interviews

- Chose file-backed storage for easy setup and reproducibility.
- Preserved upgrade path by isolating persistence in repositories.
- Chose JWT simplicity now, with refresh-token extension path later.
- Prioritized architecture clarity over adding too many features.

## 12) Scalability Upgrade Path (Explain This Clearly)

If traffic grows:

1. Replace JSON store with PostgreSQL.
2. Add caching for read-heavy summary endpoints.
3. Add background jobs for reminders and async tasks.
4. Add structured logging + metrics + tracing.
5. Introduce refresh token and revocation strategy.

Why this plan works:

- Existing layers already isolate responsibilities.
- Most upgrade work is contained to infrastructure and repository internals.

## 13) Architecture Interview Questions with Strong Answers

Q: Why did you use layered architecture instead of direct route-to-db calls?
A: Layering improves maintainability and testability. It prevents protocol logic, business rules, and storage concerns from mixing in one file.

Q: Where should authorization checks live?
A: Authentication is middleware; ownership and domain authorization checks live in services where business context exists.

Q: How does your architecture reduce regressions?
A: Strict types + shared contracts + validation middleware + integration tests create multiple safety layers.

Q: Why not use a full ORM and PostgreSQL immediately?
A: For this stage, frictionless setup was prioritized. Repository abstraction intentionally keeps SQL migration low-risk and incremental.

Q: How would you handle race conditions in this architecture?
A: Move to transactional database operations, add proper constraints, and use optimistic/pessimistic concurrency controls where needed.

Q: Why is centralized error handling important?
A: It keeps API responses consistent, avoids duplicated try/catch logic, and gives one location to add logging/monitoring.

Q: How does the frontend avoid API-coupling chaos?
A: A centralized typed API client abstracts request details; components consume stable function calls and typed responses.

Q: What is your boundary for business logic?
A: Service layer. Controllers stay HTTP-focused; repositories stay persistence-focused.

Q: If asked "what would you improve first in production," what do you answer?
A: Database upgrade, refresh-token auth model, rate limiting, and observability stack are first production hardening steps.

Q: Why does this architecture help team collaboration?
A: Clear ownership by layer enables parallel work, easier code reviews, and lower merge conflicts.

## 14) 60-Second Architecture Pitch (Memorize This)

OfferPilot is a TypeScript monorepo with a React frontend, Express API, and shared contract package. The backend uses a layered design where routes define endpoints, controllers handle HTTP concerns, services hold business logic, and repositories isolate persistence. Input validation and auth happen in middleware before business logic executes. The frontend uses a centralized API client and component-based UI for maintainability. I chose a lightweight file store for zero-setup reproducibility, while preserving migration readiness by keeping data access abstracted. The result is a clean, testable architecture that is easy to explain, extend, and productionize.
