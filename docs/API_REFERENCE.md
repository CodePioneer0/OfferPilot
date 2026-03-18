# API Reference

Base URL: `http://localhost:4000/api/v1`

## Health

### `GET /health`

Returns API service status.

```json
{
  "status": "ok"
}
```

## Auth

### `POST /auth/register`

Create a new user account.

Request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "StrongPass1"
}
```

Response: `201`

```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "name": "Ada Lovelace",
    "email": "ada@example.com"
  }
}
```

### `POST /auth/login`

Authenticate existing user.

Request body:

```json
{
  "email": "ada@example.com",
  "password": "StrongPass1"
}
```

Response: `200` with same payload shape as register.

## Applications (Protected)

All routes require:

`Authorization: Bearer <token>`

### `GET /applications`

Returns all applications for the authenticated user.

### `POST /applications`

Create a new job application.

Request body:

```json
{
  "company": "OpenAI",
  "role": "Full Stack Engineer",
  "stage": "Applied",
  "appliedOn": "2026-03-01",
  "location": "Remote",
  "jobUrl": "https://example.com/job",
  "salaryMin": 120000,
  "salaryMax": 160000,
  "notes": "Mission aligned"
}
```

### `PATCH /applications/:id`

Update one or more fields on an existing application.

### `DELETE /applications/:id`

Delete application and linked interview events.

Response: `204`

## Interview Events (Protected)

### `GET /applications/:id/events`

Returns interview events for one application.

### `POST /applications/:id/events`

Create an interview event.

Request body:

```json
{
  "type": "Interview",
  "description": "System design round completed",
  "occurredOn": "2026-03-10"
}
```

## Dashboard (Protected)

### `GET /dashboard/summary`

Returns aggregate metrics for the authenticated user.

Response example:

```json
{
  "totalApplications": 14,
  "activePipeline": 6,
  "offers": 1,
  "rejections": 4,
  "interviewsThisMonth": 3,
  "stageBreakdown": [
    { "stage": "Applied", "count": 5 },
    { "stage": "Technical Round", "count": 2 }
  ]
}
```

## Error Format

All errors use a normalized structure:

```json
{
  "message": "Human-readable error message"
}
```
