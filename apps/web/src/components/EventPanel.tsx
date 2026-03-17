import type { Application, CreateInterviewEventPayload, InterviewEvent } from "@offerpilot/shared";
import { useState } from "react";

import { interviewEventTypes } from "../constants";

interface EventPanelProps {
  application: Application | null;
  events: InterviewEvent[];
  pending: boolean;
  loading: boolean;
  onCreate: (payload: CreateInterviewEventPayload) => Promise<void>;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function EventPanel({ application, events, pending, loading, onCreate }: EventPanelProps) {
  const [type, setType] = useState<(typeof interviewEventTypes)[number]>("Interview");
  const [description, setDescription] = useState("");
  const [occurredOn, setOccurredOn] = useState(getTodayDate());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    await onCreate({
      type,
      description,
      occurredOn
    });

    setDescription("");
    setType("Interview");
    setOccurredOn(getTodayDate());
  }

  if (!application) {
    return (
      <section className="surface animate-rise">
        <h2>Interview Timeline</h2>
        <p className="empty-state">Select an application to log interview events and follow-ups.</p>
      </section>
    );
  }

  return (
    <section className="surface animate-rise">
      <h2>Interview Timeline</h2>
      <p className="panel-context">
        {application.company} - {application.role}
      </p>

      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          Event Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as (typeof interviewEventTypes)[number])}
          >
            {interviewEventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input
            required
            type="date"
            value={occurredOn}
            onChange={(event) => setOccurredOn(event.target.value)}
          />
        </label>

        <label className="field-wide">
          Description
          <textarea
            required
            minLength={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
        </label>

        <button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add Event"}
        </button>
      </form>

      <div className="event-list">
        {loading ? (
          <p className="empty-state">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="empty-state">No events logged yet.</p>
        ) : (
          events.map((eventItem) => (
            <article key={eventItem.id} className="event-item">
              <header>
                <strong>{eventItem.type}</strong>
                <span>{new Date(eventItem.occurredOn).toLocaleDateString()}</span>
              </header>
              <p>{eventItem.description}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
