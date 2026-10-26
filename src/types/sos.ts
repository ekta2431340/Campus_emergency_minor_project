export type EmergencyType =
  | 'Physical Threat / Harassment'
  | 'Medical Emergency'
  | 'Fire / Severe Hazard'
  | 'Ragging / Coercion'
  | 'Acoustic Distress (AI Detected)';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE';
export type IncidentStatus = 'DISPATCHED' | 'EN ROUTE' | 'ON SCENE' | 'RESOLVED';

export interface UserProfile {
  name: string;
  rollNo: string;
  department: string;
  phone: string;
  bloodGroup: string;
  hostelBlock: string;
  roomNo: string;
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phone: string;
  }>;
}

export interface CampusZone {
  id: string;
  name: string;
  building: string;
  lat: number;
  lng: number;
  xPercent: number; // For tactical map coordinates
  yPercent: number;
  riskLevel: 'Low' | 'Moderate' | 'High Risk';
  guardPost: string;
}

export interface DistressIncident {
  id: string;
  timestamp: string;
  studentName: string;
  rollNo: string;
  department: string;
  zone: string;
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
  emergencyType: EmergencyType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedGuard: string;
  etaMinutes: number;
  audioDetectedKeyword?: string;
  batteryLevel: number;
  medicalNotes: string;
}

export interface PatrolGuard {
  id: string;
  name: string;
  sector: string;
  status: 'Active Patrol' | 'Responding' | 'Stationary';
  phone: string;
  xPercent: number;
  yPercent: number;
}
