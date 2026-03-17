import type { Application, ApplicationStage } from "@offerpilot/shared";

import { applicationStageOptions } from "../constants";

interface ApplicationTableProps {
  applications: Application[];
  pending: boolean;
  selectedId: number | null;
  onSelect: (applicationId: number) => void;
  onStageChange: (applicationId: number, stage: ApplicationStage) => Promise<void>;
  onDelete: (applicationId: number) => Promise<void>;
}

export function ApplicationTable({
  applications,
  pending,
  selectedId,
  onSelect,
  onStageChange,
  onDelete
}: ApplicationTableProps) {
  return (
    <section className="surface animate-rise">
      <h2>Applications</h2>

      {applications.length === 0 ? (
        <p className="empty-state">No applications yet. Add your first target role.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Stage</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className={selectedId === application.id ? "is-selected" : ""}
                  onClick={() => onSelect(application.id)}
                >
                  <td>{application.company}</td>
                  <td>{application.role}</td>
                  <td>
                    <select
                      value={application.stage}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) =>
                        void onStageChange(application.id, event.target.value as ApplicationStage)
                      }
                    >
                      {applicationStageOptions.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(application.appliedOn).toLocaleDateString()}</td>
                  <td>
                    <button
                      type="button"
                      className="danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        void onDelete(application.id);
                      }}
                      disabled={pending}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
