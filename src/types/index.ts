export interface Developer {
  id: number;
  documentId: string;
  name: string;
  role: string;
  team: string;
  employmentStatus: "active" | "vacation" | "leave";
  skills: string[];
  joinDate: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Review {
  id: number;
  documentId: string;
  date: string;
  codeQuality: number;
  communication: number;
  teamwork: number;
  delivery: number;
  strengths: string[];
  improvements: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface DepartmentStats {
  totalDevelopers: number;
  activeProjects: number;
  averageRating: number;
  performanceChange: number;
  teamMetrics: {
    team: string;
    developers: number;
    avgRating: number;
    projectsCompleted: number;
  }[];
  skillDistribution: {
    skill: string;
    count: number;
  }[];
  performanceMetrics: {
    metric: string;
    score: number;
  }[];
}
