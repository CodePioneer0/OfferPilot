import type {
  Application,
  AuthResponse,
  CreateApplicationPayload,
  CreateInterviewEventPayload,
  DashboardSummary,
  InterviewEvent,
  LoginPayload,
  RegisterPayload,
  UpdateApplicationPayload
} from "@offerpilot/shared";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() ?? "http://localhost:4000/api/v1";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const requestInit: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    }
  };

  if (options.body !== undefined) {
    requestInit.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, requestInit);

  if (!response.ok) {
    // A normalized error type keeps UI error handling predictable across all endpoints.
    let message = "Request failed";

    try {
      const errorBody = (await response.json()) as { message?: string };
      message = errorBody.message ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new ApiRequestError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload
  });
}

export function getApplications(token: string): Promise<Application[]> {
  return request<Application[]>("/applications", { token });
}

export function createApplication(
  token: string,
  payload: CreateApplicationPayload
): Promise<Application> {
  return request<Application>("/applications", {
    method: "POST",
    token,
    body: payload
  });
}

export function updateApplication(
  token: string,
  id: number,
  payload: UpdateApplicationPayload
): Promise<Application> {
  return request<Application>(`/applications/${id}`, {
    method: "PATCH",
    token,
    body: payload
  });
}

export function deleteApplication(token: string, id: number): Promise<void> {
  return request<void>(`/applications/${id}`, {
    method: "DELETE",
    token
  });
}

export function getApplicationEvents(token: string, id: number): Promise<InterviewEvent[]> {
  return request<InterviewEvent[]>(`/applications/${id}/events`, {
    token
  });
}

export function createApplicationEvent(
  token: string,
  id: number,
  payload: CreateInterviewEventPayload
): Promise<InterviewEvent> {
  return request<InterviewEvent>(`/applications/${id}/events`, {
    method: "POST",
    token,
    body: payload
  });
}

export function getDashboardSummary(token: string): Promise<DashboardSummary> {
  return request<DashboardSummary>("/dashboard/summary", {
    token
  });
}
