export type Role = 'student' | 'admin';

export type EmergencyCategory =
  | 'Medical Emergency'
  | 'Fire'
  | 'Security Issue'
  | 'Accident'
  | 'Other';

export type ReportPriority = 'High' | 'Medium' | 'Low';

export type ReportStatus = 'Submitted' | 'In Progress' | 'Resolved';

export interface User {
  id: string;
  username: string;
  role: Role;
  fullName: string;
  rollNo?: string;
  department?: string;
  phone?: string;
  email?: string;
}

export interface EmergencyReport {
  id: string;
  studentUsername: string;
  studentName: string;
  rollNo?: string;
  category: EmergencyCategory;
  location: string;
  description: string;
  priority: ReportPriority;
  status: ReportStatus;
  matchedKeywords: string[];
  classificationReason: string;
  adminNotes?: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface ClassificationResult {
  priority: ReportPriority;
  matchedKeywords: string[];
  reason: string;
}
