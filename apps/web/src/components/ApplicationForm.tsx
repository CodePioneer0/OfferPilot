import type { CreateApplicationPayload } from "@offerpilot/shared";
import { useState } from "react";

import { applicationStageOptions } from "../constants";

interface ApplicationFormProps {
  pending: boolean;
  onCreate: (payload: CreateApplicationPayload) => Promise<void>;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ApplicationForm({ pending, onCreate }: ApplicationFormProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [stage, setStage] = useState<(typeof applicationStageOptions)[number]>("Applied");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [appliedOn, setAppliedOn] = useState(getTodayDate());
  const [notes, setNotes] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const payload: CreateApplicationPayload = {
      company: company.trim(),
      role: role.trim(),
      stage,
      appliedOn
    };

    if (location.trim()) {
      payload.location = location.trim();
    }

    if (jobUrl.trim()) {
      payload.jobUrl = jobUrl.trim();
    }

    if (salaryMin.trim()) {
      payload.salaryMin = Number(salaryMin);
    }

    if (salaryMax.trim()) {
      payload.salaryMax = Number(salaryMax);
    }

    if (notes.trim()) {
      payload.notes = notes.trim();
    }

    await onCreate(payload);

    setCompany("");
    setRole("");
    setLocation("");
    setJobUrl("");
    setStage("Applied");
    setSalaryMin("");
    setSalaryMax("");
    setAppliedOn(getTodayDate());
    setNotes("");
  }

  return (
    <section className="surface animate-rise">
      <h2>Add Application</h2>
      <form className="application-form" onSubmit={handleSubmit}>
        <label>
          Company
          <input required value={company} onChange={(event) => setCompany(event.target.value)} />
        </label>

        <label>
          Role
          <input required value={role} onChange={(event) => setRole(event.target.value)} />
        </label>

        <label>
          Location
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Remote" />
        </label>

        <label>
          Job URL
          <input
            type="url"
            value={jobUrl}
            onChange={(event) => setJobUrl(event.target.value)}
            placeholder="https://"
          />
        </label>

        <label>
          Stage
          <select
            value={stage}
            onChange={(event) => setStage(event.target.value as (typeof applicationStageOptions)[number])}
          >
            {applicationStageOptions.map((stageOption) => (
              <option key={stageOption} value={stageOption}>
                {stageOption}
              </option>
            ))}
          </select>
        </label>

        <label>
          Applied On
          <input
            required
            type="date"
            value={appliedOn}
            onChange={(event) => setAppliedOn(event.target.value)}
          />
        </label>

        <label>
          Salary Min
          <input
            type="number"
            min={0}
            value={salaryMin}
            onChange={(event) => setSalaryMin(event.target.value)}
          />
        </label>

        <label>
          Salary Max
          <input
            type="number"
            min={0}
            value={salaryMax}
            onChange={(event) => setSalaryMax(event.target.value)}
          />
        </label>

        <label className="field-wide">
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
        </label>

        <button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Application"}
        </button>
      </form>
    </section>
  );
}
