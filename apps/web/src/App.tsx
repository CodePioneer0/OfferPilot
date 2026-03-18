import type {
  Application,
  CreateApplicationPayload,
  CreateInterviewEventPayload,
  DashboardSummary,
  InterviewEvent,
  LoginPayload,
  RegisterPayload
} from "@offerpilot/shared";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ApiRequestError,
  createApplication,
  createApplicationEvent,
  deleteApplication,
  getApplicationEvents,
  getApplications,
  getDashboardSummary,
  login,
  register,
  updateApplication
} from "./api/client";
import { ApplicationForm } from "./components/ApplicationForm";
import { ApplicationTable } from "./components/ApplicationTable";
import { AuthCard } from "./components/AuthCard";
import { EventPanel } from "./components/EventPanel";
import { SummaryGrid } from "./components/SummaryGrid";

const SESSION_STORAGE_KEY = "offerpilot_session";

type AuthMode = "login" | "register";

interface Session {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

function readSession(): Session | null {
  try {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return rawSession ? (JSON.parse(rawSession) as Session) : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(() => readSession());
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<number | null>(null);
  const [events, setEvents] = useState<InterviewEvent[]>([]);

  const [authPending, setAuthPending] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [dashboardPending, setDashboardPending] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState(false);
  const [eventPending, setEventPending] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);

  const selectedApplication = useMemo(
    () => applications.find((application) => application.id === selectedApplicationId) ?? null,
    [applications, selectedApplicationId]
  );

  const resetSession = useCallback(() => {
    setSession(null);
    clearSession();
    setApplications([]);
    setSummary(null);
    setSelectedApplicationId(null);
    setEvents([]);
  }, []);

  const handleApiFailure = useCallback(
    (error: unknown, fallbackMessage: string, setMessage: (message: string) => void): void => {
      if (error instanceof ApiRequestError) {
        if (error.status === 401) {
          resetSession();
        }
      }

      setMessage(getErrorMessage(error, fallbackMessage));
    },
    [resetSession]
  );

  const loadDashboard = useCallback(async (): Promise<void> => {
    if (!session) {
      return;
    }

    setDashboardPending(true);

    try {
      const [nextApplications, nextSummary] = await Promise.all([
        getApplications(session.token),
        getDashboardSummary(session.token)
      ]);

      setApplications(nextApplications);
      setSummary(nextSummary);

      if (
        selectedApplicationId !== null &&
        !nextApplications.some((application) => application.id === selectedApplicationId)
      ) {
        setSelectedApplicationId(null);
        setEvents([]);
      }

      setDashboardError(null);
    } catch (error) {
      handleApiFailure(error, "Failed to load dashboard", setDashboardError);
    } finally {
      setDashboardPending(false);
    }
  }, [handleApiFailure, selectedApplicationId, session]);

  const loadEvents = useCallback(
    async (applicationId: number): Promise<void> => {
      if (!session) {
        return;
      }

      setEventLoading(true);

      try {
        const nextEvents = await getApplicationEvents(session.token, applicationId);
        setEvents(nextEvents);
      } catch (error) {
        handleApiFailure(error, "Failed to load events", setDashboardError);
      } finally {
        setEventLoading(false);
      }
    },
    [handleApiFailure, session]
  );

  useEffect(() => {
    if (session) {
      void loadDashboard();
    }
  }, [loadDashboard, session]);

  async function handleAuthSubmit(
    mode: AuthMode,
    payload: RegisterPayload | LoginPayload
  ): Promise<void> {
    setAuthPending(true);

    try {
      const authResponse =
        mode === "register"
          ? await register(payload as RegisterPayload)
          : await login(payload as LoginPayload);

      const nextSession: Session = {
        token: authResponse.token,
        user: authResponse.user
      };

      setSession(nextSession);
      saveSession(nextSession);
      setAuthError(null);
    } catch (error) {
      setAuthError(getErrorMessage(error, "Authentication failed"));
    } finally {
      setAuthPending(false);
    }
  }

  async function handleCreateApplication(payload: CreateApplicationPayload): Promise<void> {
    if (!session) {
      return;
    }

    setActionPending(true);

    try {
      await createApplication(session.token, payload);
      await loadDashboard();
      setDashboardError(null);
    } catch (error) {
      handleApiFailure(error, "Failed to save application", setDashboardError);
    } finally {
      setActionPending(false);
    }
  }

  async function handleStageChange(applicationId: number, stage: Application["stage"]): Promise<void> {
    if (!session) {
      return;
    }

    setActionPending(true);

    try {
      await updateApplication(session.token, applicationId, { stage });
      await loadDashboard();
    } catch (error) {
      handleApiFailure(error, "Failed to update stage", setDashboardError);
    } finally {
      setActionPending(false);
    }
  }

  async function handleDelete(applicationId: number): Promise<void> {
    if (!session) {
      return;
    }

    setActionPending(true);

    try {
      await deleteApplication(session.token, applicationId);
      await loadDashboard();
    } catch (error) {
      handleApiFailure(error, "Failed to delete application", setDashboardError);
    } finally {
      setActionPending(false);
    }
  }

  async function handleSelect(applicationId: number): Promise<void> {
    setSelectedApplicationId(applicationId);
    await loadEvents(applicationId);
  }

  async function handleCreateEvent(payload: CreateInterviewEventPayload): Promise<void> {
    if (!session || selectedApplicationId === null) {
      return;
    }

    setEventPending(true);

    try {
      await createApplicationEvent(session.token, selectedApplicationId, payload);
      await Promise.all([loadEvents(selectedApplicationId), loadDashboard()]);
    } catch (error) {
      handleApiFailure(error, "Failed to add event", setDashboardError);
    } finally {
      setEventPending(false);
    }
  }

  if (!session) {
    return (
      <main className="auth-shell">
        <AuthCard pending={authPending} errorMessage={authError} onSubmit={handleAuthSubmit} />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar animate-rise">
        <div>
          <p className="eyebrow">OfferPilot</p>
          <h1>Job Search Command Center</h1>
        </div>

        <div className="topbar-actions">
          <p>
            <strong>{session.user.name}</strong>
            <br />
            {session.user.email}
          </p>
          <button type="button" className="ghost" onClick={resetSession}>
            Logout
          </button>
        </div>
      </header>

      {dashboardError ? <p className="error-banner">{dashboardError}</p> : null}

      {dashboardPending && !summary ? (
        <section className="surface animate-rise">
          <p className="empty-state">Loading dashboard...</p>
        </section>
      ) : null}

      {summary ? <SummaryGrid summary={summary} /> : null}

      <section className="layout-grid">
        <div className="column-stack">
          <ApplicationForm pending={actionPending} onCreate={handleCreateApplication} />
          <ApplicationTable
            applications={applications}
            pending={actionPending}
            selectedId={selectedApplicationId}
            onSelect={(applicationId: number) => {
              void handleSelect(applicationId);
            }}
            onStageChange={handleStageChange}
            onDelete={handleDelete}
          />
        </div>

        <EventPanel
          application={selectedApplication}
          events={events}
          pending={eventPending}
          loading={eventLoading}
          onCreate={handleCreateEvent}
        />
      </section>
    </main>
  );
}
