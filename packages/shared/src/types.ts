export const applicationStages = [
  "Wishlist",
  "Applied",
  "Phone Screen",
  "Technical Round",
  "Final Round",
  "Offer",
  "Rejected"
] as const;

export type ApplicationStage = (typeof applicationStages)[number];

export interface ApiError {
  message: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Application {
  id: number;
  company: string;
  role: string;
  location: string | null;
  jobUrl: string | null;
  stage: ApplicationStage;
  salaryMin: number | null;
  salaryMax: number | null;
  appliedOn: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationPayload {
  company: string;
  role: string;
  location?: string;
  jobUrl?: string;
  stage: ApplicationStage;
  salaryMin?: number;
  salaryMax?: number;
  appliedOn: string;
  notes?: string;
}

export interface UpdateApplicationPayload {
  company?: string;
  role?: string;
  location?: string;
  jobUrl?: string;
  stage?: ApplicationStage;
  salaryMin?: number;
  salaryMax?: number;
  appliedOn?: string;
  notes?: string;
}

export interface InterviewEvent {
  id: number;
  applicationId: number;
  type: "Interview" | "Assessment" | "Follow Up";
  description: string;
  occurredOn: string;
  createdAt: string;
}

export interface CreateInterviewEventPayload {
  type: "Interview" | "Assessment" | "Follow Up";
  description: string;
  occurredOn: string;
}

export interface DashboardSummary {
  totalApplications: number;
  activePipeline: number;
  offers: number;
  rejections: number;
  interviewsThisMonth: number;
  stageBreakdown: Array<{
    stage: ApplicationStage;
    count: number;
  }>;
}
