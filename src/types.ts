export interface Developer {
  id: number;
  documentId: string;
  name: string;
  role:
    | "Junior FrontEnd Developer"
    | "Mid FrontEnd Developer"
    | "Senior FrontEnd Developer"
    | "Junior BackEnd Developer"
    | "Mid BackEnd Developer"
    | "Senior BackEnd Developer"
    | "Junior FullStack Developer"
    | "Mid FullStack Developer"
    | "Senior FullStack Developer"
    | "FrontEnd Team Leader"
    | "Backend Team Leader";
  team: "FrontEnd" | "BackEnd";
  employmentStatus: "active" | "vacation" | "leave";
  skills: string[];
  joinDate: string;
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
  developer: Developer;
}

export interface DepartmentMetrics {
  name: string;
  "Average Rating": number;
  "Active Members": number;
  "Total Members": number;
}

export interface SkillMetric {
  name: string;
  value: number;
}

export interface PerformanceMetric {
  metric: string;
  value: number;
}
