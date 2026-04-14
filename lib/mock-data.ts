import { 
  DashboardInsights, 
  CareerSimulationResult, 
  MigrationResult, 
  LearningPathResult, 
  SkillDemandResult, 
  CityIntelligenceResult 
} from '@/types';

export const mockDashboardInsights: DashboardInsights = {
  gravityScore: 68,
  gravityTrend: 5,
  priorityActions: [
    { id: '1', title: 'Add TypeScript to profile', description: '80% of jobs for AI Architect require it natively.', effort: 'Low', impact: 'High' },
    { id: '2', title: 'Complete Cloud Cert', description: 'GCP or AWS associate cert boosts interview rate by 14%.', effort: 'Medium', impact: 'High' },
    { id: '3', title: 'Update Location Preferences', description: 'Your target cities match 12 active roles right now.', effort: 'Low', impact: 'Medium' }
  ],
  launchWindows: [
    { id: '1', role: 'Staff Eng', companyType: 'Fintech Startup', location: 'Remote', matchScore: 88, salaryRange: '$140k-$160k', isRemote: true },
    { id: '2', role: 'AI Solutions', companyType: 'Enterprise', location: 'San Francisco', matchScore: 82, salaryRange: '$150k-$180k', isRemote: false },
    { id: '3', role: 'Lead Frontend', companyType: 'E-commerce', location: 'Remote', matchScore: 91, salaryRange: '$120k-$145k', isRemote: true },
    { id: '4', role: 'Cloud Arch', companyType: 'Agency', location: 'London', matchScore: 75, salaryRange: '£90k-£110k', isRemote: false },
    { id: '5', role: 'Tech Lead', companyType: 'Series B', location: 'Remote', matchScore: 78, salaryRange: '$135k-$150k', isRemote: true }
  ],
  riskFlags: [
    { id: '1', title: '3 skills decaying in local market', severity: 'Critical' },
    { id: '2', title: 'Profile 40% incomplete', severity: 'Warning' },
    { id: '3', title: 'Angular demand hit 12mo low', severity: 'Info' }
  ]
};

export const mockCareerPath: CareerSimulationResult = {
  safe: {
    id: 'safe',
    title: 'Incremental Growth',
    timeToTransitionMonths: 6,
    salaryDeltaPct: 15,
    riskScore: 2,
    missingSkills: ['System Design', 'CI/CD Pipelines'],
    certificationsNeeded: [],
    isRemoteFriendly: true
  },
  accelerated: {
    id: 'accelerated',
    title: 'Fast Track Pivot',
    timeToTransitionMonths: 3,
    salaryDeltaPct: 28,
    riskScore: 6,
    missingSkills: ['Kubernetes', 'Cloud Architecture', 'Go'],
    certificationsNeeded: ['AWS Solutions Architect'],
    isRemoteFriendly: true
  },
  bold: {
    id: 'bold',
    title: 'Disruptive Jump',
    timeToTransitionMonths: 12,
    salaryDeltaPct: 55,
    riskScore: 9,
    missingSkills: ['Machine Learning', 'CUDA', 'Transformer Models', 'Python'],
    certificationsNeeded: ['DeepLearning.AI Spec'],
    isRemoteFriendly: false
  }
};

export const mockMigrationResult: MigrationResult = {
  salaryAdjustmentPct: 35,
  costOfLivingDeltaPct: 45,
  colBreakdown: { housing: 60, food: 20, transport: -10, tax: 15 },
  demandScore: 88,
  topCompanies: ['Google', 'Stripe', 'Atlassian', 'Uber', 'Local Fintechs'],
  visaNotes: 'H1B required. Median wait time 18 months.',
  opportunityScore: 78,
  currentCityStats: {
    city: 'Current',
    avgSalary: '$85,000',
    colIndex: 65,
    demandScore: 50,
    qolScore: 70,
    weather: 'Sunny',
    topIndustries: ['Banking', 'Retail']
  },
  targetCityStats: {
    city: 'Target',
    avgSalary: '$135,000',
    colIndex: 110,
    demandScore: 92,
    qolScore: 85,
    weather: 'Cloudy',
    topIndustries: ['Tech', 'AI', 'Biotech']
  }
};

export const mockLearningPath: LearningPathResult = {
  totalDurationWeeks: 8,
  targetSkills: ['React', 'Next.js', 'Tailwind'],
  estimatedSalaryUplift: '+$15k',
  weeklyPlans: [
    {
      weekNumber: 1,
      topicTitle: 'React Fundamentals',
      description: 'Master state, props, and components',
      timeEstimateHours: 8,
      isCompleted: false,
      resources: [
        { id: '1', title: 'React Official Docs', platform: 'Docs', durationHours: 4, isFree: true, url: '#' },
        { id: '2', title: 'Epic React Dev', platform: 'Udemy', durationHours: 4, isFree: false, url: '#' }
      ]
    },
    {
      weekNumber: 2,
      topicTitle: 'Next.js App Router',
      description: 'Server components and routing',
      timeEstimateHours: 10,
      isCompleted: false,
      resources: [
        { id: '3', title: 'Next.js Course', platform: 'YouTube', durationHours: 5, isFree: true, url: '#' }
      ]
    }
  ]
};

export const mockSkillDemand: SkillDemandResult = {
  score: 85,
  trend: 'Rising',
  salaryImpact: '+$12k avg',
  topCompanies: ['Netflix', 'Vercel', 'Meta'],
  relatedSkills: ['TypeScript', 'GraphQL', 'Node.js'],
  timeToLearnWeeks: 6
};

export const mockCityIntelligence: CityIntelligenceResult = {
  demandScore: 91,
  avgSalary: '$145,000',
  activeOpenings: 1245,
  competitionLevel: 'High',
  topSkills: [
    { skill: 'React', demand: 98, category: 'Frontend' },
    { skill: 'Python', demand: 95, category: 'Backend' },
    { skill: 'AWS', demand: 90, category: 'DevOps' }
  ],
  companies: [
    { name: 'TechCorp', openings: 45, salary: '$150k', remote: true },
    { name: 'FintechOS', openings: 32, salary: '$160k', remote: false }
  ],
  skillGaps: ['TypeScript', 'GraphQL'],
  insights: [
    'Tech hiring increased 15% this month',
    'Remote roles constitute 40% of openings',
    'React engineers command an 8% premium here'
  ]
};
