export interface UserProfile {
  skills: string[];
  targetRoles: string[];
  targetCities: string[];
  timeline: string;
  goal: string;
  experienceYears?: number;
  currentRole?: string;
  education?: string;
  resumeUploaded?: boolean;
}

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
}

export interface LaunchWindow {
  id: string;
  role: string;
  companyType: string;
  location: string;
  matchScore: number;
  salaryRange: string;
  isRemote: boolean;
}

export interface RiskFlag {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
}

export interface DashboardInsights {
  gravityScore: number;
  gravityTrend: number;
  priorityActions: PriorityAction[];
  launchWindows: LaunchWindow[];
  riskFlags: RiskFlag[];
}

export interface CareerPath {
  id: string;
  title: string;
  timeToTransitionMonths: number;
  salaryDeltaPct: number;
  riskScore: number;
  missingSkills: string[];
  certificationsNeeded: string[];
  isRemoteFriendly: boolean;
}

export interface CareerSimulationResult {
  safe: CareerPath;
  accelerated: CareerPath;
  bold: CareerPath;
}

export interface MigrationResult {
  salaryAdjustmentPct: number;
  costOfLivingDeltaPct: number;
  colBreakdown: { housing: number; food: number; transport: number; tax: number };
  demandScore: number;
  topCompanies: string[];
  visaNotes: string;
  opportunityScore: number;
  currentCityStats: CityStats;
  targetCityStats: CityStats;
}

export interface CityStats {
  city: string;
  avgSalary: string;
  colIndex: number;
  demandScore: number;
  qolScore: number;
  weather: string;
  topIndustries: string[];
}

export interface WeeklyResource {
  id: string;
  title: string;
  platform: string;
  durationHours: number;
  isFree: boolean;
  url: string;
}

export interface WeeklyPlan {
  weekNumber: number;
  topicTitle: string;
  description: string;
  timeEstimateHours: number;
  resources: WeeklyResource[];
  isCompleted: boolean;
}

export interface LearningPathResult {
  totalDurationWeeks: number;
  targetSkills: string[];
  estimatedSalaryUplift: string;
  weeklyPlans: WeeklyPlan[];
}

export interface SkillDemandResult {
  score: number;
  trend: 'Rising' | 'Neutral' | 'Decaying';
  salaryImpact: string;
  topCompanies: string[];
  relatedSkills: string[];
  timeToLearnWeeks: number;
}

export interface CityIntelligenceResult {
  demandScore: number;
  avgSalary: string;
  activeOpenings: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  topSkills: { skill: string; demand: number; category: string }[];
  companies: { name: string; openings: number; salary: string; remote: boolean }[];
  skillGaps: string[];
  insights: string[];
}
