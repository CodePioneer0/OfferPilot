import type { DashboardSummary } from "@offerpilot/shared";

import {
  countApplicationsByStages,
  countApplicationsForUser,
  getStageBreakdown
} from "../repositories/applicationRepository.js";
import { countInterviewsForMonth } from "../repositories/eventRepository.js";

export async function getDashboardSummary(userId: number): Promise<DashboardSummary> {
  const totalApplications = await countApplicationsForUser(userId);
  const activePipeline = await countApplicationsByStages(userId, [
    "Applied",
    "Phone Screen",
    "Technical Round",
    "Final Round"
  ]);
  const offers = await countApplicationsByStages(userId, ["Offer"]);
  const rejections = await countApplicationsByStages(userId, ["Rejected"]);

  const now = new Date();
  const monthPrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const interviewsThisMonth = await countInterviewsForMonth(userId, monthPrefix);

  return {
    totalApplications,
    activePipeline,
    offers,
    rejections,
    interviewsThisMonth,
    stageBreakdown: await getStageBreakdown(userId)
  };
}
