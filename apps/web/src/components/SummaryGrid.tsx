import type { DashboardSummary } from "@offerpilot/shared";

interface SummaryGridProps {
  summary: DashboardSummary;
}

const metricMeta: Array<{ key: keyof Omit<DashboardSummary, "stageBreakdown">; label: string }> = [
  { key: "totalApplications", label: "Total Applications" },
  { key: "activePipeline", label: "Active Pipeline" },
  { key: "offers", label: "Offers" },
  { key: "rejections", label: "Rejections" },
  { key: "interviewsThisMonth", label: "Interviews This Month" }
];

export function SummaryGrid({ summary }: SummaryGridProps) {
  return (
    <section className="surface animate-rise">
      <h2>Pipeline Snapshot</h2>
      <div className="metric-grid">
        {metricMeta.map((metric) => (
          <article key={metric.key} className="metric-card">
            <p>{metric.label}</p>
            <strong>{summary[metric.key]}</strong>
          </article>
        ))}
      </div>

      <div className="stage-breakdown">
        {summary.stageBreakdown.length === 0 ? (
          <p className="empty-state">No stage data yet.</p>
        ) : (
          summary.stageBreakdown.map((entry) => {
            const ratio = summary.totalApplications > 0 ? (entry.count / summary.totalApplications) * 100 : 0;

            return (
              <div key={entry.stage} className="stage-row">
                <span>{entry.stage}</span>
                <span>{entry.count}</span>
                <div className="meter">
                  <div className="meter-fill" style={{ width: `${Math.max(8, ratio)}%` }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
