# Technology Learning Guide (OfferPilot)

This guide teaches every major technology used in the project from beginner-to-intermediate practical level.

How to use this guide:

1. Read one section.
2. Open the referenced files in this repo.
3. Complete the mini tasks.
4. Explain it aloud in your own words.

## Learning Order

1. Node.js and npm workspaces
2. TypeScript fundamentals
3. Express API architecture
4. Validation, auth, and security middleware
5. Data layer and repository pattern
6. React + Vite frontend flow
7. API integration and error handling
8. Testing with Vitest + Supertest

---

## 1) Node.js

### What you should know
Node.js runs JavaScript on the server. It uses an event loop and is excellent for I/O-heavy APIs.

### Where to study in this project
- `apps/api/src/index.ts`
- `apps/api/src/server.ts`

### Practical task
- Start API only with `npm run dev:api`.
- Visit `http://localhost:4000/api/v1/health`.
- Explain what starts first: env load, DB init, server listen.

### Interview-ready explanation
"Node.js lets me use the same language across frontend and backend. For this API, most operations are I/O-driven, so Node is a strong fit."

---

## 2) npm Workspaces (Monorepo)

### What you should know
Workspaces let multiple packages live in one repo and be managed together.

### Where to study
- Root `package.json`
- `apps/api/package.json`
- `apps/web/package.json`
- `packages/shared/package.json`

### Practical task
- Run `npm run typecheck` from repo root.
- Observe it runs for all workspaces.

### Interview-ready explanation
"Workspaces simplified dependency and script management for API, web, and shared contracts in one repository."

---

## 3) TypeScript

### What you should know
TypeScript adds static types to JavaScript, reducing runtime bugs and making refactors safer.

### Where to study
- `tsconfig.base.json`
- `packages/shared/src/types.ts`

### Practical task
- In `packages/shared/src/types.ts`, intentionally rename one field.
- Run `npm run typecheck` and observe compile-time breakages.
- Revert the change.

### Interview-ready explanation
"I used strict TypeScript to catch integration issues early, especially between frontend and backend contracts."

---

## 4) Express.js

### What you should know
Express builds APIs with routes + middleware + handlers.

### Where to study
- `apps/api/src/server.ts`
- `apps/api/src/routes/*.ts`

### Practical task
- Add a temporary `GET /api/v1/ping` route.
- Return `{ "message": "pong" }`.
- Test it with browser/curl.

### Interview-ready explanation
"Express gave me a clean middleware pipeline and enough flexibility to enforce layered architecture."

---

## 5) Controller-Service-Repository Pattern

### What you should know
This separation keeps code maintainable.

- Controller: HTTP concerns.
- Service: business logic.
- Repository: persistence.

### Where to study
- Controllers: `apps/api/src/controllers/*`
- Services: `apps/api/src/services/*`
- Repositories: `apps/api/src/repositories/*`

### Practical task
Trace one endpoint end-to-end:

`POST /api/v1/applications`

Read files in order:

1. `routes/applicationRoutes.ts`
2. `controllers/applicationController.ts`
3. `services/applicationService.ts`
4. `repositories/applicationRepository.ts`

### Interview-ready explanation
"This structure prevents route files from becoming bloated and makes future storage changes safer."

---

## 6) Zod Validation

### What you should know
Zod validates request payloads at runtime. TypeScript alone does not protect runtime user input.

### Where to study
- `apps/api/src/schemas/*.ts`
- `apps/api/src/middleware/validate.ts`

### Practical task
- Send a bad payload (for example missing `company`) to create application.
- Observe `400` response with message.

### Interview-ready explanation
"I validate at the API boundary so invalid data never reaches business logic."

---

## 7) JWT Authentication

### What you should know
JWT is a signed token carrying user identity claims for stateless auth.

### Where to study
- `apps/api/src/utils/token.ts`
- `apps/api/src/middleware/requireAuth.ts`
- `apps/api/src/services/authService.ts`

### Practical task
- Register/login from UI.
- Remove/modify token in browser storage.
- Observe protected routes return `401`.

### Interview-ready explanation
"JWT keeps auth stateless. I verify token in middleware and enforce protected route access consistently."

---

## 8) Password Hashing (`bcryptjs`)

### What you should know
Passwords should never be stored as plaintext. Hashing protects user credentials if storage is leaked.

### Where to study
- `apps/api/src/utils/password.ts`
- `apps/api/src/services/authService.ts`

### Practical task
- Check stored user records in data JSON.
- Verify password is hashed, not plaintext.

### Interview-ready explanation
"I used bcrypt hashing with salt rounds so stored credentials are resilient against direct disclosure."

---

## 9) Environment Configuration (`dotenv` + Zod)

### What you should know
Runtime config belongs in environment variables, not hardcoded values.

### Where to study
- `apps/api/.env.example`
- `apps/api/src/config/env.ts`

### Practical task
- Set an invalid `JWT_SECRET` (too short).
- Start API and observe startup validation failure.
- Restore valid secret.

### Interview-ready explanation
"I fail fast on invalid environment configuration to avoid undefined runtime behavior."

---

## 10) Security/Operational Middleware

### What you should know
- `helmet`: secure headers
- `cors`: origin access control
- `morgan`: request logs

### Where to study
- `apps/api/src/server.ts`

### Practical task
- Change `CLIENT_ORIGIN` to wrong value and see frontend calls fail.
- Fix it and confirm successful calls.

### Interview-ready explanation
"I apply baseline security middleware and strict CORS to control browser-based API access."

---

## 11) MongoDB Data Layer

### What you should know
The project uses MongoDB persistence through repository abstractions to keep domain logic decoupled from storage details.

### Where to study
- `apps/api/src/db/client.ts`
- `apps/api/src/repositories/*.ts`

### Practical task
- Create records from UI.
- Inspect Mongo collections (`users`, `applications`, `interviewEvents`, `counters`).
- Identify how IDs are generated through atomic `$inc` updates.

### Interview-ready explanation
"I used MongoDB for practical production-style persistence, while keeping repository boundaries so future SQL migration remains straightforward."

---

## 12) React Fundamentals

### What you should know
React builds UI with components and state.

### Where to study
- `apps/web/src/App.tsx`
- `apps/web/src/components/*.tsx`

### Practical task
- Track how `selectedApplicationId` changes UI state.
- Add a simple new metric card to Summary UI.

### Interview-ready explanation
"I separated page orchestration in `App.tsx` and moved reusable UI into focused components."

---

## 13) Vite

### What you should know
Vite is a modern dev/build tool for fast React development.

### Where to study
- `apps/web/vite.config.ts`
- `apps/web/package.json`

### Practical task
- Run `npm run dev:web`.
- Edit a UI label and observe instant hot reload.

### Interview-ready explanation
"Vite improved developer feedback speed and produced optimized frontend build artifacts."

---

## 14) API Client Layer (`fetch` wrapper)

### What you should know
Centralizing API calls avoids duplicate networking logic in components.

### Where to study
- `apps/web/src/api/client.ts`

### Practical task
- Add a temporary `console.log` inside request helper.
- Observe every API call passes through one place.

### Interview-ready explanation
"I normalized headers, auth token handling, and error translation in one client module to keep components cleaner."

---

## 15) Shared Contracts Package

### What you should know
A shared package gives one source of truth for request/response types.

### Where to study
- `packages/shared/src/types.ts`

### Practical task
- Add a temporary optional field in a DTO.
- Use it in frontend and backend.
- Run typecheck and verify both sides remain aligned.

### Interview-ready explanation
"Shared DTOs reduced frontend-backend contract drift and made refactoring safer."

---

## 16) Testing: Vitest + Supertest

### What you should know
- Vitest: test framework
- Supertest: HTTP assertions for Express apps

### Where to study
- `apps/api/vitest.config.ts`
- `apps/api/src/tests/api.integration.test.ts`

### Practical task
- Run `npm run test`.
- Add one new test for bad login password returning `401`.

### Interview-ready explanation
"Integration tests validate real middleware-routing-service behavior, not just isolated utility functions."

---

## 17) 7-Day Learning Plan

### Day 1
Node.js, npm workspaces, scripts, project boot flow.

### Day 2
TypeScript strict mode and shared contracts.

### Day 3
Express routing and middleware pipeline.

### Day 4
Auth, JWT, password hashing, env validation.

### Day 5
Data layer, repository pattern, dashboard logic.

### Day 6
React state flow and API client design.

### Day 7
Testing and full walkthrough rehearsal.

---

## 18) Final Self-Check Before Interview

You are ready when you can explain all of this without reading notes:

1. How one request flows from route to response.
2. Why validation is runtime, not just TypeScript.
3. Why passwords are hashed and JWT is verified in middleware.
4. Why shared contracts reduce bugs.
5. What tradeoff the current data store has and how you would upgrade it.

If you can answer these confidently, you will stand out as someone who understands both coding and system design decisions.
