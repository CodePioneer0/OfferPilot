import type { ApplicationStage } from "@offerpilot/shared";

export const applicationStageOptions: ApplicationStage[] = [
  "Wishlist",
  "Applied",
  "Phone Screen",
  "Technical Round",
  "Final Round",
  "Offer",
  "Rejected"
];

export const interviewEventTypes = ["Interview", "Assessment", "Follow Up"] as const;
