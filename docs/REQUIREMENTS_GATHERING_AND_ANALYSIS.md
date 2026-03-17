# Requirements Gathering and Analysis

Project: OfferPilot (Job Application Intelligence Platform)
Document Version: 1.0
Date: 2026-03-17
Status: Draft for implementation and interview reference

## 1. Purpose

This document captures requirements gathered for OfferPilot and analyzes the product and technical decisions needed to build a reliable MVP and plan future iterations.

## 2. Problem Statement

Job seekers often track applications manually across notes, spreadsheets, and emails. This leads to inconsistent records, missed follow-ups, and poor visibility into pipeline health.

OfferPilot solves this by centralizing applications, interview events, and summary metrics in a single full-stack platform.

## 3. Product Vision

Enable a candidate to manage their job search as a measurable pipeline, similar to a sales funnel, with clean workflow tracking and actionable analytics.

## 4. Stakeholders

- Primary User: Individual job seeker
- Secondary User (future): Mentor/career coach
- Engineering Team: Full-stack developer(s)
- Reviewer/Interviewer: Evaluates architecture and code quality

## 5. Scope Definition

### 5.1 In Scope (MVP)

- User registration and login
- Secure authenticated session via JWT
- Create, list, update, delete job applications
- Track application stage progression
- Add and view interview events per application
- Dashboard summary metrics
- Input validation and normalized API error responses
- Basic automated integration tests

### 5.2 Out of Scope (Current)

- Multi-tenant enterprise access controls
- Team collaboration and shared workspaces
- Email/SMS reminders
- Calendar integrations
- File uploads
- AI recommendation engine

## 6. User Personas and Goals

### Persona A: Active Job Seeker

Goals:
- Track all applications in one place
- Know current stage for each role
- Avoid missing interview follow-ups
- Measure pipeline outcomes

Pain Points:
- Information scattered across tools
- No single source of truth
- Hard to assess progress objectively

## 7. Functional Requirements

FR-001 User Registration
- System shall allow new user registration with name, email, and password.
- System shall reject duplicate email registration.

FR-002 User Login
- System shall authenticate registered users.
- System shall return a signed JWT token on successful login.

FR-003 Auth Protection
- System shall protect application and dashboard routes using bearer token authentication.

FR-004 Create Application
- System shall allow authenticated users to create an application record with company, role, stage, and applied date.

FR-005 List Applications
- System shall return all application records for the authenticated user, sorted by date.

FR-006 Update Application
- System shall allow authenticated users to update one or more application fields.

FR-007 Delete Application
- System shall allow authenticated users to delete an application.
- System shall remove associated interview events for that application.

FR-008 Create Interview Event
- System shall allow authenticated users to add interview-related events for a chosen application.

FR-009 List Interview Events
- System shall return interview events for a chosen application, sorted by recent date.

FR-010 Dashboard Summary
- System shall provide aggregate metrics:
  - total applications
  - active pipeline count
  - offers count
  - rejections count
  - interviews in current month
  - stage breakdown

FR-011 Input Validation
- System shall validate request payloads and reject invalid input with clear error messages.

FR-012 Error Handling
- System shall return normalized JSON error structure for failures.

## 8. Non-Functional Requirements

NFR-001 Security
- Passwords must be hashed before storage.
- Protected endpoints must require valid JWT.
- API must apply basic security headers.

NFR-002 Reliability
- API should return deterministic responses for valid requests.
- Error responses should be stable and machine-readable.

NFR-003 Performance
- Typical dashboard and list operations should complete within acceptable interactive latency for local/small datasets.

NFR-004 Maintainability
- Codebase must follow layered architecture with clear responsibilities.
- Shared types must prevent contract drift.

NFR-005 Usability
- UI should be responsive on desktop and mobile widths.
- Primary workflows should be discoverable without onboarding.

NFR-006 Testability
- Core API flows must be covered by integration tests.
- Strict TypeScript checks must pass for all workspaces.

## 9. Data Requirements

Entity: User
- id, name, email, passwordHash, createdAt

Entity: Application
- id, userId, company, role, location, jobUrl, stage, salaryMin, salaryMax, appliedOn, notes, createdAt, updatedAt

Entity: InterviewEvent
- id, userId, applicationId, type, description, occurredOn, createdAt

Data Rules:
- Email uniqueness per user account
- Application ownership isolation by userId
- Event ownership and application relationship enforcement

## 10. Assumptions

- Single user context per account session
- Initial deployment targets local/self-hosted setup
- Current persistence is file-backed and suitable for MVP scale
- Internet connectivity is not required for core local app usage

## 11. Constraints

- No external database dependency in current version
- Stateless JWT auth without refresh-token lifecycle in MVP
- No background worker architecture in current scope

## 12. Dependency Analysis

Technical Dependencies:
- Node.js runtime
- npm workspace ecosystem
- Express, React, TypeScript, Zod, JWT, bcryptjs, Vitest/Supertest

Operational Dependencies:
- Environment variable configuration
- Correct frontend/backend origin alignment for CORS

## 13. Use Case Analysis

UC-01 Register and Login
- Actor: Job seeker
- Precondition: User not logged in
- Main Flow: Register -> receive token -> access dashboard
- Success Outcome: Authenticated session created

UC-02 Manage Application Pipeline
- Actor: Authenticated user
- Main Flow: Add application -> update stage -> delete outdated entries
- Success Outcome: Up-to-date pipeline records

UC-03 Track Interview Progress
- Actor: Authenticated user
- Main Flow: Select application -> add interview event -> review timeline
- Success Outcome: Complete interview history for each role

UC-04 Review Dashboard Metrics
- Actor: Authenticated user
- Main Flow: Open dashboard -> review aggregate metrics
- Success Outcome: Better decision-making and prioritization

## 14. Acceptance Criteria

AC-001 Registration returns `201` with token and user payload.
AC-002 Login returns `200` with token and user payload.
AC-003 Protected route without token returns `401`.
AC-004 Valid application create returns `201` and stored object.
AC-005 Application list returns user-owned records only.
AC-006 Dashboard summary returns all required metric fields.
AC-007 Invalid request body returns `400` with message.
AC-008 Build, typecheck, and tests pass in local environment.

## 15. Prioritization (MoSCoW)

Must Have:
- Authentication
- Application CRUD
- Interview event tracking
- Dashboard summary
- Validation and error handling

Should Have:
- Better filtering/sorting in UI
- More integration test cases

Could Have:
- Reminder/notification system
- Data export (CSV/PDF)

Won't Have (Current MVP):
- Full enterprise RBAC
- Real-time collaborative workflows

## 16. Risk Analysis

Risk R-001: File-backed storage scaling limits
- Impact: Medium
- Likelihood: Medium
- Mitigation: Keep repository abstraction and migrate to PostgreSQL in next phase.

Risk R-002: Token handling security mistakes
- Impact: High
- Likelihood: Low-Medium
- Mitigation: Enforce HTTPS in deployment, short token expiry, and planned refresh-token strategy.

Risk R-003: Requirement drift between UI and API
- Impact: Medium
- Likelihood: Medium
- Mitigation: Shared contract package and strict typecheck in CI.

Risk R-004: Limited test coverage for edge cases
- Impact: Medium
- Likelihood: Medium
- Mitigation: Add service/unit tests and negative-path API tests in next sprint.

## 17. Gap Analysis and Next Iteration

Current MVP Strengths:
- End-to-end functional workflow complete
- Clean architecture and maintainability
- Good baseline security and validation

Current Gaps:
- No production-grade relational DB
- No refresh token lifecycle
- No advanced observability stack

Recommended Next Steps:
1. Migrate persistence to PostgreSQL with migrations.
2. Add refresh token strategy and logout invalidation model.
3. Add structured logging and request tracing.
4. Expand test suite for edge and failure paths.

## 18. Requirement Traceability Snapshot

- Auth requirements -> `authRoutes`, `authService`, `requireAuth`
- Validation requirements -> `schemas/*`, `validate` middleware
- Application lifecycle requirements -> application controller/service/repository
- Dashboard requirements -> `dashboardService`
- Quality requirements -> test + typecheck + build scripts

## 19. Sign-Off Checklist

- Functional scope aligned with MVP goals
- Non-functional constraints acknowledged
- Known risks documented
- Upgrade path identified
- Acceptance criteria testable and clear
