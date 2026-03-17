import type { DashboardSummary } from "@offerpilot/shared";

import {
  countApplicationsByStages,
  countApplicationsForUser,
  getStageBreakdown
} from "../repositories/applicationRepository.js";
import { countInterviewsForMonth } from "../repositories/eventRepository.js";

export function getDashboardSummary(userId: number): DashboardSummary {
  const totalApplications = countApplicationsForUser(userId);
  const activePipeline = countApplicationsByStages(userId, [
    "Applied",
    "Phone Screen",
    "Technical Round",
    "Final Round"
  ]);
  const offers = countApplicationsByStages(userId, ["Offer"]);
  const rejections = countApplicationsByStages(userId, ["Rejected"]);

  const now = new Date();
  const monthPrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const interviewsThisMonth = countInterviewsForMonth(userId, monthPrefix);

  return {
    totalApplications,
    activePipeline,
    offers,
    rejections,
    interviewsThisMonth,
    stageBreakdown: getStageBreakdown(userId)
  };
}
