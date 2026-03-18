# Technology Interview Guide (OfferPilot)

This document is a deep reference to help you explain every major technology used in this project during interviews.

Use each section to answer:

- What is it?
- Why did you choose it?
- Where is it used in the codebase?
- What tradeoff does it introduce?
- What interview questions can come from it?

## 1) Node.js

### What it is
Node.js is the JavaScript runtime that executes backend code outside the browser.

### Why we used it
- Same language (TypeScript/JavaScript) across frontend and backend.
- Fast iteration for full-stack development.
- Mature ecosystem for API building.

### Where it appears
- API runtime entry point: `apps/api/src/index.ts`
- Scripts in workspace `package.json` files.

### Tradeoff
- Single-threaded event loop means CPU-heavy work should be offloaded to workers or separate services.

### Interview Questions and Answers

Q: Why Node.js for this project instead of Java/Spring or Python/FastAPI?
A: I optimized for full-stack velocity and shared language. For a resume project focused on delivery quality, Node let me build and validate both layers quickly while still following production-grade patterns.

Q: When is Node.js a bad fit?
A: Workloads that are CPU-bound for long durations are not ideal on a single event loop unless we use worker threads or separate compute services.

## 2) TypeScript

### What it is
TypeScript is a typed superset of JavaScript that adds compile-time safety.

### Why we used it
- Prevents many runtime bugs.
- Improves refactor safety.
- Makes contracts explicit between frontend and backend.

### Where it appears
- Strict configs: `tsconfig.base.json`, `apps/api/tsconfig.json`, `apps/web/tsconfig.json`
- Shared type contracts: `packages/shared/src/types.ts`

### Tradeoff
- Slightly more setup and type maintenance overhead.

### Interview Questions and Answers

Q: How did TypeScript reduce bugs here?
A: Shared DTOs in `packages/shared` forced both client and server to agree on payloads and response shapes, reducing API mismatch errors.

Q: What strict settings matter most?
A: `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` are key because they catch subtle undefined/optional mistakes early.

## 3) npm Workspaces (Monorepo)

### What it is
npm workspaces manage multiple packages in one repository.

### Why we used it
- Single repo for frontend, backend, and shared contracts.
- Simple dependency and script orchestration.
- Easier onboarding for reviewers and interviewers.

### Where it appears
- Root `package.json` with `workspaces: ["apps/*", "packages/*"]`.

### Tradeoff
- Build/test pipelines require workspace-aware script design.

### Interview Questions and Answers

Q: Why monorepo for this project?
A: The strongest reason is contract consistency. Shared types become first-class and versioning overhead is reduced compared to separate repos.

Q: What challenge comes with monorepo?
A: Script orchestration and selective CI can get complex as repo size grows.

## 4) Express.js

### What it is
Express is a minimal Node.js web framework for routing and middleware.

### Why we used it
- Clean request pipeline and middleware model.
- Great for demonstrating architecture patterns: route, controller, service, repository.

### Where it appears
- Server composition: `apps/api/src/server.ts`
- Routes: `apps/api/src/routes/*`

### Tradeoff
- Less opinionated than full frameworks, so structure discipline is developer-driven.

### Interview Questions and Answers

Q: Why not put all logic in routes?
A: That creates tightly coupled, hard-to-test code. Splitting into controller/service/repository keeps concerns separated and maintainable.

Q: What does middleware buy you?
A: Reusable cross-cutting behavior like authentication, validation, logging, and centralized error handling.

## 5) Zod

### What it is
Zod is a TypeScript-first schema validation library.

### Why we used it
- Runtime validation for untrusted input.
- Human-readable error messages.
- Works naturally with TypeScript inference.

### Where it appears
- Auth schemas: `apps/api/src/schemas/authSchemas.ts`
- Application schemas: `apps/api/src/schemas/applicationSchemas.ts`
- Validation middleware: `apps/api/src/middleware/validate.ts`

### Tradeoff
- Extra schema maintenance alongside domain types.

### Interview Questions and Answers

Q: Why runtime validation if TypeScript already exists?
A: TypeScript only validates at compile time. External requests still need runtime checks because users can send malformed JSON.

Q: Why validate in middleware?
A: It keeps controllers focused on business flow and ensures invalid requests fail early and consistently.

## 6) JWT (`jsonwebtoken`)

### What it is
JWT is a compact token format for stateless authentication.

### Why we used it
- Simple stateless auth suitable for APIs.
- Easy to include identity claims (`userId`, `email`).

### Where it appears
- Token utilities: `apps/api/src/utils/token.ts`
- Auth middleware: `apps/api/src/middleware/requireAuth.ts`

### Tradeoff
- Harder server-side revocation unless using token versioning/blacklists.

### Interview Questions and Answers

Q: Why stateless JWT auth here?
A: It simplifies scaling API instances because auth state does not live in server memory.

Q: What are JWT risks?
A: Leaked tokens can be replayed until expiry. Mitigations include short expiry, secure storage, HTTPS, and refresh-token strategy.

## 7) `bcryptjs`

### What it is
A password hashing library implementing bcrypt.

### Why we used it
- Passwords must never be stored as plaintext.
- Bcrypt is a standard, adaptive hash for password security.

### Where it appears
- Hash/compare helpers: `apps/api/src/utils/password.ts`

### Tradeoff
- Hashing has computational cost, which is intentional for security.

### Interview Questions and Answers

Q: Why hash passwords?
A: If storage is compromised, hashed passwords are significantly harder to reverse than plaintext.

Q: Why bcrypt and not SHA-256?
A: General hash functions are too fast for password storage. Password hashing should be intentionally slow and salted.

## 8) `dotenv`

### What it is
Loads environment variables from `.env` files.

### Why we used it
- Keeps secrets and runtime config outside code.
- Allows different configs by environment.

### Where it appears
- Environment parsing: `apps/api/src/config/env.ts`

### Tradeoff
- Misconfigured envs can break startup; schema validation is required.

### Interview Questions and Answers

Q: How did you prevent bad env values?
A: I validated environment variables at startup with Zod and exited fast on invalid config.

## 9) Security and Ops Middleware (`helmet`, `cors`, `morgan`)

### What they are
- `helmet`: sets secure HTTP headers.
- `cors`: controls cross-origin requests.
- `morgan`: HTTP request logging.

### Why we used them
- Baseline API hardening.
- Controlled frontend-backend communication.
- Useful logs during debugging and testing.

### Where they appear
- Applied in `apps/api/src/server.ts`

### Tradeoff
- Incorrect CORS settings can block valid clients or allow unsafe origins.

### Interview Questions and Answers

Q: Why is CORS needed?
A: Browsers enforce same-origin policy. CORS explicitly allows the frontend origin to access API resources.

Q: What does helmet protect against?
A: It reduces attack surface by setting defensive headers (for example around MIME sniffing and framing behavior).

## 10) React

### What it is
A component-based UI library.

### Why we used it
- Industry-standard frontend skill signal.
- Clear separation into reusable UI units.
- Strong ecosystem and interview relevance.

### Where it appears
- App orchestration: `apps/web/src/App.tsx`
- UI components: `apps/web/src/components/*`

### Tradeoff
- State coordination can grow complex as app size increases.

### Interview Questions and Answers

Q: Why componentize this UI?
A: It improves readability, reuse, and testability. Forms, tables, and timeline panels are isolated responsibilities.

Q: Why keep API calls in a client module instead of components?
A: It centralizes request behavior and error normalization, reducing duplicate logic in UI layers.

## 11) Vite

### What it is
A modern frontend build tool with fast development server and optimized production build.

### Why we used it
- Fast startup and hot reload.
- Minimal configuration for React + TypeScript.

### Where it appears
- `apps/web/vite.config.ts`
- Frontend scripts in `apps/web/package.json`

### Tradeoff
- Build tooling choices can affect ecosystem compatibility in edge cases.

### Interview Questions and Answers

Q: Why Vite over older bundlers?
A: It has faster dev feedback loops and straightforward production output for a modern React stack.

## 12) Shared Contracts Package (`@offerpilot/shared`)

### What it is
A local package containing shared DTOs, enums, and API types.

### Why we used it
- Eliminates frontend-backend contract drift.
- Creates a strong "typed API" interview story.

### Where it appears
- Definitions: `packages/shared/src/types.ts`
- Imported by API and web packages.

### Tradeoff
- Both apps depend on shared package updates, so coordination is required.

### Interview Questions and Answers

Q: What problem does this package solve?
A: It ensures the same source of truth for payload and response types across the stack.

Q: Is this same as OpenAPI generation?
A: It is a manual contract-sharing approach. OpenAPI adds external schema/document generation and client generation workflows.

## 13) File-Backed JSON Data Store

### What it is
A lightweight custom persistence layer storing entities in a JSON file with transaction-style helper.

### Why we used it
- Zero external database dependency for easy project setup.
- Keeps repo runnable in constrained environments.

### Where it appears
- Store primitives: `apps/api/src/db/client.ts`
- Repositories: `apps/api/src/repositories/*`

### Tradeoff
- Not suitable for high concurrency, heavy writes, or large datasets.

### Interview Questions and Answers

Q: Why not PostgreSQL from day one?
A: For this version, setup simplicity and reviewer reproducibility were prioritized. The architecture is already repository-based, so migration to SQL is straightforward.

Q: What are limitations of this store?
A: Single-process assumptions, lack of advanced query indexing, and no multi-instance write coordination.

## 14) Vitest

### What it is
A modern testing framework integrated well with TypeScript/Vite ecosystems.

### Why we used it
- Fast test execution.
- Simple setup for integration-style backend tests.

### Where it appears
- Config: `apps/api/vitest.config.ts`
- Tests: `apps/api/src/tests/api.integration.test.ts`

### Tradeoff
- Full end-to-end browser testing is outside current scope.

### Interview Questions and Answers

Q: Why integration tests here?
A: They validate full request pipeline behavior (routing, middleware, service, repository) and provide stronger confidence than isolated unit tests alone.

## 15) Supertest

### What it is
A library to test HTTP endpoints directly against Express apps.

### Why we used it
- No network bootstrapping required.
- Clean request/response assertions.

### Where it appears
- API integration tests in `apps/api/src/tests/api.integration.test.ts`

### Tradeoff
- Does not simulate browser-level behavior; complements, not replaces, UI E2E tests.

### Interview Questions and Answers

Q: What does Supertest test in this project?
A: It tests auth flow and protected route behavior by sending real HTTP-like requests to the Express app instance.

## 16) Fetch API + Normalized Error Handling

### What it is
Native browser fetch wrapped in a typed client helper.

### Why we used it
- Avoids adding extra dependency for HTTP client.
- Centralized request setup and error mapping.

### Where it appears
- `apps/web/src/api/client.ts`

### Tradeoff
- Fewer convenience features than libraries like Axios unless you build wrappers.

### Interview Questions and Answers

Q: Why wrap fetch?
A: It standardizes base URL usage, token headers, and API error conversion to a predictable error class.

## 17) Practical "Why this stack" Summary You Can Say in Interviews

I chose a TypeScript-first full-stack setup to maximize correctness and developer speed. Express plus layered backend structure demonstrates production architecture habits. React and Vite provide modern frontend experience. Shared contracts reduce integration bugs. Integration tests and strict type checks provide delivery confidence. I intentionally used a lightweight file store for frictionless setup, while keeping repository abstraction so database migration remains low-risk.

## 18) High-Value Interview Questions You Should Practice

Q: How would you migrate this project to PostgreSQL?
A: Replace repository internals with SQL/ORM queries, keep service/controller contracts unchanged, add migration scripts, and retain API DTOs.

Q: How would you scale auth security further?
A: Add refresh tokens, rotation, token revocation strategy, rate limiting, and secure cookie storage for refresh tokens.

Q: How would you improve observability?
A: Add structured logs, request IDs, metrics, and centralized error monitoring.

Q: What testing would you add next?
A: Service-level unit tests, frontend component tests, and end-to-end flows with Playwright.
