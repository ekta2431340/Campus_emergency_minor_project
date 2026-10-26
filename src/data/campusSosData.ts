import { UserProfile, CampusZone, PatrolGuard, DistressIncident } from '../types/sos';

export const initialUserProfile: UserProfile = {
  name: "Musskan Verma",
  rollNo: "22005011001",
  department: "BCA (Computer Applications) 5th Sem",
  phone: "+91 98765 43210",
  bloodGroup: "O+ve",
  hostelBlock: "Girls Hostel 2",
  roomNo: "Room 314",
  emergencyContacts: [
    { name: "Prof. Rajesh Sharma (Proctor)", relation: "Campus Mentor", phone: "+91 94150 12345" },
    { name: "Campus Security Control Room", relation: "PSIT Emergency Desk", phone: "+91 512 269 6400" },
    { name: "Priya Verma", relation: "Sister / Guardian", phone: "+91 99360 88771" }
  ]
};

export const PSIT_CAMPUS_ZONES: CampusZone[] = [
  {
    id: "zone-acad-b",
    name: "Academic Block B (Computer Labs 3 & 4)",
    building: "Academic Block B",
    lat: 26.4499,
    lng: 80.3319,
    xPercent: 42,
    yPercent: 38,
    riskLevel: "Moderate",
    guardPost: "Post 3 - Central Foyer"
  },
  {
    id: "zone-lib",
    name: "Central Library & Digital Reading Hall",
    building: "Central Library",
    lat: 26.4488,
    lng: 80.3308,
    xPercent: 32,
    yPercent: 48,
    riskLevel: "Low",
    guardPost: "Post 2 - Library Desk"
  },
  {
    id: "zone-gh",
    name: "Girls Hostel Complex & Garden Pathway",
    building: "Girls Hostel 2",
    lat: 26.4518,
    lng: 80.3345,
    xPercent: 78,
    yPercent: 28,
    riskLevel: "High Risk",
    guardPost: "Post 6 - GH Checkpoint"
  },
  {
    id: "zone-bh",
    name: "Boys Hostel Courtyard & Dining Hall",
    building: "Boys Hostel 1",
    lat: 26.4475,
    lng: 80.3365,
    xPercent: 82,
    yPercent: 72,
    riskLevel: "Moderate",
    guardPost: "Post 5 - BH Security"
  },
  {
    id: "zone-sports",
    name: "Sports Complex Pavilion & Rear Walkway",
    building: "Sports Arena",
    lat: 26.4462,
    lng: 80.3290,
    xPercent: 22,
    yPercent: 78,
    riskLevel: "High Risk",
    guardPost: "Patrol Unit Delta"
  },
  {
    id: "zone-gate1",
    name: "Main Campus Gate 1 & NH-19 Highway Bay",
    building: "Gate 1 Checkpoint",
    lat: 26.4532,
    lng: 80.3358,
    xPercent: 55,
    yPercent: 12,
    riskLevel: "Low",
    guardPost: "Main Gate Security Room"
  }
];

export const initialPatrolGuards: PatrolGuard[] = [
  {
    id: "guard-1",
    name: "Havildar Ramesh Singh",
    sector: "Sector 1 (Hostels & Perimeter)",
    status: "Active Patrol",
    phone: "+91 94150 77112",
    xPercent: 70,
    yPercent: 32
  },
  {
    id: "guard-2",
    name: "Officer Manoj Tiwari",
    sector: "Sector 2 (Academic Blocks A & B)",
    status: "Active Patrol",
    phone: "+91 94150 77113",
    xPercent: 40,
    yPercent: 42
  },
  {
    id: "guard-3",
    name: "Officer Sunita Rawat",
    sector: "Sector 3 (Girls Hostel & Canteen)",
    status: "Active Patrol",
    phone: "+91 94150 77114",
    xPercent: 75,
    yPercent: 25
  },
  {
    id: "guard-4",
    name: "Quick Response Unit (Vehicle QRT-1)",
    sector: "Central Quadrangle & Highway Gate",
    status: "Stationary",
    phone: "+91 512 269 6401",
    xPercent: 50,
    yPercent: 20
  }
];

export const initialIncidents: DistressIncident[] = [
  {
    id: "SOS-2026-904",
    timestamp: "10:42 PM (12 mins ago)",
    studentName: "Ananya Dixit",
    rollNo: "22005011003",
    department: "BCA 5th Sem",
    zone: "Girls Hostel Complex & Garden Pathway",
    lat: 26.4518,
    lng: 80.3345,
    xPercent: 78,
    yPercent: 28,
    emergencyType: "Physical Threat / Harassment",
    severity: "HIGH",
    status: "EN ROUTE",
    assignedGuard: "Officer Sunita Rawat",
    etaMinutes: 1.5,
    batteryLevel: 68,
    medicalNotes: "Asthmatic, inhaler in backpack"
  }
];
